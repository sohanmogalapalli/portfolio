import type { AtlasAchievement, AtlasDomain, AtlasDomainMeta, AtlasNode } from "@/types";

/**
 * Domain colours, shared by the 3D scene and the DOM HUD. Lives here rather
 * than next to the scene so the HUD does not have to import three. Kept in
 * sync with ATLAS_DOMAINS by the colour values in data/achievements.ts.
 */
export const DOMAIN_COLORS: Record<AtlasDomain, string> = {
  academics: "#FBBF24",
  engineering: "#38BDF8",
  skills: "#4ADE80",
  goals: "#A78BFA",
};

/**
 * Deterministic string hash → 0–1. Used for small position jitter so the map
 * looks hand-placed but is byte-identical on every render and reload.
 */
function hash01(input: string): number {
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  // >>> 0 keeps it unsigned before normalising.
  return (hash >>> 0) / 4294967295;
}

/**
 * Arranges achievements into one rising helical "plume" per domain, fanning
 * out from a shared core. Heavier achievements sit closer to the centre and
 * lower down, so the map reads brightest-at-the-middle.
 *
 * Pure and synchronous: identical input always yields identical positions.
 */
export function buildAtlasNodes(
  achievements: AtlasAchievement[],
  domains: AtlasDomainMeta[]
): AtlasNode[] {
  const nodes: AtlasNode[] = [];

  domains.forEach((domain) => {
    const members = achievements
      .filter((achievement) => achievement.domain === domain.id)
      .sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id));

    members.forEach((achievement, index) => {
      const jitterRadius = (hash01(`${achievement.id}-r`) - 0.5) * 0.8;
      const jitterAngle = (hash01(`${achievement.id}-a`) - 0.5) * 0.24;
      const jitterY = (hash01(`${achievement.id}-y`) - 0.5) * 0.6;

      const radius = 5.6 + index * 1.18 + (5 - achievement.weight) * 0.34 + jitterRadius;
      const angle = domain.angle + index * 0.62 + jitterAngle;
      const y = -3.1 + index * 1.72 + (5 - achievement.weight) * 0.16 + jitterY;

      nodes.push({
        ...achievement,
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius],
        radius,
      });
    });
  });

  return nodes;
}
