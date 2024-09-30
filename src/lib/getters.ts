import type { Outcome } from "./globals";
import type { Match } from "./ranked-api";

export function getWinnerUUID(match: Match) {
  return match.result?.uuid ?? null;
}

export function getFinalTime(match: Match) {
  if (match.decayed) throw new Error("Failed to get final time: match decayed");
  return match.result.time;
}

export function getOutcome(
  match: Match,
  { curPlayerUUID }: { curPlayerUUID: string | undefined },
): Outcome {
  const winnerUUID = getWinnerUUID(match);
  if (winnerUUID === null) return "draw";
  if (curPlayerUUID === undefined) return undefined;
  return curPlayerUUID === winnerUUID ? "won" : "lost";
}
