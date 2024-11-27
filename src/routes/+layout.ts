import type { EloLeaderboard } from "$lib/ranked-api";
import { getLeaderboardURL } from "$lib/urls";
import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

injectSpeedInsights();

export const config = {
  isr: {
    expiration: 20,
  },
};

export async function load({ fetch }) {
  return {
    lb: await fetch(getLeaderboardURL())
      .then((res) => res.json() as Promise<{ data: EloLeaderboard }>)
      .then((res) => res.data),
  };
}
