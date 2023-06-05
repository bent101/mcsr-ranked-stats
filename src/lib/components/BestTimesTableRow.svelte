<script lang="ts">
	import { page } from "$app/stores";
	import type { formatRecordLeaderboard } from "$lib/formatters";
	import PlayerLink from "./PlayerLink.svelte";
	import TableRow from "./TableRow.svelte";

	export let match: ReturnType<typeof formatRecordLeaderboard>[0];
	export let place: number;

	$: href = `/lb/${match.id}`;
	$: selected = $page.url.pathname === href;
</script>

<TableRow {selected} {href}>
	<div
		class="mr-4 w-4 text-right font-extrabold {selected
			? 'text-zinc-300'
			: 'group/hover:text-zinc-300 text-zinc-600'}">
		{place}
	</div>
	<div class="flex-1 text-center text-zinc-300">
		<PlayerLink name={match.playerName} uuid={match.playerUUID} />
	</div>
	<div
		class="w-20 text-center font-extrabold tracking-wider
             {selected ? 'text-zinc-300' : 'text-zinc-400'}">
		{match.time}
	</div>
	<div class="w-10 text-right {selected ? 'text-zinc-300' : 'text-zinc-600'}">
		{match.date}
	</div>
</TableRow>
