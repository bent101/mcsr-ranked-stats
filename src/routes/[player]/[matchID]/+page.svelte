<script lang="ts">
	import Switch from "$lib/Switch.svelte";
	import { formatTime } from "$lib/utils.js";
	export let data;
	let showingSplits = true;
</script>

{#if data.match}
	<div class="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-400">
		<h2>
			<span class="mr-1.5">{data.match.seedType} seed</span>
			<span class="inline-block text-zinc-500">
				{data.match.date}
			</span>
		</h2>

		<div class="ml-auto self-start">
			<Switch bind:onFirst={showingSplits} options={["Splits", "Timestamps"]} />
		</div>
	</div>
	{#if data.match.timelinePair}
		<div class="flex w-full gap-2">
			{#each data.match.timelinePair as { name, timeline, splits }}
				<div class="flex-1">
					<div class="flex items-baseline">
						<h3 class="text-lg font-semibold text-zinc-300">
							{name}
						</h3>
					</div>

					<ol class="mt-2">
						{#each showingSplits ? splits : timeline as { what, when, diff, importance }}
							<li class="py-0.5">
								<span class="mr-1 inline-block w-12 rounded-md bg-zinc-800 text-sm font-extrabold"
									>{formatTime(when)}</span>
								<span class="">{what}</span>
							</li>
						{/each}
					</ol>
				</div>
			{/each}
		</div>
	{:else}
		<div class="py-12 text-center text-zinc-500">Timelines aren't available for this match</div>
	{/if}
{:else}
	<div class="py-12 text-center text-zinc-500">Click a match to see its details</div>
{/if}
