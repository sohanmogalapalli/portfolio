import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AtlasDomain, AtlasNode } from "@/types";
import AchievementNode from "./AchievementNode";
import Starfield from "./Starfield";
import { buildJourneyStops, DOMAIN_COLORS } from "./atlasLayout";

/**
 * A scroll-driven flythrough of the achievement atlas. Progress is driven
 * externally via a mutable ref that the parent updates from wheel events on
 * the journey viewport container.
 */

const TURN_HEIGHT = 4.6;
const TURN_ARC = (Math.PI * 2) / 5.5;
const PATH_RADIUS = 16.5;
const CAMERA_RADIUS = PATH_RADIUS + 5.5;

/** Camera pilot: progress ref in, eased helix flight out. */
function ScrollCamera({
  progressRef,
  stopCount,
  onProgress,
}: {
  progressRef: MutableRefObject<number>;
  stopCount: number;
  onProgress: (value: number) => void;
}) {
  const { camera } = useThree();
  const current = useRef(0);
  const lastReported = useRef(-1);

  useFrame((_, delta) => {
    const raw = progressRef.current;
    current.current += (raw - current.current) * Math.min(1, delta * 3.2);

    const stopsTravelled = current.current * Math.max(1, stopCount - 1);
    const angle = stopsTravelled * TURN_ARC;
    const height = 2.5 + stopsTravelled * TURN_HEIGHT;

    const destination = new THREE.Vector3(
      Math.cos(angle) * CAMERA_RADIUS,
      height,
      Math.sin(angle) * CAMERA_RADIUS
    );
    const lookAheadAngle = angle + 1.2 * TURN_ARC;
    const lookTarget = new THREE.Vector3(
      Math.cos(lookAheadAngle) * PATH_RADIUS * 0.45,
      height + 0.6,
      Math.sin(lookAheadAngle) * PATH_RADIUS * 0.45
    );

    camera.position.lerp(destination, Math.min(1, delta * 4));
    camera.lookAt(lookTarget);

    const percent = Math.round(current.current * 100);
    if (percent !== lastReported.current) {
      lastReported.current = percent;
      onProgress(Math.min(1, Math.max(0, current.current)));
    }
  });

  return null;
}

/** Ambient guide rails hinting at the travel direction. */
function GuideRails() {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const segments = 160;
    const totalStops = 5.5;

    [-4.2, 4.2].forEach((offset) => {
      for (let i = 0; i <= segments; i += 1) {
        const a0 = (i / segments) * Math.PI * 2 * totalStops;
        const r = PATH_RADIUS + offset;

        positions.push(
          Math.cos(a0) * r,
          2.5 + (i / segments) * TURN_HEIGHT * totalStops,
          Math.sin(a0) * r
        );
      }
    });

    const buffer = new THREE.BufferGeometry();
    buffer.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return buffer;
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#4ADE80" transparent opacity={0.06} depthWrite={false} />
    </lineSegments>
  );
}

export interface Timeline3DProps {
  nodes: AtlasNode[];
  activeDomain: AtlasDomain | null;
  selectedId: string | null;
  /** Externally-driven progress ref (0..1). Parent updates via wheel events. */
  progressRef: MutableRefObject<number>;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onProgress: (value: number) => void;
}

export default function Timeline3D({
  nodes,
  activeDomain,
  selectedId,
  progressRef,
  onSelect,
  onHover,
  onProgress,
}: Timeline3DProps) {
  const stops = useMemo(() => buildJourneyStops(nodes), [nodes]);

  const journeyNodes = useMemo(() => {
    return stops.map((node, index) => {
      const angle = index * TURN_ARC;
      const y = 2.5 + index * TURN_HEIGHT;

      return {
        ...node,
        position: [
          Math.cos(angle) * PATH_RADIUS,
          y,
          Math.sin(angle) * PATH_RADIUS,
        ] as [number, number, number],
        radius: PATH_RADIUS,
      };
    });
  }, [stops]);

  return (
    <Canvas
      camera={{ position: [CAMERA_RADIUS, 2.5, 0], fov: 58, near: 0.1, far: 260 }}
      dpr={[1, 1.75]}
      flat
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onSelect(null)}
    >
      <fog attach="fog" args={["#09090B", 20, 62]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 14, 10]} intensity={1.1} color="#cfe8dd" />
      <directionalLight position={[-10, -6, -8]} intensity={0.4} color="#38BDF8" />

      <Starfield follow />
      <GuideRails />

      {journeyNodes.map((node) => (
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

      <ScrollCamera progressRef={progressRef} stopCount={stops.length} onProgress={onProgress} />
    </Canvas>
  );
}
