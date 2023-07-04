import type { formatDetailedMatch } from "./formatters";

const seedTypes = ["buried treasure", "shipwreck", "desert temple", "village", "ruined portal"];

type Match = ReturnType<typeof formatDetailedMatch>;

export function getDetailedStats(matches: ReturnType<typeof formatDetailedMatch>[]) {
	// [...seedTypes, "all"]
	const matchesBySeed = Array(seedTypes.length + 1).fill([]);

	for (const match of matches) {
		const i = seedTypes.indexOf(match.seedType);
		if (i !== -1) {
			matchesBySeed[i].push(match);
		}
		matchesBySeed[matchesBySeed.length - 1].push(match);
	}

	return {
		seedFilters: [...seedTypes, "all"],
		statsBySeed: matchesBySeed.map((matches) => analyzeMatches(matches)),
	};
}

function analyzeMatches(matches: Match[]) {
	const numWins = matches.filter((match) => match.outcome === "won").length;
	const numForfeits = matches.filter((match) => match.forfeit && match.outcome === "lost").length;

	const completionTimes = matches
		.filter((match) => !match.forfeit && match.outcome == "won")
		.map((match) => match.time);

	const enterTimes = matches.map((match) => getTimestamp(match, "nether enter")).filter(Boolean);
	const navSplits = matches
		.map((match) => getSplit(match, "stronghold", "end enter"))
		.filter(Boolean);
	const endSplits = matches.map((match) => getSplit(match, "end enter", "finish")).filter(Boolean);

	return {
		winrate: numWins / matches.length,
		forfeitRate: numForfeits / matches.length,
		completionTimes: getDistStats(completionTimes),
		enterTimes: getDistStats(enterTimes),
		navSplits: getDistStats(navSplits),
		endSplits: getDistStats(endSplits),
	};
}

/** get the statistics of a distribution of numbers */
function getDistStats(dist: number[]) {
	return {
		data: dist,
		min: Math.min(...dist),
		max: Math.max(...dist),
		avg: dist.reduce((acc, cur) => acc + cur, 0) / dist.length,
	};
}

function getSplit(match: Match, startName: string, endName: string) {
	const start = getTimestamp(match, startName);
	const end = getTimestamp(match, endName);
	if (!start || !end) return undefined;
	return end - start;
}

function getTimestamp(match: Match, timestampName: string) {
	return getTimeline(match)?.find((event) => event.name === timestampName)?.timestamp;
}

function getTimeline(match: Match) {
	const curPlayerIdx = match.playerUUIDs.indexOf(match.curPlayerUUID!);
	return match.timelines?.[3]?.[curPlayerIdx];
}
