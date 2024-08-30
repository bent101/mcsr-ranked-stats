<script lang="ts">
	import { formatPercent, formatTime, getAllRawMatches } from "$lib/formatters";
	import type { DetailedPlayer } from "$lib/ranked-api";
	import { createEventDispatcher } from "svelte";
	import { fade, scale } from "svelte/transition";
	import PlayerProfile from "./PlayerProfile.svelte";
	import { getAverageTime, getForfeitRate } from "$lib/analyze-matches";

	export let playerName: string;
	export let numMatches: number; // needed for getAllMatches unfortunately
	export let playerData: DetailedPlayer; // for showing the player profile without loading it again

	$: statsPromise = getAllRawMatches(playerName, numMatches);
	// .then((matches) =>
	// 	Promise.all(
	// 		matches.map((match) =>
	// 			fetch(getDetailedMatchURL(match.id))
	// 				.then((res) => res.json())
	// 				.then((res) => formatDetailedMatch(res.data, playerName))
	// 		)
	// 	)
	// )
	// .then((matches) => getDetailedPlayerStats(matches));
	// $: stats = returnAfter1Sec(testStats);

	const dispatch = createEventDispatcher();
	const close = () => dispatch("close");

	// let curSeedFilterIdx = 0;

	//

	// onMount(async () => {
	// 	const testStats = await getAllMatches("doogile", 170)
	// 		.then((matches) =>
	// 			Promise.all(
	// 				matches.map((match) =>
	// 					fetch(getDetailedMatchURL(match.id))
	// 						.then((res) => res.json())
	// 						.then((res) => formatDetailedMatch(res.data, "doogile"))
	// 				)
	// 			)
	// 		)
	// 		.then((matches) => getDetailedPlayerStats(matches));

	// 	console.log(JSON.stringify(testStats));
	// });

	//
</script>

<svelte:window
	on:keydown={(event) => {
		if (event.key === "Escape") {
			close();
		}
	}} />

<div
	in:fade={{ duration: 200 }}
	on:click={close}
	on:keydown={(event) => {
		if (event.key === "Escape") {
			close();
		}
	}}
	class="fixed inset-0 z-50 bg-zinc-950/80">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		in:scale={{ duration: 200, start: 0.6 }}
		on:click|stopPropagation
		class="absolute inset-x-4 inset-y-12 mx-auto max-w-5xl overflow-clip overflow-y-scroll overscroll-contain rounded-3xl border-2 border-zinc-700 bg-zinc-950">
		<div class="sticky inset-x-0 top-0 z-10 bg-zinc-950 p-2">
			<div class="flex">
				<PlayerProfile {playerData} />
				<button
					on:click={close}
					class="ml-auto block h-9 w-9 rounded-full stroke-zinc-500 stroke-2 hover:bg-zinc-700/50">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<line x1="6" y1="6" x2="18" y2="18" />
						<line x1="6" y1="18" x2="18" y2="6" />
					</svg>
				</button>
			</div>
			<!-- <div
				class="overflow-x-scroll overscroll-none px-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800 hover:scrollbar-thumb-zinc-700">
				<MultiSwitch bind:selectedIdx={curSeedFilterIdx} options={seedTypesWithAll} />
			</div> -->
		</div>
		<div class="space-y-4 px-4 py-4">
			<div class="space-y-4 md:space-y-8">
				{#await statsPromise}
					<div class="animate-pulse pt-32 text-center text-lg font-semibold text-zinc-500">
						Crunching the numbers...
					</div>
				{:then statsData}
					{@const forfeitRate = getForfeitRate(statsData, playerData.uuid)}
					{@const averageTime = getAverageTime(statsData, playerData.uuid)}
					<section class="flex">
						<div class="flex flex-1 flex-col items-center">
							<div class="text-5xl font-semibold text-zinc-300">
								{numFilteredMatches}
							</div>
							<div class="text-base font-bold tracking-wider text-zinc-500">MATCHES</div>
						</div>
						<div class="flex flex-1 flex-col items-center">
							<div class="text-5xl font-semibold text-zinc-300">{formatPercent(winrate)}</div>
							<div class="text-base font-bold tracking-wider text-zinc-500">WINRATE</div>
						</div>
						<div class="flex flex-1 flex-col items-center">
							<div class="text-5xl font-semibold text-zinc-300">{formatPercent(forfeitRate)}</div>
							<div class="text-base font-bold tracking-wider text-zinc-500">FORFEIT RATE</div>
						</div>
					</section>

					<section class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-2 rounded-lg bg-zinc-900 p-4 pt-2">
							<h2 class="text-sm font-bold tracking-widest text-zinc-400">
								COMPLETIONS
								<!-- <span
									class="ml-1 inline-block rounded-full bg-zinc-400 px-1.5 text-xs font-bold tracking-normal text-zinc-950">
									{completionTimes.data.length}
								</span> -->
							</h2>
							<div class="flex items-center py-4">
								<div class="flex flex-1 flex-col items-center">
									<div class="text-2xl font-semibold text-zinc-500">
										{formatTime(completionTimes.min)}
									</div>
									<div class="text-xs font-bold tracking-wider text-zinc-500">FASTEST</div>
								</div>
								<div class="flex flex-1 flex-col items-center">
									<div class="text-3xl font-semibold text-zinc-300">
										{formatTime(completionTimes.avg)}
									</div>
									<div class="text-sm font-bold tracking-wider text-zinc-400">AVERAGE</div>
								</div>
								<div class="flex flex-1 flex-col items-center">
									<div class="text-2xl font-semibold text-zinc-500">
										{formatTime(completionTimes.max)}
									</div>
									<div class="text-xs font-bold tracking-wider text-zinc-500">SLOWEST</div>
								</div>
							</div>
						</div>

						<div class="space-y-2 rounded-lg bg-zinc-900 p-4 pt-2">
							<h2 class="text-sm font-bold tracking-widest text-zinc-400">
								NETHER ENTERS
								<!-- <span
									class="ml-1 inline-block rounded-full bg-zinc-400 px-1.5 text-xs font-bold tracking-normal text-zinc-950">
									{enterTimes.data.length}
								</span> -->
							</h2>
							<div class="flex items-center py-4">
								<div class="flex flex-1 flex-col items-center">
									<div class="text-2xl font-semibold text-zinc-500">
										{formatTime(enterTimes.min)}
									</div>
									<div class="text-xs font-bold tracking-wider text-zinc-500">FASTEST</div>
								</div>
								<div class="flex flex-1 flex-col items-center">
									<div class="text-3xl font-semibold text-zinc-300">
										{formatTime(enterTimes.avg)}
									</div>
									<div class="text-sm font-bold tracking-wider text-zinc-400">AVERAGE</div>
								</div>
								<div class="flex flex-1 flex-col items-center">
									<div class="text-2xl font-semibold text-zinc-500">
										{formatTime(enterTimes.max)}
									</div>
									<div class="text-xs font-bold tracking-wider text-zinc-500">SLOWEST</div>
								</div>
							</div>
						</div>

						<div class="space-y-2 rounded-lg bg-zinc-900 p-4 pt-2">
							<h2 class="text-sm font-bold tracking-widest text-zinc-400">
								STRONGHOLD NAV SPLITS
								<!-- <span
									class="ml-1 inline-block rounded-full bg-zinc-400 px-1.5 text-xs font-bold tracking-normal text-zinc-950">
									{navSplits.data.length}
								</span> -->
							</h2>
							<div class="flex items-center py-4">
								<div class="flex flex-1 flex-col items-center">
									<div class="text-2xl font-semibold text-zinc-500">
										{formatTime(navSplits.min)}
									</div>
									<div class="text-xs font-bold tracking-wider text-zinc-500">FASTEST</div>
								</div>
								<div class="flex flex-1 flex-col items-center">
									<div class="text-3xl font-semibold text-zinc-300">
										{formatTime(navSplits.avg)}
									</div>
									<div class="text-sm font-bold tracking-wider text-zinc-400">AVERAGE</div>
								</div>
								<div class="flex flex-1 flex-col items-center">
									<div class="text-2xl font-semibold text-zinc-500">
										{formatTime(navSplits.max)}
									</div>
									<div class="text-xs font-bold tracking-wider text-zinc-500">SLOWEST</div>
								</div>
							</div>
						</div>

						<div class="space-y-2 rounded-lg bg-zinc-900 p-4 pt-2">
							<h2 class="text-sm font-bold tracking-widest text-zinc-400">
								END SPLITS
								<!-- <span
									class="ml-1 inline-block rounded-full bg-zinc-400 px-1.5 text-xs font-bold tracking-normal text-zinc-950">
									{endSplits.data.length}
								</span> -->
							</h2>
							<div class="flex items-center py-4">
								<div class="flex flex-1 flex-col items-center">
									<div class="text-2xl font-semibold text-zinc-500">
										{formatTime(endSplits.min)}
									</div>
									<div class="text-xs font-bold tracking-wider text-zinc-500">FASTEST</div>
								</div>
								<div class="flex flex-1 flex-col items-center">
									<div class="text-3xl font-semibold text-zinc-300">
										{formatTime(endSplits.avg)}
									</div>
									<div class="text-sm font-bold tracking-wider text-zinc-400">AVERAGE</div>
								</div>
								<div class="flex flex-1 flex-col items-center">
									<div class="text-2xl font-semibold text-zinc-500">
										{formatTime(endSplits.max)}
									</div>
									<div class="text-xs font-bold tracking-wider text-zinc-500">SLOWEST</div>
								</div>
							</div>
						</div>
					</section>
				{/await}
			</div>
		</div>
	</div>
</div>
