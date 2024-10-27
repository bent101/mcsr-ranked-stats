import type { APIResponse, PlayoffsResponse } from "$lib/ranked-api";
import { getPlayoffsURL } from "$lib/urls";

export const config = {
  isr: {
    expiration: 60,
  },
};

export const load = async ({ fetch }) => {
  const playoffsData = await fetch(getPlayoffsURL())
    .then((res) => res.json() as APIResponse<PlayoffsResponse>)
    .then((res) => res.data.data);

  return {
    playoffsData,
  };
};
