import type { EloLeaderboard } from "$lib/ranked-api";
import { getLeaderboardURL } from "$lib/urls";
import type { LayoutLoad } from "./$types";

export const load = (async ({ fetch }) => {
	return {
		lb: fetch(getLeaderboardURL())
			.then((res) => res.json())
			.then((res) => res.data as EloLeaderboard),
	};
}) satisfies LayoutLoad;
