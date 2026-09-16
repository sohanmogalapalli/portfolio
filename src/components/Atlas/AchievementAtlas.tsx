import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiRotateCcw } from "react-icons/fi";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import { ATLAS_DOMAINS, achievements } from "@/data/achievements";
import type { AtlasDomain } from "@/types";
import { DOMAIN_COLORS, buildAtlasNodes } from "./atlasLayout";

// three.js is ~300 kB gzipped, so the WebGL engine is split into its own chunk
// and only fetched once the viewport gets near this section.
const AtlasCanvas = lazy(() => import("./AtlasCanvas"));

const WEIGHT_BARS = [1, 2, 3, 4, 5];

/** Cheap WebGL probe so we can fall back gracefully on locked-down machines. */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/* ── Cursor-following tooltip ────────────────────────────────────────── */

/**
 * Tracks the pointer with a native listener rather than React state in the
 * parent, so moving the mouse never re-renders the 3D scene.
 */
function HoverTooltip({
  hoveredId,
  containerRef,
}: {
  hoveredId: string | null;
  containerRef: RefObject<HTMLDivElement>;
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };

    element.addEventListener("mousemove", handleMove);
    return () => element.removeEventListener("mousemove", handleMove);
  }, [containerRef]);

  const node = hoveredId ? achievements.find((item) => item.id === hoveredId) : undefined;
  if (!node || !position) return null;

  return (
    <div
      className="pointer-events-none absolute z-20 max-w-[16rem] -translate-x-1/2 -translate-y-[140%] rounded-lg border border-border-glass bg-base/90 px-3 py-2 backdrop-blur-md"
      style={{ left: position.x, top: position.y }}
      aria-hidden="true"
    >
      <p className="font-mono text-[11px] font-semibold" style={{ color: DOMAIN_COLORS[node.domain] }}>
        {node.title}
      </p>
      <p className="mt-0.5 font-mono text-[10px] leading-relaxed text-ink-faint">{node.summary}</p>
    </div>
  );
}

/* ── Fallback ────────────────────────────────────────────────────────── */

function AtlasFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="relative h-24 w-24">
        <span className="absolute inset-0 rounded-full border border-term-green/30" />
        <span className="absolute inset-3 rounded-full border border-term-cyan/25" />
        <span className="absolute inset-8 rounded-full bg-term-green/25 blur-md" />
      </div>
      <p className="font-mono text-xs text-ink-muted">
        // 3D map paused — {detectWebGL() ? "motion reduced" : "WebGL unavailable"}
      </p>
      <p className="max-w-xs text-xs leading-relaxed text-ink-faint">
        Every achievement is listed below in full. The interactive map is decorative.
      </p>
    </div>
  );
}

function AtlasLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4" role="status">
      <div className="relative h-16 w-16">
        <span className="absolute inset-0 animate-[spin_16s_linear_infinite] rounded-full border border-dashed border-term-green/30" />
        <span className="absolute inset-4 rounded-full bg-term-green/20 blur-md" />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
        loading 3d engine
      </p>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────────────────── */

export default function AchievementAtlas() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Orbiting necessarily ends in a "click" on empty space, which would clear
  // the selection every time the user rotates the camera. Track drag distance
  // so only a genuine click on nothing deselects.
  const drag = useRef({ x: 0, y: 0, dragged: false });

  const [webgl, setWebgl] = useState(true);
  const [engineReady, setEngineReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeDomain, setActiveDomain] = useState<AtlasDomain | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    setWebgl(detectWebGL());
  }, []);

  // Positions never change for a given dataset, so compute them exactly once.
  const nodes = useMemo(() => buildAtlasNodes(achievements, ATLAS_DOMAINS), []);

  const canRender3D = webgl && !reduceMotion;
  const selected = selectedId ? achievements.find((item) => item.id === selectedId) : undefined;

  // Only pull the 3D chunk once the map is close to entering the viewport.
  useEffect(() => {
    const element = containerRef.current;
    if (!element || !canRender3D) return;

    if (typeof IntersectionObserver === "undefined") {
      setEngineReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEngineReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [canRender3D]);

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    setAutoRotate(false);
  }, []);

  const handleHover = useCallback((id: string | null) => setHoveredId(id), []);
  const handleUserInteract = useCallback(() => setAutoRotate(false), []);

  const handlePointerMissed = useCallback(() => {
    if (!drag.current.dragged) handleSelect(null);
  }, [handleSelect]);

  const grouped = useMemo(
    () =>
      ATLAS_DOMAINS.map((domain) => ({
        domain,
        items: nodes.filter((node) => node.domain === domain.id).sort((a, b) => b.weight - a.weight),
      })),
    [nodes]
  );

  return (
    <section
      id="atlas"
      className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32"
      aria-label="Achievement atlas"
    >
      <Reveal>
        <SectionLabel comment="map --achievements --3d" title="Achievement Atlas" />
        <p className="-mt-6 mb-8 max-w-2xl text-sm leading-relaxed text-ink-muted md:-mt-8 md:mb-12">
          Every milestone plotted as a star. Heavier achievements sit closest to the core, each domain
          grows out as its own arm, and the whole thing is navigable — orbit it, click a node to
          inspect it, or pick a milestone from the index underneath.
        </p>
      </Reveal>

      {/* 3D viewport */}
      <Reveal delay={0.05}>
        <div
          ref={containerRef}
          onPointerDown={(event) => {
            drag.current = { x: event.clientX, y: event.clientY, dragged: false };
          }}
          onPointerMove={(event) => {
            const state = drag.current;
            if (
              !state.dragged &&
              Math.hypot(event.clientX - state.x, event.clientY - state.y) > 6
            ) {
              state.dragged = true;
            }
          }}
          className="relative h-[78vh] min-h-[540px] overflow-hidden rounded-2xl border border-border-glass bg-base-panel shadow-panel"
        >
          {canRender3D ? (
            engineReady ? (
              <Suspense fallback={<AtlasLoading />}>
                <AtlasCanvas
                  nodes={nodes}
                  domains={ATLAS_DOMAINS}
                  activeDomain={activeDomain}
                  selectedId={selectedId}
                  autoRotate={autoRotate}
                  onSelect={handleSelect}
                  onHover={handleHover}
                  onUserInteract={handleUserInteract}
                  onPointerMissed={handlePointerMissed}
                />
              </Suspense>
            ) : (
              <AtlasLoading />
            )
          ) : (
            <AtlasFallback />
          )}

          {/* Corner HUD readouts */}
          <div className="pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            <span className="text-term-greenDim">●</span> {nodes.length} nodes · {ATLAS_DOMAINS.length} domains
          </div>
          <div className="pointer-events-none absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            {autoRotate ? "auto-orbit" : canRender3D ? "manual" : "static"}
          </div>

          {/* Controls hint */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 gap-4 rounded-full border border-border-glass bg-base/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint backdrop-blur-md sm:flex">
            <span>drag to orbit</span>
            <span className="text-term-greenDim">·</span>
            <span>scroll to zoom</span>
            <span className="text-term-greenDim">·</span>
            <span>click to inspect</span>
          </div>

          {/* Reset */}
          {canRender3D && selectedId && (
            <button
              onClick={() => handleSelect(null)}
              className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-border-glass bg-base/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-ink-muted backdrop-blur-md transition-colors hover:border-term-green/40 hover:text-term-green"
            >
              <FiRotateCcw /> reset view
            </button>
          )}

          <HoverTooltip hoveredId={hoveredId} containerRef={containerRef} />

          {/* Inspector */}
          <AnimatePresence>
            {selected && (
              <motion.aside
                key={selected.id}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 28 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto border-l border-border-glass bg-base/92 p-5 backdrop-blur-xl"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span
                    className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider"
                    style={{
                      color: DOMAIN_COLORS[selected.domain],
                      borderColor: `${DOMAIN_COLORS[selected.domain]}40`,
                      backgroundColor: `${DOMAIN_COLORS[selected.domain]}14`,
                    }}
                  >
                    {ATLAS_DOMAINS.find((d) => d.id === selected.domain)?.label}
                  </span>

                  <button
                    onClick={() => handleSelect(null)}
                    aria-label="Close inspector"
                    className="rounded-md p-1 text-ink-faint transition-colors hover:text-term-green"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="font-mono text-lg font-semibold leading-snug text-ink-primary">
                  {selected.title}
                </h3>

                {selected.period && (
                  <p className="mt-1 font-mono text-[11px] text-ink-faint">{selected.period}</p>
                )}

                <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                  {selected.detail ?? selected.summary}
                </p>

                {selected.meta && selected.meta.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {selected.meta.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-ink-muted"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {selected.href && (
                  <a
                    href={selected.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg border border-term-green/30 bg-term-green/10 px-4 py-2.5 font-mono text-xs text-term-green transition-colors hover:bg-term-green/20"
                  >
                    View source <FiArrowUpRight />
                  </a>
                )}
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      {/* Domain filter */}
      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by domain">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            filter
          </span>

          <button
            onClick={() => setActiveDomain(null)}
            className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
              activeDomain === null
                ? "border-term-green/40 bg-term-green/10 text-term-green"
                : "border-border-glass text-ink-muted hover:text-ink-primary"
            }`}
          >
            all
          </button>

          {ATLAS_DOMAINS.map((domain) => {
            const isActive = activeDomain === domain.id;
            const count = achievements.filter((item) => item.domain === domain.id).length;

            return (
              <button
                key={domain.id}
                onClick={() => setActiveDomain(isActive ? null : domain.id)}
                aria-pressed={isActive}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors"
                style={{
                  color: isActive ? domain.color : undefined,
                  borderColor: isActive ? `${domain.color}66` : undefined,
                  backgroundColor: isActive ? `${domain.color}14` : undefined,
                }}
              >
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ backgroundColor: domain.color, opacity: isActive ? 1 : 0.55 }}
                />
                <span className={isActive ? "" : "text-ink-muted"}>{domain.label}</span>
                <span className="text-ink-faint">{count}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* Text index — the accessible, crawlable counterpart to the 3D map */}
      <Reveal delay={0.15}>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {grouped.map(({ domain, items }) => (
            <div key={domain.id} aria-label={domain.label}>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: domain.color }} />
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-primary">
                  {domain.label}
                </h3>
              </div>
              <p className="mb-4 font-mono text-[11px] leading-relaxed text-ink-faint">{domain.blurb}</p>

              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSelect(item.id)}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                        selectedId === item.id
                          ? "border-term-green/40 bg-term-green/[0.07]"
                          : "border-border-glass hover:border-white/[0.16] hover:bg-white/[0.03]"
                      }`}
                    >
                      <p className="text-[13px] leading-snug text-ink-primary">{item.title}</p>
                      <p className="mt-1 font-mono text-[10px] leading-relaxed text-ink-faint">
                        {item.period ?? item.summary}
                      </p>
                      <span className="mt-2 flex gap-0.5" aria-label={`Weight ${item.weight} of 5`}>
                        {WEIGHT_BARS.map((bar) => (
                          <span
                            key={bar}
                            className="h-0.5 w-3 rounded-full"
                            style={{
                              backgroundColor:
                                bar <= item.weight ? domain.color : "rgba(255,255,255,0.10)",
                            }}
                          />
                        ))}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
