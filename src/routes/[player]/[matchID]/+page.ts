import type { PageLoad } from "./$types";
import { getDetailedMatchURL, formatDetailedMatch } from "$lib/utils";

export const load = (async ({ fetch, params }) => {
	return {
		match: fetch(getDetailedMatchURL(params.matchID))
			.then((res) => res.json())
			.then((res) => formatDetailedMatch(res.data, params.player)),
	};
}) satisfies PageLoad;
