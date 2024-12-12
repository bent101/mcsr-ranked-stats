import { formatDetailedMatch } from "$lib/formatters";
import type { DetailedMatch } from "$lib/ranked-api";
import { getDetailedMatchURL } from "$lib/urls";
import { redirect } from "@sveltejs/kit";

export const load = async ({ fetch, params }) => {
  const match = await fetch(getDetailedMatchURL(params.matchID), {
    cache: "force-cache",
  })
    .then((res) => res.json() as Promise<{ data: DetailedMatch | null }>)
    .then((res) => {
      if (res.data) {
        return formatDetailedMatch(res.data);
      } else {
        throw redirect(301, `/stats/${params.player1}/vs/${params.player2}`);
      }
    })
    .catch(() => {
      throw redirect(301, `/stats/${params.player1}/vs/${params.player2}`);
    });

  return {
    match,
  };
};