<script lang="ts">
	import type { PointsLeaderboard } from "$lib/ranked-api";
	import PlayerLink from "./PlayerLink.svelte";
	import TableRow from "./TableRow.svelte";

	export let player: PointsLeaderboard["users"][number];
	export let place: number;
	export let fadePts: boolean;
</script>

<TableRow>
	<div
		class="mr-4 w-4 text-right font-extrabold text-zinc-600 hover-hover:group-hover:text-zinc-300">
		{place}
	</div>
	<div class="flex-1 text-center text-zinc-300">
		<PlayerLink name={player.nickname} uuid={player.uuid} />
	</div>
	<div class="w-20 text-center text-zinc-600">
		{player.seasonResult.eloRate} elo
	</div>
	<div class="font-medium w-16 text-right {fadePts ? 'text-zinc-500' : 'text-zinc-300'}">
		{player.seasonResult.phasePoint} pts
	</div>
</TableRow>
