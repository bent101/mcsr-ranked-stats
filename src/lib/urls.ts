import { matchesPerPage } from "./globals";

const base = "https://mcsrranked.com/api";

export const getLeaderboardURL = () => {
	return `${base}/leaderboard`;
};

export const getPlayerURL = (name: string) => {
	return `${base}/users/${name}`;
};

export const getMatchesURL = (
	name: string,
	page: number,
	perPage = matchesPerPage,
	excludeDecay = false
) => {
	return `${base}/users/${name}/matches?filter=2&page=${page}&count=${perPage}${
		excludeDecay ? "&excludedecay" : ""
	}`;
};

export const getDetailedMatchURL = (id: string | number) => {
	return `${base}/matches/${id}`;
};

export const getBestTimesURL = (unique: boolean) => {
	return `${base}/record-leaderboard${unique ? "?distinct" : ""}`;
};

export const getVersusURL = (player1: string, player2: string) => {
	return `${base}/users/${player1}/versus/${player2}?filter=2`;
};

export const getVersusMatchesURL = (player1: string, player2: string) => {
	return `${base}/users/${player1}/versus/${player2}/matches?filter=2&count=50`;
};

export const getSkinURL = (uuidOrName: string) => {
	return `https://mineskin.eu/skin/${uuidOrName}`;
};
