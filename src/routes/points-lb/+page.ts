import type { PointsLeaderboard } from "$lib/ranked-api.js";
import { getPointsLeaderboardURL } from "$lib/urls.js";

export const config = {
	isr: {
		expiration: 60 * 5,
	},
};

export const load = async ({ fetch }) => {
	const pointsLb = await fetch(getPointsLeaderboardURL())
		.then((res) => res.json())
		.then((res) => res.data as PointsLeaderboard);

	const prevPointsLb =
		pointsLb.phase.number === 1
			? await fetch(getPointsLeaderboardURL({ season: pointsLb.phase.season - 1 }))
					.then((res) => res.json())
					.then((res) => res.data as PointsLeaderboard)
			: null;

	return {
		pointsLb,
		prevPointsLb,
	};
};
