import type { EloLeaderboard } from "$lib/ranked-api";
import { getLeaderboardURL } from "$lib/urls";
import type { LayoutLoad } from "./$types";
import type { Config } from "@sveltejs/adapter-vercel";

export const config: Config = {
	runtime: "edge",
	regions: ["lhr1"],
};

export const load = (async ({ fetch }) => {
	return {
		lb: fetch(getLeaderboardURL())
			.then((res) => res.json())
			.then((res) => res.data as EloLeaderboard),
	};
}) satisfies LayoutLoad;
