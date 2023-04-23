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

export const getDetailedMatchURL = (id: number) => {
	return `${base}/matches/${id}`;
};

export const formatDetailedMatch = (match: DetailedMatch, curPlayerID: string) => {
	type Timeline = { where: string; when: string }[];
	let curPlayerTimeline: Timeline | undefined;
	let opponentTimeline: Timeline | undefined;

	if (match.timelines) {
		const advancementsMap = new Map([
			["story.enter_the_nether", "nether enter"],
			["nether.find_bastion", "bastion"],
			["nether.find_fortress", "fortress"],
			["projectelo.timeline.blind_travel", "blind"],
			["story.follow_ender_eye", "stronghold"],
			["story.enter_the_end", "end enter"],
		]);

		curPlayerTimeline = [];
		opponentTimeline = [];

		match.timelines.reverse(); // the api gives the timeline from last to first

		for (const { time, timeline: eventName, uuid } of match.timelines) {
			const where = advancementsMap.get(eventName);
			if (where) {
				const event = { where, when: formatTime(time) };
				if (uuid === curPlayerID) {
					curPlayerTimeline.push(event);
				} else {
					opponentTimeline.push(event);
				}
			}
		}
	}

	const seedType = match.seed_type
		.split("_")
		.map((word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");

	return {
		seedType,
		date: formatDate(match.match_date),
		curPlayerTimeline,
		opponentTimeline,
		curPlayerName: match.members.find((player) => player.uuid === curPlayerID)?.nickname,
		opponentName: match.members.find((player) => player.uuid !== curPlayerID)?.nickname,
	};
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
