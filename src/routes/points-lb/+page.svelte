<script lang="ts">
	import PointsLbTableRow from "$lib/components/PointsLbTableRow.svelte";
	import info from "$lib/assets/info.png";
	import Tooltip from "$lib/components/Tooltip.svelte";
	import { formatRelativeTime } from "$lib/formatters.js";
	import { curDate } from "$lib/globals.js";

	export let data;

	$: ({ phase, users } = data.pointsLb);

	let infoEl: HTMLElement | undefined;
</script>

<svelte:head>
	<title>Points leaderboard | MCSR Ranked stats</title>
</svelte:head>

<div class="mx-auto max-w-md py-[4.375rem] md:ml-16">
	<h1
		class="flex items-center justify-center gap-1 pt-2 text-xl font-bold text-zinc-300 md:justify-start">
		<p>Points leaderboard</p>
		<div bind:this={infoEl} class="p-2 rounded-full hover:bg-zinc-800">
			<img src={info} alt="" class="h-4 w-4 select-none opacity-30 invert" />
			<Tooltip hoverable anchor={infoEl} directionPreference={["right", "top", "bottom", "left"]}>
				<p class=" text-sm font-normal max-w-xs text-left">
					Points are earned at the <b>end of each phase</b> (3 per season) and determine who
					qualifies for <b>Playoffs</b>.
					<a
						href="https://docs.google.com/document/d/1f1MCooNaWbRKrqPSBAHznFR_blXME0p2h-4Ew49G5fQ/edit"
						class="underline underline-offset-2 text-zinc-700"
						target="_blank">Learn more</a>
				</p>
			</Tooltip>
		</div>
	</h1>

	<p class="text-zinc-500 text-sm text-center md:text-left">
		Phase {phase.number} of 3 ends {formatRelativeTime($curDate - phase.endsAt)}
	</p>

	<ol class="mx-auto mt-8 max-w-sm border-t-2 border-zinc-800 pt-8 md:ml-0 pb-[36rem]">
		{#each users as player, i (player.uuid)}
			{@const prevPlayer = users[i - 1]}
			{@const nextPlayer = users[i + 1]}
			{@const playerPts = player.seasonResult.phasePoint}
			{@const prevPlayerPts = prevPlayer?.seasonResult.phasePoint}
			{@const nextPlayerPts = nextPlayer?.seasonResult.phasePoint}
			{@const samePtsAsPrev = prevPlayerPts === playerPts}
			{@const samePtsAsNext = nextPlayerPts === playerPts}
			<PointsLbTableRow {player} place={i + 1} fadePts={samePtsAsPrev} />
			{#if i === 11}
				<div class="flex items-center gap-1 py-1">
					<div class="border-t border-zinc-700 border-dashed flex-1" />
					<p class="text-zinc-500 text-xs uppercase font-semibold tracking-wide">Top 12 qualify</p>
					<div class="border-t border-zinc-700 border-dashed flex-1" />
				</div>
			{/if}
			{#if (playerPts ?? 0) >= 15 && (nextPlayerPts ?? 0) < 15}
				<div class="flex items-center gap-1 py-1">
					<div class="border-t border-zinc-700 border-dashed flex-1" />
					<p class="text-zinc-500 text-xs uppercase font-semibold tracking-wide">
						15+ pts play in quals
					</p>
					<div class="border-t border-zinc-700 border-dashed flex-1" />
				</div>
			{/if}
		{/each}
	</ol>
</div>
