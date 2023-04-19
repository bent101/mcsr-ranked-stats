import { getLeaderboard } from "$lib/utils";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
	const lb = await getLeaderboard();
	return { lb };
};
