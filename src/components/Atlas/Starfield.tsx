import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface StarfieldProps {
  count?: number;
  /** Keep the shell centred on the camera's depth — used by the scroll journey. */
  follow?: boolean;
}

/** Points scattered through a thick shell, rotating almost imperceptibly. */
export default function Starfield({ count = 1400, follow = false }: StarfieldProps) {
  const ref = useRef<THREE.Points>(null);
  const { camera } = useThree();

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
    const points = ref.current;
    if (!points) return;

    points.rotation.y += delta * 0.012;
    if (follow) points.position.copy(camera.position);
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
