import type { PageLoad } from "./$types";
import { getUUID, getPlayer, getMatches } from "$lib/utils";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params }) => {
	const playerData = await getPlayer(params.player);
	console.log(JSON.stringify(playerData));
	if (!playerData) throw error(404);
	return {
		uuid: getUUID(params.player),
		playerData,
		recentMatches: getMatches(params.player, 0),
	};
};
