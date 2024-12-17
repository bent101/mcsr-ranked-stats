import type { EloLeaderboard, Match } from "$lib/ranked-api";
import { getLeaderboardURL, getRecentsURL } from "$lib/urls";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

injectSpeedInsights();

export const config = {
  isr: {
    expiration: 20,
  },
};

export async function load({ fetch }) {
  const [lb, recentMatches] = await Promise.all([
    fetch(getLeaderboardURL())
      .then((res) => res.json() as Promise<{ data: EloLeaderboard }>)
      .then((res) => res.data),
    fetch(getRecentsURL())
      .then((res) => res.json() as Promise<{ data: Match[] }>)
      .then((res) => res.data),
  ]);

  return {
    lb,
    recentMatches,
  };
}
