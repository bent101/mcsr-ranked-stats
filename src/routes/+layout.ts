import type { EloLeaderboard } from "$lib/ranked-api";
import { getLeaderboardURL } from "$lib/urls";
import type { LayoutLoad } from "./$types";

export const load = (async ({ fetch }) => {
	return {
		lb: fetch(getLeaderboardURL())
			.then((res) => res.json())
			.then((res) => res.data as EloLeaderboard),
	};
	// const lb = await fetch(getLeaderboardURL())
	// 	.then((res) => res.json())
	// 	.then((res) => res.data as EloLeaderboard);

	// for (const i in lb.users) {
	// 	lb.users[i].elo_rate += ~~(200 * Math.random() - 10);
	// }

	// lb.users.sort((a, b) => b.elo_rate - a.elo_rate);

	// return { lb };
}) satisfies LayoutLoad;
