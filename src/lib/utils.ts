import { matchesPerPage } from "./globals";
import type { Date, DetailedMatch } from "./ranked-api";
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
	return `${base}/users/${name}/matches?filter=2&page=${page}&count=${matchesPerPage}`;
};

export const getDetailedMatchURL = (id: string) => {
	return `${base}/matches/${id}`;
};

export type Outcome = "won" | "lost" | "draw" | undefined;

export type FormattedMatch = {
	isDecay: boolean;
	opponent: string | undefined;
	outcome: Outcome;
	forfeit: boolean;
	time: string | undefined;
	eloChange: number;
	eloAfter: number | undefined;
	date: string;
	id: number;
};

export const formatMatch = (match: DetailedMatch, playerName: string) => {
	const { is_decay, winner, final_time, members, score_changes, forfeit, match_date, match_id } =
		match;
	let opponent = undefined;
	let time = undefined;
	let outcome: Outcome = undefined;
	const uuid = members.find((member) => member.nickname === playerName)?.uuid;
	if (!is_decay) {
		opponent = members.find((member) => member.nickname !== playerName)?.nickname;
		outcome = "draw";
		if (winner) outcome = winner === uuid ? "won" : "lost";
		time = formatTime(final_time);
	}

	const scoreChange = score_changes?.find((member) => member.uuid === uuid);
	const eloChange = scoreChange?.change ?? 0;
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
	} as FormattedMatch;
};

export const formatMatches = (matches: DetailedMatch[], curPlayerName: string) => {
	return matches.map((match) => formatMatch(match, curPlayerName));
};

export type Timeline = { what: string; when: number }[];

export const formatDetailedMatch = (match: DetailedMatch, curPlayerName: string) => {
	const seedType = match.seed_type?.replaceAll("_", " ") ?? "unknown";

	let curPlayerTimeline: Timeline | undefined;
	let opponentTimeline: Timeline | undefined;

	const curPlayerUUID = match.members.find((member) => member.nickname === curPlayerName)?.uuid;

	const outcome: Outcome =
		match.winner === null ? "draw" : match.winner === curPlayerUUID ? "won" : "lost";

	if (match.timelines && curPlayerUUID) {
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
			const what = advancementsMap.get(eventName);
			if (what) {
				const event = { what, when: time };
				if (uuid === curPlayerUUID) {
					curPlayerTimeline.push(event);
				} else {
					opponentTimeline.push(event);
				}
			}
		}

		if (outcome === "won") {
			if (match.forfeit) {
				opponentTimeline.push({ what: "forfeit", when: match.final_time });
			} else {
				curPlayerTimeline.push({ what: "win", when: match.final_time });
			}
		} else if (outcome === "lost") {
			if (match.forfeit) {
				curPlayerTimeline.push({ what: "forfeit", when: match.final_time });
			} else {
				opponentTimeline.push({ what: "win", when: match.final_time });
			}
		}
	}

	return {
		seedType,
		date: formatDate(match.match_date),
		curPlayerTimeline,
		opponentTimeline,
		curPlayerName,
		opponentName: match.members.find((player) => player.uuid !== curPlayerUUID)?.nickname,
		time: match.final_time,
		outcome,
	};
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
