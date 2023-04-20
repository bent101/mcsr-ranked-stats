import type { PageLoad } from "./$types";
import { getPlayer, getMatches } from "$lib/utils";
import { error } from "@sveltejs/kit";

export const load = (async ({ fetch, params }) => {
	const playerData = await getPlayer(params.player);
	if (!playerData) throw error(404);
	return {
		playerData,
		recentMatches: getMatches(playerData.nickname, 0),
	};
}) satisfies PageLoad;
