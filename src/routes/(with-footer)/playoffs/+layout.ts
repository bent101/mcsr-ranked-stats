import type { APIResponse, PlayoffsResponse } from "$lib/ranked-api";
import { getPlayoffsURL } from "$lib/urls";
import type { LayoutLoad } from "./$types";

export const config = {
  isr: {
    expiration: 60,
    allowQuery: ["season"],
  },
};

export const load: LayoutLoad = async ({ fetch, url }) => {
  const seasonStr = url.searchParams.get("season");
  const season = seasonStr != null ? Number(seasonStr) : undefined;
  const playoffsURL = getPlayoffsURL({ season });

  const playoffs = await fetch(playoffsURL)
    .then((res) => res.json() as APIResponse<PlayoffsResponse>)
    .then((res) => res.data);

  return {
    playoffs,
  };
};
