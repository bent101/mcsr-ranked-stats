import { browser } from "$app/environment";
import type { APIResponse } from "$lib/ranked-api";
import { getSkinURL, getWeeklyRaceMatchURL } from "$lib/urls";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params, parent }) => {
  const { weeklyRace } = await parent();

  const run = await fetch(
    getWeeklyRaceMatchURL({
      playerUUID: params.playerUUID,
      weeklyRaceId: weeklyRace.id,
    }),
  )
    .then((res) => res.json() as APIResponse<string>)
    .then((res) => res.data)
    .catch(() => {
      throw redirect(301, `/stats/weekly-race`);
    });

  if (browser) {
    const img = new Image();
    img.src = getSkinURL(params.playerUUID);
  }

  return {
    run,
  };
}) satisfies PageLoad;
