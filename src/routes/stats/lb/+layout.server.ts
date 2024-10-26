import { formatRecordLeaderboard } from "$lib/formatters";
import type { APIResponse, RecordLeaderboard } from "$lib/ranked-api.js";
import { getBestTimesURL } from "$lib/urls";

export const config = {
  isr: {
    expiration: 60,
  },
};

const uniqueBestTimesThisSeasonPromise = fetch(
  getBestTimesURL({ unique: true, allTime: false }),
)
  .then((res) => res.json() as APIResponse<RecordLeaderboard>)
  .then((res) => formatRecordLeaderboard(res.data));

const allBestTimesThisSeasonPromise = fetch(
  getBestTimesURL({ unique: false, allTime: false }),
)
  .then((res) => res.json() as APIResponse<RecordLeaderboard>)
  .then((res) => formatRecordLeaderboard(res.data));

const uniqueBestTimesAllTimePromise = fetch(
  getBestTimesURL({ unique: true, allTime: true }),
)
  .then((res) => res.json() as APIResponse<RecordLeaderboard>)
  .then((res) => formatRecordLeaderboard(res.data));

const allBestTimesAllTimePromise = fetch(
  getBestTimesURL({ unique: false, allTime: true }),
)
  .then((res) => res.json() as APIResponse<RecordLeaderboard>)
  .then((res) => formatRecordLeaderboard(res.data));

export const load = async ({ fetch }) => {
  const [
    uniqueBestTimesThisSeason,
    allBestTimesThisSeason,
    uniqueBestTimesAllTime,
    allBestTimesAllTime,
  ] = await Promise.all([
    uniqueBestTimesThisSeasonPromise,
    allBestTimesThisSeasonPromise,
    uniqueBestTimesAllTimePromise,
    allBestTimesAllTimePromise,
  ]);

  return {
    uniqueBestTimesThisSeason,
    allBestTimesThisSeason,
    uniqueBestTimesAllTime,
    allBestTimesAllTime,
  };
};
