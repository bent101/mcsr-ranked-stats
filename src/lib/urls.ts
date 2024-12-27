import { matchesPerPage } from "./globals";

const base = "https://mcsrranked.com/api";

export const getLeaderboardURL = () => {
  return `${base}/leaderboard`;
};

export const getRecentsURL = () => {
  return `${base}/matches?count=50&type=2`;
};

export const getPointsLeaderboardURL = ({
  season,
}: { season?: number } = {}) => {
  const url = new URL(`${base}/phase-leaderboard`);
  if (season != null) url.searchParams.set("season", season.toString());

  return url.toString();
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
  const url = new URL(`${base}/users/${name}/matches`);
  url.searchParams.set("type", "2");
  url.searchParams.set("page", page.toString());
  url.searchParams.set("count", perPage.toString());
  if (excludeDecay) url.searchParams.set("excludedecay", "true");

  return url.toString();
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
  const url = new URL(`${base}/record-leaderboard`);
  if (!allTime) {
    url.searchParams.set("season", "");
  }
  if (unique) {
    url.searchParams.set("distinct", "");
  }
  return url.toString();
};

export const getVersusURL = (player1: string, player2: string) => {
  const url = new URL(`${base}/users/${player1}/versus/${player2}`);
  url.searchParams.set("type", "2");
  return url.toString();
};

export const getVersusMatchesURL = (player1: string, player2: string) => {
  const url = new URL(`${base}/users/${player1}/versus/${player2}/matches`);
  url.searchParams.set("type", "2");
  url.searchParams.set("count", "50");
  return url.toString();
};

export const getWeeklyRaceURL = () => {
  return `${base}/weekly-race`;
};

export const getPlayoffsURL = ({ season }: { season?: number | undefined }) => {
  return `${base}/playoffs/${season ?? "last"}`;
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
