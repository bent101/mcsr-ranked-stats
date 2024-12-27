import type { APIResponse, PlayoffsResponse } from "$lib/ranked-api";
import { getPlayoffsURL } from "$lib/urls";
import type { LayoutLoad } from "./$types";

export const config = {
  isr: {
    expiration: 60,
  },
};

export const load: LayoutLoad = async ({ fetch, url }) => {
  const seasonStr = url.searchParams.get("season");
  const season = seasonStr != null ? Number(seasonStr) : undefined;
  const playoffsURL = getPlayoffsURL({ season });

  console.log("Loading playoffs data for season:", season);
  console.log("Playoffs URL:", playoffsURL);

  const playoffs = await fetch(playoffsURL)
    .then((res) => res.json() as APIResponse<PlayoffsResponse>)
    .then((res) => res.data);

  console.log("Playoffs data:", playoffs);
  console.log("Season:", playoffs.data.season);
  console.log("Number of players:", playoffs.data.players.length);
  console.log("Number of matches:", playoffs.data.matches.length);

  return {
    playoffs,
  };
};
