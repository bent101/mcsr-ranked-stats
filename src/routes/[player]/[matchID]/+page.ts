import type { PageLoad } from "./$types";
import { formatDetailedMatch } from "$lib/formatters";
import { getDetailedMatchURL, getSkinURL } from "$lib/urls";
import { redirect } from "@sveltejs/kit";
import type { DetailedMatch } from "$lib/ranked-api";

export const load = (async ({ fetch, params }) => {
	const match = await fetch(getDetailedMatchURL(params.matchID))
		.then((res) => res.json())
		.then((res: { data: DetailedMatch | null }) => {
			if (res.data) {
				return formatDetailedMatch(res.data, params.player);
			} else {
				throw redirect(301, `/${params.player}`);
			}
		});

	return {
		match,
	};
}) satisfies PageLoad;
