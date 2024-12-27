import type { APIResponse, PlayoffsResponse } from "$lib/ranked-api";
import { getPlayoffsURL } from "$lib/urls";

export const config = {
  isr: {
    expiration: 60,
  },
};

export const load = async ({ fetch, url }) => {
  const playoffs = await fetch(
    getPlayoffsURL({ season: url.searchParams.get("season") }),
  )
    .then((res) => res.json() as APIResponse<PlayoffsResponse>)
    .then((res) => res.data);

  return {
    playoffs,
  };
};
