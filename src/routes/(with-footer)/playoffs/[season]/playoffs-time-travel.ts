import type { PlayoffsResponse } from "$lib/ranked-api";
import _ from "lodash";

/**
 * simplifying assumptions:
 * - every game is 15 min
 * - every match is a reverse sweep

 */
export function playoffsTimeTravel(
  realPlayoffs: PlayoffsResponse,
  fakeTime: number,
) {
  const ret = _.cloneDeep(realPlayoffs);

  ret.data.matches.forEach((m) => {
    if (m.startTime === null) {
      throw new Error(
        `unexpected null startTime in realPlayoffs, matchId: ${m.id}`,
      );
    }

    const t = fakeTime - m.startTime;

    if (t >= 0) {
      const winnerIdx = m.participants.findIndex(
        (p) => p.roundScore === m.maxRoundScore,
      );
      const winner = m.participants[winnerIdx];
      const loser = m.participants[1 - winnerIdx];
      winner.roundScore = Math.min(
        winner.roundScore,
        Math.max(0, Math.floor(t / (15 * 60) - loser.roundScore)),
      );
      loser.roundScore = Math.min(loser.roundScore, Math.floor(t / (15 * 60)));
    } else {
      m.participants[0].roundScore = 0;
      m.participants[1].roundScore = 0;

      if (t < -16 * 60 * 60) {
        m.startTime = null;
      }
      if (t < -17 * 60 * 60) {
        m.participants = [m.participants[0]];
      }
      if (t < -18 * 60 * 60) {
        m.participants = [];
      }
    }

    m.state =
      m.startTime === null
        ? null
        : fakeTime < m.startTime
          ? "SCHEDULED"
          : Math.max(
                m.participants[0].roundScore,
                m.participants[1].roundScore,
              ) < m.maxRoundScore
            ? "ACTIVE"
            : "DONE";
  });

  const gf = ret.data.matches.find((m) => m.name === "Grand Final");
  if (!gf) {
    throw new Error("Grand Final not found");
  }
  if (
    Math.max(...gf.participants.map((p) => p.roundScore)) < gf.maxRoundScore
  ) {
    ret.data.results = [];
  }

  return ret;
}
