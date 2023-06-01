<script lang="ts">
	import Switch from "$lib/Switch.svelte";
	import { createLocalStorageStore, formatDetailedMatch, formatTime } from "$lib/utils.js";
	export let match: ReturnType<typeof formatDetailedMatch>;
	let showingSplits = createLocalStorageStore("showingSplits", true);
	let detailLevel = 1;
</script>

<div class="mb-2 ml-2 text-sm font-bold uppercase tracking-wide text-zinc-400">
	<div class="mb-2 flex items-center justify-between">
		<div>
			<Switch bind:onFirst={$showingSplits} options={["Splits", "Timestamps"]} />
		</div>
	</div>

	<h2>
		<span class="mr-1.5">{match.seedType} seed</span>
		<span class="inline-block text-zinc-500">
			{match.date}
		</span>
	</h2>
</div>
{#if match.timelinePair}
	<div class="mx-2 flex w-full gap-4">
		{#each match.timelinePair as { name, timeline, splits }, i}
			{@const isCurPlayer = i === 0}
			<div class="flex-1">
				<div class="flex items-baseline">
					<h3 class="text-lg font-semibold text-zinc-300">
						{name}
					</h3>
				</div>

				<ol class="mt-2">
					{#each $showingSplits ? splits : timeline as { what, when, diff, importance, hasMatch }}
						{@const color = `hsl(${diff >= 0 ? 0 : 142}, 70%, ${Math.round(
							90 - 40 * importance ** 1.5
						)}%)`}
						<li class="w-max py-0.5">
							<span class="mr-1 inline-block w-12 text-sm font-extrabold">{formatTime(when)} </span>
							<span class="inline-block"
								>{what}
								{#if isCurPlayer && hasMatch}
									<span class="ml-2 font-semibold" style="color: {color};"
										>{formatTime(diff, true)}</span>
								{/if}
							</span>
						</li>
					{/each}
				</ol>
			</div>
		{/each}
	</div>
{:else}
	<div class="p-12 text-center text-zinc-500">Timelines aren't available for this match</div>
{/if}
