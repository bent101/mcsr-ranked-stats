import type { Match } from "./ranked-api";
import { avg } from "./utils";

export function getForfeitRate(matches: Match[], curPlayerUUID: string) {
	const nonDraws = matches.filter((match) => match.winner !== null);
	const isFF = (match: Match) => match.forfeit && match.winner !== curPlayerUUID;
	return avg(nonDraws.map((match) => (isFF(match) ? 1 : 0))) ?? 0;
}

export function getAverageTime(matches: Match[], curPlayerUUID: string) {
	const completions = matches.filter((match) => match.winner === curPlayerUUID && !match.forfeit);
	return avg(completions.map((match) => match.final_time));
}
