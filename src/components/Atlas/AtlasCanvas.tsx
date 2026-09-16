import { Canvas } from "@react-three/fiber";
import type { AtlasDomain, AtlasDomainMeta, AtlasNode } from "@/types";
import AtlasScene from "./AtlasScene";

export interface AtlasCanvasProps {
  nodes: AtlasNode[];
  domains: AtlasDomainMeta[];
  activeDomain: AtlasDomain | null;
  selectedId: string | null;
  autoRotate: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onUserInteract: () => void;
  /** Fired when a click lands on empty space; already drag-guarded by the caller. */
  onPointerMissed: () => void;
}

/**
 * Everything that pulls in three.js lives behind this component, which is
 * imported dynamically — so the WebGL engine streams in as its own chunk and
 * never delays first paint. The surrounding HUD and text index render
 * immediately without it.
 */
export default function AtlasCanvas({
  nodes,
  domains,
  activeDomain,
  selectedId,
  autoRotate,
  onSelect,
  onHover,
  onUserInteract,
  onPointerMissed,
}: AtlasCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 9, 30], fov: 52, near: 0.1, far: 260 }}
      dpr={[1, 1.75]}
      flat
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onPointerMissed={onPointerMissed}
    >
      <AtlasScene
        nodes={nodes}
        domains={domains}
        activeDomain={activeDomain}
        selectedId={selectedId}
        autoRotate={autoRotate}
        onSelect={onSelect}
        onHover={onHover}
        onUserInteract={onUserInteract}
      />
    </Canvas>
  );
}
