import type { RecordLeaderboard } from "$lib/ranked-api.js";
import { formatRecordLeaderboard, getBestTimesURL } from "$lib/utils.js";

export const load = async ({ fetch }) => {
	return {
		uniqueBestTimes: fetch(getBestTimesURL(true))
			.then((res) => res.json())
			.then((res) => formatRecordLeaderboard(res.data)),
		allBestTimes: fetch(getBestTimesURL(false))
			.then((res) => res.json())
			.then((res) => formatRecordLeaderboard(res.data)),
	};
};
