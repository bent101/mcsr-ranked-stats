import type { DetailedMatch } from "$lib/ranked-api.js";
import { error, json } from "@sveltejs/kit";

export const GET = async ({ fetch, params }) => {
	const data = await fetch(`https://mcsrranked.com/api/matches=${params.id}`).then((res) =>
		res.json()
	);
	if (!data.data) throw error(404);
	const match: DetailedMatch = data.data;
	type Timeline = { where: string; when: number }[];
	const timeline1 = [] as Timeline;
	const timeline2 = [] as Timeline;

	if (match.timelines) {
		const advancementsMap = new Map([
			["story.enter_the_nether", "enter"],
			["nether.find_bastion", "bastion"],
			["nether.find_fortress", "fortress"],
			["projectelo.timeline.blind_travel", "blind"],
			["story.follow_ender_eye", "stronghold"],
			["story.enter_the_end", "end enter"],
		]);

		for (const { time, timeline, uuid } of match.timelines) {
			const where = advancementsMap.get(timeline);
			if (!where) continue;
			if (uuid === match.timelines[0].uuid) {
				timeline1.push({ where, when: time });
			}
		}
	}
};
