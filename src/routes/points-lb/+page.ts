import type { PointsLeaderboard } from "$lib/ranked-api.js";
import { getPointsLeaderboardURL } from "$lib/urls.js";

export const load = async ({ fetch }) => {
	return {
		pointsLb: fetch(getPointsLeaderboardURL())
			.then((res) => res.json())
			.then((res) => res.data as PointsLeaderboard),
	};
};
