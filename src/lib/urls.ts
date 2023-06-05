import { matchesPerPage } from "./globals";

const base = "https://mcsrranked.com/api";

export const getLeaderboardURL = () => {
	return `${base}/leaderboard`;
};

export const getPlayerURL = (name: string) => {
	return `${base}/users/${name}`;
};

export const getMatchesURL = (name: string, page: number) => {
	return `${base}/users/${name}/matches?filter=2&page=${page}&count=${matchesPerPage}`;
};

export const getDetailedMatchURL = (id: string) => {
	return `${base}/matches/${id}`;
};

export const getBestTimesURL = (unique: boolean) => {
	return `${base}/record-leaderboard${unique ? "?distinct" : ""}`;
};

export const getSkinURL = (uuid: string) => {
	return `https://mineskin.eu/skin/${uuid}`;
};
