import { formatRecordLeaderboard } from "$lib/formatters";
import { getBestTimesURL } from "$lib/urls";

export const config = {
  isr: {
    expiration: 60,
  },
};

const uniqueBestTimesThisSeasonPromise = fetch(
  getBestTimesURL({ unique: true, allTime: false })
)
  .then((res) => res.json())
  .then((res) => formatRecordLeaderboard(res.data));

const allBestTimesThisSeasonPromise = fetch(
  getBestTimesURL({ unique: false, allTime: false })
)
  .then((res) => res.json())
  .then((res) => formatRecordLeaderboard(res.data));

const uniqueBestTimesAllTimePromise = fetch(
  getBestTimesURL({ unique: true, allTime: true })
)
  .then((res) => res.json())
  .then((res) => formatRecordLeaderboard(res.data));

const allBestTimesAllTimePromise = fetch(
  getBestTimesURL({ unique: false, allTime: true })
)
  .then((res) => res.json())
  .then((res) => formatRecordLeaderboard(res.data))

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

export const load = async ({ fetch }) => {
  return {
    uniqueBestTimesThisSeason,
    allBestTimesThisSeason,
    uniqueBestTimesAllTime,
    allBestTimesAllTime,
  };
};
