import { getFinalTime, getWinnerUUID } from "./getters";
import type { Match } from "./ranked-api";
import { avg } from "./utils";

export function getForfeitRate(matches: Match[], curPlayerUUID: string) {
  const nonDraws = matches.filter((match) => getWinnerUUID(match) !== null);
  const isFF = (match: Match) =>
    match.forfeited && getWinnerUUID(match) !== curPlayerUUID;
  return avg(nonDraws.map((match) => (isFF(match) ? 1 : 0))) ?? 0;
}

export function getAverageTime(matches: Match[], curPlayerUUID: string) {
  const completions = matches.filter(
    (match): match is Match & { decayed: false } =>
      getWinnerUUID(match) === curPlayerUUID &&
      !match.forfeited &&
      !match.decayed
  );
  return avg(completions.map((match) => getFinalTime(match)));
}
