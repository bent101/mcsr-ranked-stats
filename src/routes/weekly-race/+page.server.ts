import type { WeeklyRaceLeaderboard } from "$lib/ranked-api.js";
import type { APIResponse } from "$lib/ranked-api.js";
import { getWeeklyRaceURL } from "$lib/urls";

export const config = {
  isr: {
    expiration: 60,
  },
};

export const load = async ({ fetch }) => {
  const weeklyRaceLeaderboard = await fetch(getWeeklyRaceURL())
    .then((res) => res.json() as APIResponse<WeeklyRaceLeaderboard>)
    .then((res) => res.data);

  return {
    weeklyRaceLeaderboard,
  };
};
