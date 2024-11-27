import { browser } from "$app/environment";
import { formatMatches } from "$lib/formatters";
import { matchesPerPage } from "$lib/globals";
import type { APIResponse, DetailedPlayer, Match } from "$lib/ranked-api";
import { getMatchesURL, getPlayerURL, getSkinURL } from "$lib/urls";
import { error } from "@sveltejs/kit";
import type { LayoutLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  if (browser) {
    const skin = new Image();
    skin.src = getSkinURL(params.player);
  }

  // const start = Date.now();
  const [playerData, matches] = await Promise.all([
    fetch(getPlayerURL(params.player), {
      // cache: "force-cache",
      // headers: {
      //   "Cache-Control": "max-age=10, stale-while-revalidate=10",
      // },
    })
      .then((res) => res.json() as APIResponse<DetailedPlayer>)
      .then((res) => (res.status === "error" ? null : res.data)),

    fetch(getMatchesURL(params.player, 0), {
      // cache: "force-cache",
      // headers: {
      //   "Cache-Control": "max-age=10, stale-while-revalidate=10",
      // },
    })
      .then((res) => res.json() as APIResponse<Match[] | null>)
      .then((res) => formatMatches(res.data ?? [], params.player))
      .then((res) => ({
        data: res,
        noMoreMatches: res.length < matchesPerPage,
      })),
  ]);
  // const end = Date.now();

  // console.log(`${end - start}ms`);

  if (!playerData) {
    error(404);
  }

  return {
    matches,
    playerData,
    curPage: 1,
  };
}) satisfies LayoutLoad;
