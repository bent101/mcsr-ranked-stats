<script lang="ts">
	import { formatDetailedMatch, getDetailedMatchURL } from "$lib/utils";

	export let matchID: number;
	export let curPlayerID: string;
	let match: ReturnType<typeof formatDetailedMatch>;
	$: promise =
		matchID === -1
			? null
			: fetch(getDetailedMatchURL(matchID))
					.then((res) => res.json())
					.then((res) => formatDetailedMatch(res.data, curPlayerID));
</script>

<div class="min-h-16 w-96 rounded-3xl bg-zinc-800 px-8 py-4 shadow-lg shadow-black/30">
	{#await promise}
		<div class="grid place-items-center">
			<div class="text-zinc-500">Loading...</div>
		</div>
	{:then match}
		{#if match}
			<h2 class="mb-2 text-2xl text-zinc-300">{match.seedType} seed</h2>
			{#if match.curPlayerTimeline && match.opponentTimeline}
				<div class="flex w-full">
					<div class="flex-1">
						<h3 class="">{match.curPlayerName}</h3>
						<ol class="">
							{#each match.curPlayerTimeline as { where, when }}
								<li class="py-0.5">
									<span class="mr-1 inline-block w-12 rounded-md bg-zinc-800 text-sm font-extrabold"
										>{when}</span>
									<span class="">{where}</span>
								</li>
							{/each}
						</ol>
					</div>
					<div class="flex-1">
						<h3 class="">{match.opponentName}</h3>
						<ol class="">
							{#each match.opponentTimeline as { where, when }}
								<li class="py-0.5">
									<span class="mr-1 inline-block w-12 rounded-md bg-zinc-800 text-sm font-extrabold"
										>{when}</span>
									<span class="">{where}</span>
								</li>
							{/each}
						</ol>
					</div>
				</div>
			{:else}
				<div class="grid place-items-center">
					<div class="text-zinc-500">Timelines aren't available for this match</div>
				</div>
			{/if}
		{:else}
			<div class=" grid place-items-center">
				<div class="text-zinc-500">Click a match to see its details</div>
			</div>
		{/if}
	{/await}
</div>
