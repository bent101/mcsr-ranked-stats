import type { Outcome } from "./globals";
import type { DetailedMatch, Match, RecordLeaderboard } from "$lib/ranked-api";
import { getTimelines } from "./match-timelines";

export type FormattedMatch = {
	isDecay: boolean;
	curPlayerName: string | undefined;
	opponentName: string | undefined;
	opponentUUID: string | undefined;
	winnerUUID: string | undefined;
	outcome: Outcome;
	outcomeColor: string;
	forfeit: boolean;
	time: string | undefined;
	eloChange: number;
	eloBefore: number | undefined;
	date: number;
	id: number;
};

export const formatTime = (timeInMs: number, signed = false) => {
	const seconds = Math.floor(Math.abs(timeInMs) / 1000);
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const sign = timeInMs < 0 ? "-" : "+";
	return `${signed ? sign : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

/**
 * @returns 15s, 2h, 25d, etc
 */
export const formatTimeAgoShort = (secondsAgo: number) => {
	const minutes = Math.floor(secondsAgo / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days) return `${days}d`;
	if (hours > 18) return "1d";
	if (hours) return `${hours}h`;
	if (minutes) return `${minutes}m`;
	return `${secondsAgo}s`;
};

/**
 * @returns 15 minutes ago, 5 days ago, etc
 */
export const formatTimeAgo = (secondsAgo: number) => {
	const minutes = Math.floor(secondsAgo / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days) return days > 1 ? `${days} days ago` : "yesterday";
	if (hours > 18) return "yesterday";
	if (hours) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
	if (minutes) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
	return `${secondsAgo} second${secondsAgo > 1 ? "s" : ""} ago`;
};

export const formatMatch = (match: Match, curPlayerName: string | undefined): FormattedMatch => {
	const { is_decay, winner, final_time, members, score_changes, forfeit, match_date, match_id } =
		match;
	let opponentName = undefined;
	let opponentUUID;
	let time = undefined;
	let outcome: Outcome = undefined;

	const uuid = members.find((member) => member.nickname === curPlayerName)?.uuid;
	if (!is_decay) {
		const opponentInfo = members.find((member) => member.nickname !== curPlayerName);
		opponentName = opponentInfo?.nickname;
		opponentUUID = opponentInfo?.uuid;
		outcome = "draw";
		if (winner) outcome = winner === uuid ? "won" : "lost";
		time = formatTime(final_time);
	}

	const winnerUUID = match.winner ?? undefined;

	const scoreChange = score_changes?.find(
		(member) => member.uuid === (curPlayerName ? uuid : winnerUUID)
	);
	const eloChange = scoreChange?.change ?? 0;
	const eloBefore = scoreChange?.score;

	const getOutcomeColor = (outcome: Outcome) => {
		switch (outcome) {
			case "won":
				return "text-green-400";
			case "lost":
				return "text-red-400";
			case "draw":
				return "text-blue-400";
			default:
				return "text-zinc-400";
		}
	};

	const outcomeColor = getOutcomeColor(outcome);

	return {
		isDecay: is_decay,
		curPlayerName,
		opponentName,
		opponentUUID,
		winnerUUID,
		outcome,
		outcomeColor,
		forfeit,
		time,
		eloChange,
		eloBefore,
		date: match_date,
		id: match_id,
	};
};

export const formatMatches = (matches: Match[], curPlayerName: string | undefined = undefined) => {
	return matches.map((match) => formatMatch(match, curPlayerName));
};

export const formatRecordLeaderboard = (lb: RecordLeaderboard) => {
	return lb.map((match) => ({
		playerName: match.user.nickname,
		playerUUID: match.user.uuid,
		time: formatTime(match.final_time),
		date: match.match_date,
		id: match.match_id,
	}));
};

export function formatDetailedMatch(
	match: DetailedMatch,
	curPlayerName: string | undefined = undefined
) {
	const seedType = match.seed_type?.replaceAll("_", " ") ?? "unknown";

	const curPlayerUUID = match.members.find((member) => member.nickname === curPlayerName)?.uuid;
	const curPlayerIdx = match.members.findIndex((member) => member.uuid === curPlayerUUID);
	const winnerUUID = match.winner;
	const winnerIdx = match.members.findIndex((member) => member.uuid === winnerUUID);

	// if `curPlayerUUID` is defined, put it first; otherwise, put the winner first
	const playerOrder = match.members.map((member) => member.uuid);
	if (!curPlayerName) {
		if (winnerIdx !== -1) {
			[playerOrder[winnerIdx], playerOrder[0]] = [playerOrder[0], playerOrder[winnerIdx]];
		}
	} else if (curPlayerIdx === -1) {
		console.error(`couldnt find ${curPlayerName} in match ${match.match_id}`);
	} else {
		[playerOrder[curPlayerIdx], playerOrder[0]] = [playerOrder[0], playerOrder[curPlayerIdx]];
	}

	const playerNames = playerOrder.map(
		(uuid) => match.members.find((member) => member.uuid === uuid)!.nickname
	);

	const eloChanges = playerOrder.map((uuid) => {
		const scoreChange = match.score_changes?.find((val) => val.uuid === uuid);
		return scoreChange
			? {
					before: scoreChange.score,
					change: scoreChange.change,
			  }
			: undefined;
	});

	const outcome: Outcome =
		curPlayerUUID === undefined
			? undefined
			: match.winner === null
			? "draw"
			: match.winner === curPlayerUUID
			? "won"
			: "lost";

	return {
		/** order of `eloChanges` and `timelines`, by player uuid */
		playerUUIDs: playerOrder,
		playerNames,
		eloChanges,
		timelines: getTimelines(match, playerOrder, winnerUUID),
		curPlayerName,
		curPlayerUUID,
		winnerUUID,
		seedType,
		date: match.match_date,
		time: match.final_time,
		outcome,
	};
}
