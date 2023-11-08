import type { DetailedPlayer } from "$lib/ranked-api";
import type { LayoutLoad } from "./$types";
import { formatMatches } from "$lib/formatters";
import { matchesPerPage } from "$lib/globals";
import { error, redirect } from "@sveltejs/kit";
import { getSkinURL, getMatchesURL, getPlayerURL } from "$lib/urls";

export const load = (async ({ fetch, params }) => {
	const [playerData, matches] = await Promise.all([
		fetch(getPlayerURL(params.player))
			.then((res) => res.json())
			.then((res) => res.data as DetailedPlayer),

		fetch(getMatchesURL(params.player, 0))
			.then((res) => res.json())
			.then((res) => formatMatches(res.data ?? [], params.player))
			.then((res) => ({
				data: res,
				noMoreMatches: res.length < matchesPerPage,
			})),
	]);

	if (!playerData) {
		throw error(404);
	}

	return {
		matches,
		curPage: 1,
		playerData,
	};
}) satisfies LayoutLoad;
