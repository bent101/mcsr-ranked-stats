import type { Outcome } from "./globals";
import type { Match } from "./ranked-api";

/**
 * @returns the uuid of the match winner
 */
export function getWinnerUUID(match: Match) {
  return match.result?.uuid ?? null;
}

export function getFinalTime(match: Match & { decayed: false }) {
  return match.result.time;
}

export function getOutcome(
  match: Match,
  { curPlayerUUID }: { curPlayerUUID: string | undefined }
): Outcome {
  if (curPlayerUUID === undefined) return undefined;
  const winnerUUID = getWinnerUUID(match);
  if (winnerUUID === null) return "draw";
  return curPlayerUUID === winnerUUID ? "won" : "lost";
}
