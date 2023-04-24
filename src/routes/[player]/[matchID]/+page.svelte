<script lang="ts">
	import { formatTime } from "$lib/utils.js";

	export let data;
</script>

<div
	class="relative w-[30rem] overflow-clip rounded-3xl bg-zinc-800 px-8 py-4 shadow-lg shadow-black/30">
	<!-- {#await promise}
		<div class="absolute inset-0 grid place-items-center bg-zinc-800/70">
			<div class="text-xl font-bold text-zinc-100" />
		</div>
	{/await} -->
	{#if data.match}
		<h2 class="mb-2 text-sm font-bold uppercase tracking-wide text-zinc-400">
			{data.match.seedType} seed <span class="mx-1 text-zinc-500">•</span>
			{data.match.date}
		</h2>
		{#if data.match.curPlayerTimeline && data.match.opponentTimeline}
			<div class="flex w-full">
				<div class="flex-1">
					<div class="flex items-baseline">
						<h3 class="text-lg font-semibold text-zinc-300">
							{data.match.curPlayerName}
						</h3>
						<div class="flex-1 text-center text-lg font-bold leading-3 tracking-wide text-zinc-600">
							vs
						</div>
					</div>

					<ol class="mt-2">
						{#each data.match.curPlayerTimeline as { what, when }}
							<li class="py-0.5">
								<span class="mr-1 inline-block w-12 rounded-md bg-zinc-800 text-sm font-extrabold"
									>{formatTime(when)}</span>
								<span class="">{what}</span>
							</li>
						{/each}
					</ol>
				</div>
				<div class="flex-1">
					<h3 class="text-lg font-semibold text-zinc-300">{data.match.opponentName}</h3>
					<ol class="mt-2">
						{#each data.match.opponentTimeline as { what, when }}
							<li class="py-0.5">
								<span class="mr-1 inline-block w-12 rounded-md bg-zinc-800 text-sm font-extrabold"
									>{formatTime(when)}</span>
								<span class="">{what}</span>
							</li>
						{/each}
					</ol>
				</div>
			</div>
		{:else}
			<div class="py-12 text-center text-zinc-500">Timelines aren't available for this match</div>
		{/if}
	{:else}
		<div class="py-12 text-center text-zinc-500">Click a match to see its details</div>
	{/if}
</div>
