import type { Outcome } from "./globals";
import type { Match, NonDecayMatch } from "./ranked-api";

export function getWinnerUUID(match: Pick<Match, "result">) {
  return match.result?.uuid ?? null;
}

if (true) 1;

export function getFinalTime(match: Pick<NonDecayMatch, "result">) {
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
