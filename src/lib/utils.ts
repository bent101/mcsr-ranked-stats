import type { EloLeaderboard, Date, DetailedMatch } from "./ranked-api";
import moment from "moment";

const base = "https://mcsrranked.com/api";

export const getLeaderboardURL = () => {
	return `${base}/leaderboard`;
};

export const getAvatar = (uuid: string, size = 64) => {
	return `https://crafatar.com/avatars/${uuid}?overlay&size=${size}`;
};

export const getPlayerURL = (name: string) => {
	return `${base}/users/${name}`;
};

export const getMatchesURL = (name: string, page: number) => {
	return `${base}/users/${name}/matches?filter=2&page=${page}`;
};

export const getDetailedMatchURL = (id: string) => {
	return `${base}/matches/${id}`;
};

export const formatMatch = (match: DetailedMatch, playerName: string) => {
	const { is_decay, winner, final_time, members, score_changes, forfeit, match_date, match_id } =
		match;
	let opponent = undefined;
	let time = undefined;
	let outcome: "won" | "lost" | "draw" | undefined = undefined;
	const uuid = members.find((member) => member.nickname === playerName)?.uuid;
	if (!is_decay) {
		opponent = members.find((member) => member.nickname !== playerName)?.nickname;
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
};

export const formatMatches = (matches: DetailedMatch[], playerName: string) => {
	return matches.map((match) => formatMatch(match, playerName));
};

export const formatTime = (timeInMs: number) => {
	const seconds = ~~(timeInMs / 1000);
	const minutes = ~~(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export const formatDate = (date: Date) => {
	return moment(date * 1000).fromNow();
};
