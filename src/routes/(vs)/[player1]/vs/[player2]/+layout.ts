import { formatMatches } from "$lib/formatters";
import type { DetailedPlayer, Match, VersusWinCount } from "$lib/ranked-api";
import { getPlayerURL, getSkinURL, getVersusMatchesURL, getVersusURL } from "$lib/urls";
import { error, redirect } from "@sveltejs/kit";

export const load = async ({ params, fetch }) => {
	const [player1, player2] = await Promise.all([
		fetch(getPlayerURL(params.player1))
			.then((res) => res.json())
			.then((res) => res.data as DetailedPlayer),
		fetch(getPlayerURL(params.player2))
			.then((res) => res.json())
			.then((res) => res.data as DetailedPlayer),
	]);
	if (params.player1.toLowerCase() === params.player2.toLowerCase()) {
		throw error(404, { message: "same" });
	} else if (!player1 || !player2) {
		throw error(404, { message: player1 ? "player2" : player2 ? "player1" : "both" });
	} else if (params.player1 !== player1.nickname || params.player2 !== player2.nickname) {
		throw redirect(301, `/${player1.nickname}/vs/${player2.nickname}`);
	}

	return {
		player1,
		player2,
		wins: fetch(getVersusURL(params.player1, params.player2))
			.then((res) => res.json())
			.then((res) => res.data.win_count["2"] as VersusWinCount),
		matches: fetch(getVersusMatchesURL(params.player1, params.player2))
			.then((res) => res.json())
			.then((res) => res.data as Match[])
			.then((res) => formatMatches(res ?? [])),
		_: Promise.all([player1, player2].map((player) => fetch(getSkinURL(player.uuid)))),
	};
};
