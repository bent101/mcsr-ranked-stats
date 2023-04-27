import { matchesPerPage } from "./globals";
import type { Date, DetailedMatch } from "./ranked-api";
import moment from "moment";

const base = "https://mcsrranked.com/api";

export const getLeaderboardURL = () => {
	return `${base}/leaderboard`;
};

export const getAvatar = (uuid: string, size = 256) => {
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
		date: formatDateShort(match_date),
		id: match_id,
	} as FormattedMatch;
};

export const formatMatches = (matches: DetailedMatch[], curPlayerName: string) => {
	return matches.map((match) => formatMatch(match, curPlayerName));
};

export type Timeline = { what: string; when: number }[];
export type TimelineInPair = {
	what: string;
	when: number;
	diff: number;
	importance: number;
	hasMatch: boolean;
}[];

const formatTimelinePair = (timeline1: Timeline, timeline2: Timeline) => {
	const formatted1: TimelineInPair = [];
	const formatted2: TimelineInPair = [];

	let highestDiff = 0;

	for (const event of timeline1) {
		const formatted = { ...event, diff: event.when, importance: 0, hasMatch: false };
		const match = timeline2.find(({ what }) => what === event.what);
		if (match) {
			formatted.hasMatch = true;
			formatted.diff -= match.when;
			highestDiff = Math.max(highestDiff, Math.abs(formatted.diff));
		}
		formatted1.push(formatted);
	}

	for (const event of timeline2) {
		const formatted = { ...event, diff: event.when, importance: 0, hasMatch: false };
		const match = timeline1.find(({ what }) => what === event.what);
		if (match) {
			formatted.hasMatch = true;
			formatted.diff -= match.when;
			highestDiff = Math.max(highestDiff, Math.abs(formatted.diff));
		}
		formatted2.push(formatted);
	}

	for (const event of formatted1) {
		event.importance = Math.abs(event.diff) / highestDiff;
	}
	for (const event of formatted2) {
		event.importance = Math.abs(event.diff) / highestDiff;
	}

	return [formatted1, formatted2];
};

const indexDuplicateEvents = (timeline: Timeline) => {
	const numSeen = new Map();
	for (const i in timeline) {
		const { what } = timeline[i];
		if (numSeen.has(what)) {
			numSeen.set(what, numSeen.get(what) + 1);
			timeline[i].what += " " + numSeen.get(what);
		} else {
			numSeen.set(what, 1);
		}
	}
};

const formatSplits = (timeline: Timeline) => {
	const ret: Timeline = [];
	for (let i = 0; i < timeline.length; i++) {
		const { what, when } = timeline[i];
		const prev = timeline[i - 1];
		const prevTime = prev?.when ?? 0;
		const longSplitName = prev ? `${prev.what} → ${what}` : what;
		const splitName = shortenSplitName(longSplitName);
		const time = when - prevTime;
		ret.push({ what: splitName, when: time });
	}
	return ret;
};
const shortenSplitName = (splitName: string) => {
	const map = new Map([
		["stronghold → end enter", "stronghold nav"],
		["end enter → win", "end split"],
		["nether enter", "overworld"],
		["nether enter → bastion", "terrain to bastion"],
		["nether enter → fortress", "terrain to fortress"],
	]);
	return map.get(splitName) ?? splitName;
};

export const formatDetailedMatch = (match: DetailedMatch, curPlayerName: string) => {
	const seedType = match.seed_type?.replaceAll("_", " ") ?? "unknown";

	let curPlayerTimeline: Timeline | undefined;
	let opponentTimeline: Timeline | undefined;

	const curPlayerUUID = match.members.find((member) => member.nickname === curPlayerName)?.uuid;

	const outcome: Outcome =
		match.winner === null ? "draw" : match.winner === curPlayerUUID ? "won" : "lost";

	let grouped = null;

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
		} else {
			curPlayerTimeline.push({ what: "draw", when: match.final_time });
			opponentTimeline.push({ what: "draw", when: match.final_time });
		}

		const curPlayerSplits = formatSplits(curPlayerTimeline);
		const opponentSplits = formatSplits(opponentTimeline);

		indexDuplicateEvents(curPlayerTimeline);
		indexDuplicateEvents(opponentTimeline);
		indexDuplicateEvents(curPlayerSplits);
		indexDuplicateEvents(opponentSplits);

		const timelinePair = formatTimelinePair(curPlayerTimeline, opponentTimeline);
		const splitsPair = formatTimelinePair(curPlayerSplits, opponentSplits);
		const opponentName = match.members.find((player) => player.uuid !== curPlayerUUID)?.nickname;

		grouped = [
			{ name: curPlayerName, timeline: timelinePair[0], splits: splitsPair[0] },
			{ name: opponentName, timeline: timelinePair[1], splits: splitsPair[1] },
		];
	}

	return {
		timelinePair: grouped,
		seedType,
		date: formatDate(match.match_date),
		time: match.final_time,
		outcome,
		eloChange: match.score_changes?.find((scoreChange) => scoreChange.uuid === curPlayerUUID)
			?.change,
	};
};

export const formatTime = (timeInMs: number, signed = false) => {
	const seconds = Math.round(Math.abs(timeInMs) / 1000);
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const sign = timeInMs < 0 ? "-" : "+";
	return `${signed ? sign : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

const formatDateShort = (date: Date) => {
	const seconds = Math.floor(Date.now() / 1000 - date);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days) return `${days}d`;
	if (hours > 18) return "1d";
	if (hours) return `${hours}h`;
	if (minutes) return `${minutes}m`;
	return `${seconds}s`;
};

export const formatDate = (date: Date) => {
	const seconds = Math.floor(Date.now() / 1000 - date);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days) return days > 1 ? `${days} days ago` : "yesterday";
	if (hours > 18) return "yesterday";
	if (hours) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	if (minutes) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
};
