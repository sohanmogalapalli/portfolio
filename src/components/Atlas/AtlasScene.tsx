import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";
import type { AtlasDomain, AtlasDomainMeta, AtlasNode } from "@/types";
import AchievementNode from "./AchievementNode";
import { DOMAIN_COLORS } from "./atlasLayout";

const RING_RADII = [6, 9, 12, 15];

/* ── Starfield ───────────────────────────────────────────────────────── */

/** Points scattered through a thick shell, rotating almost imperceptibly. */
function Starfield({ count = 1400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = 36 + Math.random() * 48;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = radius * Math.cos(phi) * 0.7;
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    return array;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.4}
        color="#9fb5ac"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ── Core ────────────────────────────────────────────────────────────── */

/** Wireframe nucleus the constellations grow out of. */
function Core() {
  const shellRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const shell = shellRef.current;
    if (!shell) return;

    shell.rotation.y += delta * 0.14;
    shell.rotation.x += delta * 0.05;
    shell.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.05);
  });

  return (
    <group>
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color="#4ADE80" wireframe transparent opacity={0.26} />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.15, 24, 24]} />
        <meshBasicMaterial
          color="#86EFAC"
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <pointLight color="#4ADE80" intensity={34} distance={34} decay={2} />
    </group>
  );
}

/* ── Ground rings ────────────────────────────────────────────────────── */

/** Concentric rings under the map, reinforcing the "cartography" idea. */
function GroundRings() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const segments = 96;

    RING_RADII.forEach((radius) => {
      for (let i = 0; i < segments; i += 1) {
        const a0 = (i / segments) * Math.PI * 2;
        const a1 = ((i + 1) / segments) * Math.PI * 2;

        positions.push(Math.cos(a0) * radius, 0, Math.sin(a0) * radius);
        positions.push(Math.cos(a1) * radius, 0, Math.sin(a1) * radius);
      }
    });

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

    return buffer;
  }, []);

  // Imperatively built geometry is not owned by the renderer, so free it.
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry} position={[0, -3.7, 0]}>
      <lineBasicMaterial color="#4ADE80" transparent opacity={0.09} depthWrite={false} />
    </lineSegments>
  );
}

/* ── Link web ────────────────────────────────────────────────────────── */

interface LinkWebProps {
  nodes: AtlasNode[];
  domains: AtlasDomainMeta[];
  activeDomain: AtlasDomain | null;
}

/**
 * Two kinds of edge: a radial spoke tying every achievement back to the core,
 * and a chain threading each domain's nodes together in radius order. Combined
 * vertex colours mean dimming is a straight colour multiply — no per-vertex
 * alpha, which line materials cannot do.
 */
function LinkWeb({ nodes, domains, activeDomain }: LinkWebProps) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const color = new THREE.Color();

    const push = (a: readonly number[], b: readonly number[], hex: string, dim: boolean) => {
      positions.push(a[0], a[1], a[2], b[0], b[1], b[2]);

      color.set(hex);
      if (dim) color.multiplyScalar(0.16);

      colors.push(color.r, color.g, color.b, color.r, color.g, color.b);
    };

    nodes.forEach((node) => {
      const dim = activeDomain !== null && node.domain !== activeDomain;
      push([0, node.position[1] * 0.3, 0], node.position, DOMAIN_COLORS[node.domain], dim);
    });

    domains.forEach((domain) => {
      const members = nodes
        .filter((node) => node.domain === domain.id)
        .sort((a, b) => a.radius - b.radius);

      for (let i = 0; i < members.length - 1; i += 1) {
        const dim = activeDomain !== null && domain.id !== activeDomain;
        push(members[i].position, members[i + 1].position, DOMAIN_COLORS[domain.id], dim);
      }
    });

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    buffer.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    return buffer;
  }, [nodes, domains, activeDomain]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  // Slow breathing pulse across the whole web.
  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.opacity = 0.34 + Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        vertexColors
        transparent
        opacity={0.34}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* ── Camera rig ──────────────────────────────────────────────────────── */

interface CameraRigProps {
  focus: [number, number, number] | null;
  autoRotate: boolean;
  onUserInteract: () => void;
}

/**
 * Owns OrbitControls imperatively (no `extend`, so no JSX namespace
 * augmentation needed) and animates a fly-to whenever the selection changes.
 */
function CameraRig({ focus, autoRotate, onUserInteract }: CameraRigProps) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControls | null>(null);

  const flyTarget = useRef(new THREE.Vector3());
  const flyCamera = useRef(new THREE.Vector3());
  const flying = useRef(false);

  // Refs keep the callbacks out of effect deps, so OrbitControls is built once.
  const autoRotateRef = useRef(autoRotate);
  const onUserInteractRef = useRef(onUserInteract);
  autoRotateRef.current = autoRotate;
  onUserInteractRef.current = onUserInteract;

  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 7;
    controls.maxDistance = 46;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI * 0.78;
    controls.autoRotateSpeed = 0.5;
    controls.target.set(0, 1.2, 0);

    const handleStart = () => onUserInteractRef.current();
    controls.addEventListener("start", handleStart);
    controlsRef.current = controls;

    return () => {
      controls.removeEventListener("start", handleStart);
      controls.dispose();
      controlsRef.current = null;
    };
  }, [camera, gl]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls || !focus) return;

    flyTarget.current.set(focus[0], focus[1], focus[2]);

    // Approach from wherever the viewer currently is, at a fixed distance.
    const direction = camera.position.clone().sub(controls.target).normalize();
    flyCamera.current.copy(flyTarget.current).addScaledVector(direction, 11);

    flying.current = true;
  }, [focus, camera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (flying.current) {
      const damp = Math.min(1, 1 - Math.pow(0.0009, delta));
      controls.target.lerp(flyTarget.current, damp);
      camera.position.lerp(flyCamera.current, damp);

      if (camera.position.distanceTo(flyCamera.current) < 0.3) flying.current = false;
    }

    controls.autoRotate = autoRotateRef.current && !flying.current;
    controls.update();
  });

  return null;
}

/* ── Scene ───────────────────────────────────────────────────────────── */

export interface AtlasSceneProps {
  nodes: AtlasNode[];
  domains: AtlasDomainMeta[];
  activeDomain: AtlasDomain | null;
  selectedId: string | null;
  autoRotate: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onUserInteract: () => void;
}

export default function AtlasScene({
  nodes,
  domains,
  activeDomain,
  selectedId,
  autoRotate,
  onSelect,
  onHover,
  onUserInteract,
}: AtlasSceneProps) {
  const focusNode = selectedId ? nodes.find((node) => node.id === selectedId) : undefined;
  const focus = focusNode ? focusNode.position : null;

  return (
    <>
      <fog attach="fog" args={["#09090B", 22, 62]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 14, 10]} intensity={1.1} color="#cfe8dd" />
      <directionalLight position={[-10, -6, -8]} intensity={0.4} color="#38BDF8" />

      <Starfield />
      <GroundRings />
      <Core />
      <LinkWeb nodes={nodes} domains={domains} activeDomain={activeDomain} />

      {nodes.map((node) => (
        <AchievementNode
          key={node.id}
          node={node}
          color={DOMAIN_COLORS[node.domain]}
          dimmed={activeDomain !== null && node.domain !== activeDomain}
          selected={selectedId === node.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      <CameraRig focus={focus} autoRotate={autoRotate} onUserInteract={onUserInteract} />
    </>
  );
}
