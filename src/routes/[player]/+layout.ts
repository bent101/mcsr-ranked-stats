import type { DetailedPlayer } from "$lib/ranked-api";
import type { LayoutLoad } from "./$types";
import { formatMatches, getAvatar, getMatchesURL, getPlayerURL } from "$lib/utils";
import { matchesPerPage } from "$lib/globals";
import { error, redirect } from "@sveltejs/kit";

export const load = (async ({ fetch, params }) => {
	const playerData: DetailedPlayer = await fetch(getPlayerURL(params.player))
		.then((res) => res.json())
		.then((res) => res.data);

	if (!playerData) {
		throw error(404);
	}

	const capitalizedName = playerData.nickname;
	if (capitalizedName !== params.player) {
		throw redirect(301, `/${capitalizedName}/${params.matchID ?? ""}`);
	}

	const matches = await fetch(getMatchesURL(capitalizedName, 0))
		.then((res) => res.json())
		.then((res) => formatMatches(res.data ?? [], capitalizedName));

	return {
		matches,
		noMoreMatches: matches.length < matchesPerPage,
		curPage: 1,
		playerData,
		_: fetch(getAvatar(playerData.uuid)),
	};
}) satisfies LayoutLoad;
