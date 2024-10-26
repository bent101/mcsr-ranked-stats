import type { PageLoad } from "./$types";
import { formatDetailedMatch } from "$lib/formatters";
import { getDetailedMatchURL, getSkinURL } from "$lib/urls";
import { redirect } from "@sveltejs/kit";
import type { DetailedMatch } from "$lib/ranked-api";
import { browser } from "$app/environment";

export const load = (async ({ fetch, params }) => {
  const match = await fetch(getDetailedMatchURL(params.matchID), {
    cache: "force-cache",
  })
    .then((res) => res.json() as Promise<{ data: DetailedMatch | null }>)
    .then((res) => {
      if (res.data) {
        return formatDetailedMatch(res.data, params.player);
      } else {
        throw redirect(301, `/stats/${params.player}`);
      }
    })
    .catch(() => {
      throw redirect(301, `/stats/${params.player}`);
    });

  if (browser) {
    for (const uuid of match.playerUUIDs) {
      const img = new Image();
      img.src = getSkinURL(uuid);
    }
  }

  return {
    match,
  };
}) satisfies PageLoad;
