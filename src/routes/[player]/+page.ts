import type { DetailedPlayer } from "$lib/ranked-api";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { formatMatches, getAvatar, getMatchesURL, getPlayerURL } from "$lib/utils";

export const load = (async ({ fetch, params }) => {
	const playerData: DetailedPlayer = await fetch(getPlayerURL(params.player))
		.then((res) => res.json())
		.then((res) => res.data);
	if (!playerData) throw error(404);
	return {
		playerData,
		recentMatches: fetch(getMatchesURL(playerData.nickname, 0))
			.then((res) => res.json())
			.then((res) => formatMatches(res.data ?? [], playerData.nickname)),
		_: fetch(getAvatar(playerData.uuid)),
	};
}) satisfies PageLoad;
