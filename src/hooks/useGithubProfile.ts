import { useEffect, useState } from "react";
import { GITHUB_API, GITHUB_USERNAME } from "@/data/github";
import type { GithubProfile, GithubRepo } from "@/data/github";

export interface GithubProfileState {
  status: "loading" | "ready" | "error";
  profile: GithubProfile | null;
  repos: GithubRepo[];
  error: string | null;
}

/**
 * Module-level cache so React 18 StrictMode's double-effect (and any remount)
 * reuses one pair of requests instead of burning through the 60/hour
 * unauthenticated rate limit.
 */
let cache: Promise<{ profile: GithubProfile; repos: GithubRepo[] }> | null = null;

async function request(): Promise<{ profile: GithubProfile; repos: GithubRepo[] }> {
  const [profileResponse, reposResponse] = await Promise.all([
    fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`),
    fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
  ]);

  if (profileResponse.status === 403 || reposResponse.status === 403) {
    throw new Error("GitHub API rate limit reached. Try again in a few minutes.");
  }

  if (!profileResponse.ok) {
    throw new Error(`GitHub API responded with ${profileResponse.status}`);
  }

  if (!reposResponse.ok) {
    throw new Error(`GitHub API responded with ${reposResponse.status}`);
  }

  const [profile, repos] = await Promise.all([
    profileResponse.json() as Promise<GithubProfile>,
    reposResponse.json() as Promise<GithubRepo[]>,
  ]);

  return { profile, repos };
}

function load() {
  if (!cache) {
    cache = request().catch((error: unknown) => {
      // Drop the failed promise so a later mount can retry.
      cache = null;
      throw error;
    });
  }

  return cache;
}

export function useGithubProfile(): GithubProfileState {
  const [state, setState] = useState<GithubProfileState>({
    status: "loading",
    profile: null,
    repos: [],
    error: null,
  });

  useEffect(() => {
    let active = true;

    load()
      .then(({ profile, repos }) => {
        if (active) setState({ status: "ready", profile, repos, error: null });
      })
      .catch((error: unknown) => {
        if (!active) return;
        setState({
          status: "error",
          profile: null,
          repos: [],
          error: error instanceof Error ? error.message : "Could not reach the GitHub API.",
        });
      });

    return () => {
      active = false;
    };
  }, []);

  return state;
}
