import type {
  APIResponse,
  DetailedMatch,
  Match,
  RecordLeaderboard,
} from "$lib/ranked-api";
import { getFinalTime, getOutcome, getWinnerUUID } from "./getters";
import type { Outcome } from "./globals";
import {
  addMissingEvents,
  addSplits,
  fillColors,
  getSimpleEvent,
  getTimelines,
  indexDuplicates,
} from "./match-timelines";
import { getMatchesURL } from "./urls.js";
import { flatten, toTitleCase } from "./utils";

export type FormattedMatch = {
  isDecay: boolean;
  curPlayerName: string | undefined;
  opponentName: string | undefined;
  opponentUUID: string | undefined;
  winnerUUID: string | null;
  outcome: Outcome;
  outcomeColor: string;
  forfeited: boolean;
  time: string | undefined;
  eloChange: number;
  eloBefore: number | undefined;
  date: number;
  id: number;
};

export const formatTime = (timeInMs: number, { signed = false } = {}) => {
  const seconds = Math.abs(timeInMs) / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const sign = timeInMs < 0 ? "-" : "+";

  const formattedSeconds = Math.floor(remainingSeconds)
    .toString()
    .padStart(2, "0");

  return `${signed ? sign : ""}${minutes}:${formattedSeconds}`;
};

export const formatTimeWithPrecision = (
  timeInMs: number,
  { precision }: { precision: number },
) => {
  const seconds = Math.abs(timeInMs) / 1000;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const mainTime = `${minutes}:${Math.floor(remainingSeconds).toString().padStart(2, "0")}`;
  const decimal = remainingSeconds.toFixed(precision).split(".")[1] || "";

  return { mainTime, decimal };
};

/**
 * @returns 15s, 2h, 25d, 3mo, etc
 */
export const formatTimeAgoShort = (secondsAgo: number) => {
  secondsAgo = Math.max(secondsAgo, 0);
  const minutes = Math.floor(secondsAgo / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.43685);
  const years = Math.floor(months / 12);

  if (years > 1) return `${years}y`;
  if (months > 1) return `${months}mo`;
  if (days) return `${days}d`;
  if (hours) return `${hours}h`;
  if (minutes) return `${minutes}m`;
  return "now";
};

const plural = (count: number, singular: string, plural = `${singular}s`) => {
  return `${count} ${count === 1 ? singular : plural}`;
};

const formatTimeInterval = (seconds: number) => {
  seconds = Math.max(seconds, 0);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.43685);
  const years = Math.floor(months / 12);

  if (years > 1) return plural(years, "year");
  if (months > 1) return plural(months, "month");
  if (days) return plural(days, "day");
  if (hours) return plural(hours, "hour");
  if (minutes) return plural(minutes, "minute");
  return null;
};

/**
 * @returns 15 minutes ago, 5 days ago, etc
 */
export const formatRelativeTime = (secondsAgo: number) => {
  const fmtdTimeInterval = formatTimeInterval(Math.abs(secondsAgo));
  if (fmtdTimeInterval === null)
    return secondsAgo > 0 ? "just now" : "in <1 minute";
  return secondsAgo >= 0 ? `${fmtdTimeInterval} ago` : `in ${fmtdTimeInterval}`;
};

export const formatMatch = (
  match: Match,
  curPlayerName: string | undefined,
): FormattedMatch => {
  const { decayed, players, changes, forfeited, date, id } = match;
  let opponentName: string | undefined;
  let opponentUUID: string | undefined;
  let time: string | undefined;
  let outcome: Outcome;

  const winnerUUID = getWinnerUUID(match);

  const curPlayerUUID = players.find(
    (member) => member.nickname.toLowerCase() === curPlayerName?.toLowerCase(),
  )?.uuid;
  if (!decayed) {
    const opponentInfo = players.find(
      (member) =>
        member.nickname.toLowerCase() !== curPlayerName?.toLowerCase(),
    );
    opponentName = opponentInfo?.nickname;
    opponentUUID = opponentInfo?.uuid;
    outcome = "draw";
    if (winnerUUID !== null)
      outcome = winnerUUID === curPlayerUUID ? "won" : "lost";
    const rawFinalTime = getFinalTime(match);
    time = rawFinalTime ? formatTime(rawFinalTime) : undefined;
  }

  const scoreChange =
    changes?.find(
      (member) =>
        member.uuid === (curPlayerName != null ? curPlayerUUID : winnerUUID),
    ) ?? changes?.[0];
  const eloChange = scoreChange?.change ?? 0;
  const eloBefore = scoreChange?.eloRate ?? undefined;

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
    isDecay: decayed,
    curPlayerName,
    opponentName,
    opponentUUID,
    winnerUUID,
    outcome,
    outcomeColor,
    forfeited,
    time,
    eloChange,
    eloBefore,
    date: date,
    id: id,
  };
};

export const formatMatches = (
  matches: Match[],
  curPlayerName: string | undefined = undefined,
) => {
  return matches.map((match) => formatMatch(match, curPlayerName));
};

export const formatRecordLeaderboard = (lb: RecordLeaderboard) => {
  return lb.map((match) => ({
    playerName: match.user.nickname,
    playerUUID: match.user.uuid,
    time: formatTimeWithPrecision(match.time, { precision: 2 }),
    date: match.date,
    id: match.id,
  }));
};

export function formatDetailedMatch(
  match: DetailedMatch,
  curPlayerName?: string,
) {
  const seedType =
    match.seedType != null && toTitleCase(match.seedType.replaceAll("_", " "));

  const bastionType = match.bastionType && toTitleCase(match.bastionType);

  const curPlayerUUID = match.players.find(
    (member) => member.nickname.toLowerCase() === curPlayerName?.toLowerCase(),
  )?.uuid;
  const curPlayerIdx = match.players.findIndex(
    (member) => member.uuid === curPlayerUUID,
  );
  const winnerUUID = getWinnerUUID(match);
  const winnerIdx = match.players.findIndex(
    (member) => member.uuid === winnerUUID,
  );

  // if `curPlayerUUID` is defined, put it first; otherwise, put the winner first
  const playerOrder = match.players.map((member) => member.uuid);
  if (curPlayerName === undefined) {
    if (winnerIdx !== -1) {
      [playerOrder[winnerIdx], playerOrder[0]] = [
        playerOrder[0],
        playerOrder[winnerIdx],
      ];
    }
  } else if (curPlayerIdx === -1) {
    console.error(`couldnt find ${curPlayerName} in match ${match.id}`);
  } else {
    [playerOrder[curPlayerIdx], playerOrder[0]] = [
      playerOrder[0],
      playerOrder[curPlayerIdx],
    ];
  }

  const playerNames = playerOrder.map(
    (uuid) => match.players.find((member) => member.uuid === uuid)!.nickname,
  );

  const eloChanges = playerOrder.map((uuid) => {
    const scoreChange = match.changes?.find((val) => val.uuid === uuid);
    return scoreChange?.eloRate != null
      ? {
          before: scoreChange.eloRate,
          change: scoreChange.change,
        }
      : undefined;
  });

  const outcome = getOutcome(match, { curPlayerUUID });

  return {
    /** order of `eloChanges` and `timelines`, by player uuid */
    playerUUIDs: playerOrder,
    playerNames,
    eloChanges,
    timelines: getTimelines(match, playerOrder),
    curPlayerName,
    curPlayerUUID,
    winnerUUID,
    seedType,
    bastionType,
    date: match.date,
    time: getFinalTime(match),
    outcome,
    forfeit: match.forfeited,
    rank: match.rank,
    season: match.season,
  };
}

export type FormattedDetailedMatch = ReturnType<typeof formatDetailedMatch>;

export function getRank(elo: number) {
  if (elo < 600) {
    return {
      color: "from-gray-700 to-gray-500",
      name: `Coal ${elo < 400 ? "I" : elo < 500 ? "II" : "III"}`,
    };
  }
  if (elo < 900) {
    return {
      color: "from-zinc-500 to-zinc-200",
      name: `Iron ${elo < 700 ? "I" : elo < 800 ? "II" : "III"}`,
    };
  }
  if (elo < 1200) {
    return {
      color: "from-yellow-300 to-yellow-600",
      name: `Gold ${elo < 1000 ? "I" : elo < 1100 ? "II" : "III"}`,
    };
  }
  if (elo < 1500) {
    return {
      color: "from-green-400 to-emerald-600",
      name: `Emerald ${elo < 1300 ? "I" : elo < 1400 ? "II" : "III"}`,
    };
  }
  if (elo < 2000) {
    return {
      color: "from-sky-300 to-blue-500",
      name: `Diamond ${elo < 1650 ? "I" : elo < 1800 ? "II" : "III"}`,
    };
  }
  return {
    color: "from-violet-400 to-purple-500",
    name: `Netherite`,
  };
}

export async function getMatches(
  playerName: string,
  page: number,
  perPage: number,
  excludeDecay = false,
) {
  return fetch(getMatchesURL(playerName, page, perPage, excludeDecay))
    .then((res) => res.json() as APIResponse<Match[]>)
    .then((res) => formatMatches(res.data, playerName));
}

export async function getAllMatches(playerName: string, numMatches: number) {
  const numPages = Math.ceil(numMatches / 50);

  return flatten(
    await Promise.all(
      Array(numPages)
        .fill(undefined)
        .map((_, i) => getMatches(playerName, i, 50, true)),
    ),
  );
}

export async function getRawMatches(
  playerName: string,
  page: number,
  perPage: number,
  excludeDecay = true,
) {
  return fetch(getMatchesURL(playerName, page, perPage, excludeDecay))
    .then((res) => res.json() as APIResponse<Match[]>)
    .then((res) => res.data);
}

export async function getAllRawMatches(playerName: string, numMatches: number) {
  const numPages = Math.ceil(numMatches / 50);

  return flatten(
    await Promise.all(
      Array(numPages)
        .fill(undefined)
        .map((_, i) => getRawMatches(playerName, i, 50)),
    ),
  );
}

export function formatPercent(ratio: number) {
  return `${Math.round(ratio * 100)}%`;
}

export function parseWeeklyRaceRun(
  run: string,
  finalTime: number,
  playerUUID: string,
) {
  const unformattedTimeline = run.split("\n").map((event) => {
    const [eventName, timestamp] = event.split(":");
    return { type: eventName, time: parseInt(timestamp) };
  });

  const timeline = unformattedTimeline
    .map((event) => getSimpleEvent(event.type, event.time))
    .filter(Boolean);

  addMissingEvents(timeline, {
    finalTime,
    unformattedTimeline: run
      .split("\n")
      .map((event) => ({ type: event.split(":")[0] })),
    winnerUUID: playerUUID,
  });

  fillColors(timeline);
  addSplits(timeline);
  indexDuplicates(timeline);

  return timeline;
}
