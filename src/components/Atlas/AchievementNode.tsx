import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { AtlasNode } from "@/types";

interface AchievementNodeProps {
  node: AtlasNode;
  color: string;
  /** Dimmed nodes stay visible but recede when a domain filter is active. */
  dimmed: boolean;
  selected: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

/**
 * A single achievement rendered as a faceted gem. Each domain uses a different
 * solid, so category is readable from shape alone — colour is a redundant cue
 * rather than the only signal.
 */
export default function AchievementNode({
  node,
  color,
  dimmed,
  selected,
  onSelect,
  onHover,
}: AchievementNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  // Scalar animation state kept in refs so useFrame never allocates.
  const scale = useRef(1);
  const glowOpacity = useRef(0.12);

  const [hovered, setHovered] = useState(false);

  const size = 0.52 + node.weight * 0.14;

  // Stable per-node phase so the drifting never looks synchronised.
  const phase = useMemo(() => node.position[0] * 1.7 + node.position[2] * 0.9, [node.position]);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const mesh = meshRef.current;
    const glow = glowRef.current;
    if (!group || !mesh || !glow) return;

    const t = state.clock.elapsedTime;
    const damp = Math.min(1, 1 - Math.pow(0.0015, delta));
    const active = hovered || selected;

    // Faceted gems tumble; the selected one spins up.
    mesh.rotation.y += delta * (selected ? 0.9 : 0.28);
    mesh.rotation.x += delta * 0.12;

    const wantedScale = active ? 1.42 : 1;
    scale.current += (wantedScale - scale.current) * damp;
    mesh.scale.setScalar(scale.current);

    // Gentle vertical drift so the constellation feels alive.
    group.position.y = node.position[1] + Math.sin(t * 0.7 + phase) * 0.16;

    // Emissive response plus a breathing pulse while selected.
    const pulse = selected ? 0.5 + Math.sin(t * 3.2) * 0.5 : 0;
    const material = mesh.material as THREE.MeshStandardMaterial;
    const wantedEmissive = (dimmed ? 0.25 : 0.95) + (active ? 0.9 : 0) + pulse * 0.7;
    material.emissiveIntensity += (wantedEmissive - material.emissiveIntensity) * damp;

    const wantedGlow = dimmed ? 0.04 : active ? 0.26 : 0.12;
    glowOpacity.current += (wantedGlow - glowOpacity.current) * damp;
    (glow.material as THREE.MeshBasicMaterial).opacity = glowOpacity.current;
    glow.scale.setScalar(2.1 + (active ? 0.9 : 0) + pulse * 0.35);

    const halo = haloRef.current;
    if (halo) {
      halo.rotation.z += delta * 0.6;
      const haloMaterial = halo.material as THREE.MeshBasicMaterial;
      haloMaterial.opacity += ((selected ? 0.55 : 0) - haloMaterial.opacity) * damp;
      halo.scale.setScalar(selected ? 1.9 : 1.4);
    }
  });

  return (
    <group ref={groupRef} position={node.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          onHover(node.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = "";
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
      >
        {node.domain === "academics" && <icosahedronGeometry args={[size, 0]} />}
        {node.domain === "engineering" && <boxGeometry args={[size * 1.5, size * 1.5, size * 1.5]} />}
        {node.domain === "skills" && <octahedronGeometry args={[size * 1.3, 0]} />}
        {node.domain === "goals" && <tetrahedronGeometry args={[size * 1.6, 0]} />}

        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={dimmed ? 0.25 : 0.95}
          roughness={0.25}
          metalness={0.55}
          flatShading
          transparent
          opacity={dimmed ? 0.35 : 1}
        />
      </mesh>

      {/* Additive glow shell — a cheap stand-in for post-processing bloom. */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[size * 1.05, 16, 16]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Selection halo */}
      <mesh ref={haloRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[size * 1.9, 0.02, 8, 64]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
