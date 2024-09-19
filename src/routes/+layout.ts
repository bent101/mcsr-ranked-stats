import type { EloLeaderboard } from "$lib/ranked-api";
import { getLeaderboardURL } from "$lib/urls";
import type { LayoutLoad } from "./$types";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

export const ssr = false;

injectSpeedInsights();

export const load = (async ({ fetch }) => {
  return {
    lb: await fetch(getLeaderboardURL())
      .then((res) => res.json() as Promise<{ data: EloLeaderboard }>)
      .then((res) => res.data),
  };
}) satisfies LayoutLoad;
