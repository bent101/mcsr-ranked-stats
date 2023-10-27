import type { DetailedPlayer } from "$lib/ranked-api";
import type { LayoutLoad } from "./$types";
import { formatMatches } from "$lib/formatters";
import { matchesPerPage } from "$lib/globals";
import { error, redirect } from "@sveltejs/kit";
import { getSkinURL, getMatchesURL, getPlayerURL } from "$lib/urls";

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

	const matches = fetch(getMatchesURL(capitalizedName, 0))
		.then((res) => res.json())
		.then((res) => formatMatches(res.data ?? [], capitalizedName))
		.then((res) => ({
			data: res,
			noMoreMatches: res.length < matchesPerPage,
		}));

	return {
		matches,
		curPage: 1,
		playerData,
		_: fetch(getSkinURL(playerData.uuid)),
	};
}) satisfies LayoutLoad;
