<script lang="ts">
	import { getAverageTime, getForfeitRate } from "$lib/analyze-matches";
	import { formatTime, getAllRawMatches } from "$lib/formatters";
	import type { DetailedPlayer } from "$lib/ranked-api";
	import { sum } from "$lib/utils";

	export let playerData: DetailedPlayer;
	export let numMatches: number;

	let loadingMoreStats = false;
	let moreStats: null | { forfeitRate: number; averageTime: number | null; points: number } = null;

	async function loadMoreStats() {
		loadingMoreStats = true;
		const matchesData = await getAllRawMatches(playerData.uuid, numMatches);
		loadingMoreStats = false;

		moreStats = {
			averageTime: getAverageTime(matchesData, playerData.uuid),
			forfeitRate: getForfeitRate(matchesData, playerData.uuid),
			points: sum(playerData.seasonResult.phases.map((phase) => phase.point)),
		};
	}
</script>

{#if moreStats}
	<p class="text-white/50">
		{#if moreStats.averageTime}
			<b>{formatTime(moreStats.averageTime)}</b> average
			<span class="font-extrabold text-white/30">•</span>
		{/if}
		<b>{Math.floor(100 * moreStats.forfeitRate)}</b>% forfeit rate
		<span class="font-extrabold text-white/30">•</span>
		<b>{moreStats.points}</b> points
	</p>
{:else}
	<button
		on:click={loadMoreStats}
		disabled={loadingMoreStats}
		class="text-white text-opacity-50 underline-offset-2 enabled:underline disabled:animate-pulse enabled:hover:text-opacity-100">
		{loadingMoreStats ? "Loading..." : "Show more"}
	</button>
{/if}

<style lang="postcss">
	b {
		@apply font-bold text-white/70;
	}
</style>
