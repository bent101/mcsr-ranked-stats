<script lang="ts">
	import PointsLbTableRow from "$lib/components/PointsLbTableRow.svelte";
	import info from "$lib/assets/info.png";
	import Tooltip from "$lib/components/Tooltip.svelte";
	import { formatRelativeTime } from "$lib/formatters.js";
	import { curDate } from "$lib/globals.js";

	export let data;

	$: ({ prevPointsLb, pointsLb } = data);
	$: ({ users } = prevPointsLb ?? pointsLb);

	let infoEl: HTMLElement | undefined;
</script>

<svelte:head>
	<title>Points leaderboard | MCSR Ranked stats</title>
</svelte:head>

<div class="mx-auto max-w-md py-[4.375rem] md:ml-16">
	<h1
		class="flex items-center justify-center gap-1 pt-2 text-xl font-bold text-zinc-300 md:justify-start"
	>
		{#if prevPointsLb}
			<p>Season {prevPointsLb.phase.season} points leaderboard</p>
		{:else}
			<p>Points leaderboard</p>
		{/if}
		<div bind:this={infoEl} class="rounded-full p-2 hover:bg-zinc-800">
			<img src={info} alt="" class="h-4 w-4 select-none opacity-30 invert" />
			<Tooltip hoverable anchor={infoEl} directionPreference={["right", "top", "bottom", "left"]}>
				<p class=" max-w-xs text-left text-sm font-normal">
					Phase Points are earned at the end of each phase and determine who qualifies for Playoffs.
					<a
						href="https://docs.google.com/document/d/1f1MCooNaWbRKrqPSBAHznFR_blXME0p2h-4Ew49G5fQ/edit"
						class="text-zinc-700 underline underline-offset-2"
						target="_blank">Learn more</a
					>
				</p>
			</Tooltip>
		</div>
	</h1>

	<p class="text-center text-sm text-zinc-500 md:text-left">
		Phase {pointsLb.phase.number}
		{prevPointsLb ? ` for season ${pointsLb.phase.season}` : ""} ends
		{formatRelativeTime($curDate - pointsLb.phase.endsAt)}
	</p>

	<ol class="mx-auto mt-8 max-w-sm border-t-2 border-zinc-800 pb-[36rem] pt-8 md:ml-0">
		{#each users as player, i (player.uuid)}
			{@const prevPlayer = users[i - 1]}
			{@const nextPlayer = users[i + 1]}
			{@const playerPts = player.seasonResult.phasePoint}
			{@const prevPlayerPts = prevPlayer?.seasonResult.phasePoint}
			{@const nextPlayerPts = nextPlayer?.seasonResult.phasePoint}
			{@const samePtsAsPrev = prevPlayerPts === playerPts}
			<PointsLbTableRow {player} place={i + 1} fadePts={samePtsAsPrev} />
			{#if i === 11}
				<div class="flex items-center gap-1 py-1">
					<div class="flex-1 border-t border-dashed border-zinc-700" />
					<p class="text-xs font-semibold uppercase tracking-wide text-zinc-500">Top 12 qualify</p>
					<div class="flex-1 border-t border-dashed border-zinc-700" />
				</div>
			{/if}
			{#if (playerPts ?? 0) >= 20 && (nextPlayerPts ?? 0) < 20}
				<div class="flex items-center gap-1 py-1">
					<div class="flex-1 border-t border-dashed border-zinc-700" />
					<p class="text-xs font-semibold uppercase tracking-wide text-zinc-500">
						20+ pts play in quals
					</p>
					<div class="flex-1 border-t border-dashed border-zinc-700" />
				</div>
			{/if}
		{/each}
	</ol>
</div>
