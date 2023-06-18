<script lang="ts">
	import BestTimesTableRow from "$lib/components/BestTimesTableRow.svelte";
	import Switch from "$lib/components/Switch.svelte";
	import { createLocalStorageStore } from "$lib/utils";
	import { scale } from "svelte/transition";

	export let data;

	const showingAll = createLocalStorageStore("showingAll", false);
</script>

<svelte:head>
	<title>Fastest times | MCSR Ranked stats</title>
</svelte:head>

<div class="mx-auto max-w-sm py-[70px] md:ml-16">
	<h1 class="pt-[5.25rem] text-xl font-bold text-zinc-300">
		Fastest times this season
		<span class="ml-2 inline-block -translate-y-1">
			<Switch dark options={["all", "unique"]} bind:onFirst={$showingAll} />
		</span>
	</h1>
	<ol class="mt-5 border-t-2 border-zinc-800 pt-4">
		{#each $showingAll ? data.allBestTimes : data.uniqueBestTimes as match, i (match.id)}
			<li in:scale={{ delay: 100 + 8 * i, duration: 250, start: 0.7 }}>
				<BestTimesTableRow place={i + 1} {match} />
			</li>
		{/each}
	</ol>
</div>

<div class="pointer-events-none fixed bottom-0 left-0 right-0 z-10">
	<div
		class="pointer-events-auto relative mx-auto min-h-[6rem] w-[35rem] rounded-t-3xl bg-zinc-800 shadow-lg shadow-black/30 md:mr-4 2xl:ml-[52rem] 2xl:w-[43rem]">
		<slot />
	</div>
</div>
