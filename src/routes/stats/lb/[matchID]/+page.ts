import { browser } from "$app/environment";
import { formatDetailedMatch } from "$lib/formatters";
import type { DetailedMatch } from "$lib/ranked-api";
import { getDetailedMatchURL, getSkinURL } from "$lib/urls";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (async ({ fetch, params }) => {
  const match = await fetch(getDetailedMatchURL(params.matchID), {
    cache: "force-cache",
  })
    .then((res) => res.json() as Promise<{ data: DetailedMatch | null }>)
    .then((res) => {
      if (res.data) {
        return formatDetailedMatch(res.data);
      } else {
        redirect(301, `/stats/lb`);
      }
    })
    .catch(() => {
      redirect(301, `/stats/lb`);
    });

  if (browser) {
    for (const uuid of match.playerUUIDs) {
      // eslint-disable-next-line no-undef
      const img = new Image();
      img.src = getSkinURL(uuid);
    }
  }

  return {
    match,
  };
}) satisfies PageLoad;
