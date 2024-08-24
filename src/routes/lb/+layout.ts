import { formatRecordLeaderboard } from "$lib/formatters";
import { getBestTimesURL } from "$lib/urls";

export const config = {
	isr: {
		expiration: 60,
	},
};

export const load = async ({ fetch }) => {
	return {
		uniqueBestTimesThisSeason: fetch(getBestTimesURL({ unique: true, allTime: false }))
			.then((res) => res.json())
			.then((res) => formatRecordLeaderboard(res.data)),
		allBestTimesThisSeason: fetch(getBestTimesURL({ unique: false, allTime: false }))
			.then((res) => res.json())
			.then((res) => formatRecordLeaderboard(res.data)),
		uniqueBestTimesAllTime: fetch(getBestTimesURL({ unique: true, allTime: true }))
			.then((res) => res.json())
			.then((res) => formatRecordLeaderboard(res.data)),
		allBestTimesAllTime: fetch(getBestTimesURL({ unique: false, allTime: true }))
			.then((res) => res.json())
			.then((res) => formatRecordLeaderboard(res.data)),
	};
};
