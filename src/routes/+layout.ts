import { getLeaderboard } from "$lib/utils";
import type { LayoutLoad } from "./$types";

export const load = (async () => {
	const lb = await getLeaderboard();
	return { lb };
}) satisfies LayoutLoad;
