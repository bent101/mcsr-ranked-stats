import type { APIResponse, PlayoffsResponse } from "$lib/ranked-api";
import { getPlayoffsURL } from "$lib/urls";

export const prerender = true;

export const load = async ({ fetch }) => {
  const playoffsURL = getPlayoffsURL();

  const playoffs = await fetch(playoffsURL)
    .then((res) => res.json() as APIResponse<PlayoffsResponse>)
    .then((res) => res.data);

  return {
    playoffs,
  };
};
