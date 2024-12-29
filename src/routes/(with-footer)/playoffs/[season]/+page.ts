import { lastPlayoffsSeason } from "$lib/last-playoffs-season";
import type { APIResponse, PlayoffsResponse } from "$lib/ranked-api";
import { getPlayoffsURL } from "$lib/urls";
import _ from "lodash";
import type { LayoutLoad } from "./$types";

export const prerender = true;

export const entries = () => {
  // e.g. if last season is 4 then /playoffs/1, /playoffs/2, /playoffs/3 will be prerendered
  return _.range(1, lastPlayoffsSeason).map((season) => ({
    season: season.toString(),
  }));
};

export const load: LayoutLoad = async ({ fetch, params }) => {
  const playoffsURL = getPlayoffsURL({ season: params.season });

  const playoffs = await fetch(playoffsURL)
    .then((res) => res.json() as APIResponse<PlayoffsResponse>)
    .then((res) => res.data);

  return {
    playoffs,
  };
};
