import { matchesPerPage } from "./globals";

const base = "https://mcsrranked.com/api";

export const getLeaderboardURL = () => {
	return `${base}/leaderboard`;
};

export const getPlayerURL = (name: string) => {
	return `${base}/users/${name}`;
};

export const getMatchesURL = (name: string, page: number, perPage = matchesPerPage) => {
	return `${base}/users/${name}/matches?filter=2&page=${page}&count=${perPage}`;
};

export const getDetailedMatchURL = (id: string) => {
	return `${base}/matches/${id}`;
};

export const getBestTimesURL = (unique: boolean) => {
	return `${base}/record-leaderboard${unique ? "?distinct" : ""}`;
};

export const getVersusURL = (player1: string, player2: string) => {
	return `${base}/users/${player1}/versus/${player2}`;
};

export const getVersusMatchesURL = (player1: string, player2: string) => {
	return `${base}/users/${player1}/versus/${player2}/matches`;
};

export const getSkinURL = (uuidOrName: string) => {
	return `https://mineskin.eu/skin/${uuidOrName}`;
};
