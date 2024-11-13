import type { APIResponse, WeeklyRace } from "$lib/ranked-api.js";
import { getWeeklyRaceURL } from "$lib/urls";

export const load = async ({ fetch }) => {
  const weeklyRace = await fetch(getWeeklyRaceURL())
    .then((res) => res.json() as APIResponse<WeeklyRace>)
    .then((res) => res.data);

  return {
    weeklyRace,
  };
};
