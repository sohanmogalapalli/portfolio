import { useEffect, useState } from "react";
import { CONTRIBUTIONS_API, GITHUB_USERNAME } from "@/data/github";
import type { ContributionData, ContributionDay } from "@/data/github";

export interface ContributionsState {
  status: "loading" | "ready" | "error";
  total: number;
  days: ContributionDay[];
  error: string | null;
}

/**
 * GitHub's REST API has no per-day contribution endpoint, so this uses the
 * community proxy that every static-site contribution graph relies on.
 * Failures are surfaced as state rather than thrown, because the section must
 * degrade to a message instead of a broken visual.
 */
let cache: Promise<ContributionData> | null = null;

async function request(): Promise<ContributionData> {
  const response = await fetch(`${CONTRIBUTIONS_API}/${GITHUB_USERNAME}?y=last`);

  if (!response.ok) {
    throw new Error(`Contribution service responded with ${response.status}`);
  }

  const payload = (await response.json()) as {
    total?: number | Record<string, number>;
    contributions?: ContributionDay[];
  };

  const days = Array.isArray(payload.contributions) ? payload.contributions : [];

  // `total` is an object keyed by year (and "lastYear") in the v4 API, but has
  // been a plain number historically — accept both.
  const total =
    typeof payload.total === "number"
      ? payload.total
      : (payload.total?.lastYear ?? days.reduce((sum, day) => sum + day.count, 0));

  return { total, days };
}

function load() {
  if (!cache) {
    cache = request().catch((error: unknown) => {
      cache = null;
      throw error;
    });
  }

  return cache;
}

export function useGithubContributions(): ContributionsState {
  const [state, setState] = useState<ContributionsState>({
    status: "loading",
    total: 0,
    days: [],
    error: null,
  });

  useEffect(() => {
    let active = true;

    load()
      .then((data) => {
        if (active) {
          setState({ status: "ready", total: data.total, days: data.days, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          status: "error",
          total: 0,
          days: [],
          error: error instanceof Error ? error.message : "Could not load contributions.",
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
