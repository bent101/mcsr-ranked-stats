import type { DetailedPlayer, Match, VersusWinCount } from "$lib/ranked-api";
import { getPlayerURL, getVersusMatchesURL, getVersusURL } from "$lib/urls";
import { error } from "@sveltejs/kit";

export const load = async ({ params, fetch }) => {
	const [player1, player2] = await Promise.all([
		fetch(getPlayerURL(params.player1))
			.then((res) => res.json())
			.then((res) => res.data as DetailedPlayer),
		fetch(getPlayerURL(params.player2))
			.then((res) => res.json())
			.then((res) => res.data as DetailedPlayer),
	]);

	if (!player1 || !player2) {
		throw error(404, { message: player1 ? "player2" : player2 ? "player1" : "both" });
	}

	return {
		player1,
		player2,
		wins: fetch(getVersusURL(params.player1, params.player2))
			.then((res) => res.json())
			.then((res) => res.data.win_count["2"] as VersusWinCount),
		matches: fetch(getVersusMatchesURL(params.player1, params.player2))
			.then((res) => res.json())
			.then((res) => res.data as Match[]),
	};
};
