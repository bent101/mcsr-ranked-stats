<script lang="ts">
	import BestTimesTableRow from "$lib/components/BestTimesTableRow.svelte";
	import MatchDetailsFrame from "$lib/components/MatchDetailsFrame.svelte";
	import Switch from "$lib/components/Switch.svelte";
	import { createLocalStorageStore } from "$lib/utils";
	import { flip } from "svelte/animate";
	import { scale } from "svelte/transition";

	export let data;

	const showingAll = createLocalStorageStore("showingAll", false);
	const showingAllTime = createLocalStorageStore("showingAllTime", false);

	$: matches = $showingAll
		? $showingAllTime
			? data.allBestTimesAllTime
			: data.allBestTimesThisSeason
		: $showingAllTime
		? data.uniqueBestTimesAllTime
		: data.uniqueBestTimesThisSeason;
</script>

<svelte:head>
	<title>Fastest times | MCSR Ranked stats</title>
</svelte:head>

<div class="mx-auto max-w-md py-[4.375rem] md:ml-16">
	<h1 class="pt-2 text-xl font-bold text-zinc-300 md:justify-start">Fastest times</h1>
	<div class="pt-1 flex gap-2">
		<Switch options={["all time", "this season"]} bind:onFirst={$showingAllTime} />
		<Switch options={["all", "unique"]} bind:onFirst={$showingAll} />
	</div>
	<ol class="mx-auto mt-8 max-w-sm border-t-2 border-zinc-800 pt-8 md:ml-0 pb-[36rem]">
		{#each matches as match, i (match.id)}
			<li in:scale={{ delay: 100 + 8 * i, duration: 250, start: 0.7 }}>
				<BestTimesTableRow place={i + 1} {match} />
			</li>
		{/each}
	</ol>
</div>

<MatchDetailsFrame>
	<slot />
</MatchDetailsFrame>
