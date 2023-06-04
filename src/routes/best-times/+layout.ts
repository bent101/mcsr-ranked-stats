import type { RecordLeaderboard } from "$lib/ranked-api";
import { formatRecordLeaderboard } from "$lib/formatters";
import { getBestTimesURL } from "$lib/urls";

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
