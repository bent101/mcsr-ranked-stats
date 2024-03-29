import type { PageLoad } from "./$types";
import { formatDetailedMatch } from "$lib/formatters";
import { getDetailedMatchURL } from "$lib/urls";
import { redirect } from "@sveltejs/kit";
import type { DetailedMatch } from "$lib/ranked-api";

export const load = (async ({ fetch, params }) => {
	const match = await fetch(getDetailedMatchURL(params.matchID))
		.then((res) => res.json())
		.then((res: { data: DetailedMatch | null }) => {
			if (res.data) {
				return formatDetailedMatch(res.data);
			} else {
				throw redirect(301, `/lb`);
			}
		});

	return {
		match,
	};
}) satisfies PageLoad;
