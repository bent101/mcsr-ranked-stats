import type { Match } from "$lib/ranked-api.js";
import { formatTime, formatDate } from "$lib/utils.js";
import { json } from "@sveltejs/kit";

export const GET = async ({ fetch, params, url }) => {
	const data = await fetch(
		`https://mcsrranked.com/api/users/${params.player}/matches?filter=2&page=${
			url.searchParams.get("page") ?? 0
		}`
	).then((res) => res.json());
	const ret = ((data.data ?? []) as Match[]).map(
		({
			is_decay,
			winner,
			final_time,
			members,
			score_changes,
			forfeit,
			match_date,
			match_id,
		}: Match) => {
			let opponent = undefined;
			let time = undefined;
			let outcome: "won" | "lost" | "draw" | undefined = undefined;
			const uuid = members.find((member) => member.nickname === params.player)?.uuid;
			if (!is_decay) {
				opponent = members.find((member) => member.nickname !== params.player)?.nickname;
				outcome = "draw";
				if (winner) outcome = winner === uuid ? "won" : "lost";
				time = formatTime(final_time);
			}

			const scoreChange = score_changes?.find((member) => member.uuid === uuid);
			const eloChange = scoreChange?.change;
			const eloAfter = scoreChange?.score;
			return {
				isDecay: is_decay,
				opponent,
				outcome,
				forfeit,
				time,
				eloChange,
				eloAfter,
				date: formatDate(match_date),
				id: match_id,
			};
		}
	);
	return json(ret);
};
