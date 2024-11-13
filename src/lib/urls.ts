import { matchesPerPage } from "./globals";

const base = "https://mcsrranked.com/api";

export const getLeaderboardURL = () => {
  return `${base}/leaderboard`;
};

export const getPointsLeaderboardURL = ({
  season,
}: { season?: number } = {}) => {
  return `${base}/phase-leaderboard${season != null ? `?season=${season}` : ""}`;
};

export const getPlayerURL = (name: string) => {
  return `${base}/users/${name}`;
};

export const getMatchesURL = (
  name: string,
  page: number,
  perPage = matchesPerPage,
  excludeDecay = false,
) => {
  return `${base}/users/${name}/matches?type=2&page=${page}&count=${perPage}${
    excludeDecay ? "&excludedecay" : ""
  }`;
};

export const getDetailedMatchURL = (id: string | number) => {
  return `${base}/matches/${id}`;
};

export const getBestTimesURL = ({
  unique,
  allTime,
}: {
  unique: boolean;
  allTime: boolean;
}) => {
  if (allTime) return `${base}/record-leaderboard${unique ? "?distinct" : ""}`;
  return `${base}/record-leaderboard?season${unique ? "&distinct" : ""}`;
};

export const getVersusURL = (player1: string, player2: string) => {
  return `${base}/users/${player1}/versus/${player2}?type=2`;
};

export const getVersusMatchesURL = (player1: string, player2: string) => {
  return `${base}/users/${player1}/versus/${player2}/matches?type=2&count=50`;
};

export const getWeeklyRaceURL = () => {
  return `${base}/weekly-race`;
};

export const getPlayoffsURL = () => {
  return `${base}/playoffs`;
};

export const getWeeklyRaceMatchURL = ({
  playerUUID,
  weeklyRaceId: weekId,
}: {
  playerUUID: string;
  weeklyRaceId: number;
}) => {
  return `${base}/weekly-race/${weekId}/${playerUUID}`;
};

export const getSkinURL = (uuidOrName: string) => {
  return `https://mineskin.eu/skin/${uuidOrName}`;
};
