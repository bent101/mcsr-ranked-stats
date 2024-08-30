import type { Match } from "./ranked-api";
import { count, sum } from "./utils";

export function getForfeitRate(matches: Match[], curPlayerUUID: string) {
	const numForfeits = count(matches, (match) => match.forfeit && match.winner !== curPlayerUUID);
	return numForfeits / matches.length;
}

export function getAverageTime(matches: Match[], curPlayerUUID: string) {
	const completions = matches.filter((match) => match.winner === curPlayerUUID && !match.forfeit);
	return sum(completions.map((match) => match.final_time)) / completions.length;
}
