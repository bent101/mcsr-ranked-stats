<script lang="ts">
	import Switch from "$lib/Switch.svelte";
	import { formatTime } from "$lib/utils.js";
	export let data;
	let showingSplits = true;

	const shortenSplitName = (splitName: string) => {
		const map = new Map([
			["stronghold → end enter", "stronghold nav"],
			["end enter → win", "end split"],
			["nether enter", "overworld"],
			["nether enter → bastion", "terrain to bastion"],
			["nether enter → fortress", "terrain to fortress"],
		]);
		return map.get(splitName) ?? splitName;
	};
</script>

<div
	class="relative w-[32rem] overflow-clip rounded-3xl bg-zinc-800 py-4 pl-8 pr-4 shadow-lg shadow-black/30">
	{#if data.match}
		<div
			class="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-zinc-400">
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
		{#if data.match.curPlayerTimeline && data.match.opponentTimeline}
			<div class="flex w-full">
				{#each [{ name: data.match.curPlayerName, timeline: data.match.curPlayerTimeline }, { name: data.match.opponentName, timeline: data.match.opponentTimeline }] as { name, timeline }, i}
					<div class="flex-1">
						<div class="flex items-baseline">
							<h3 class="text-lg font-semibold text-zinc-300">
								{name}
							</h3>
							{#if i === 0}
								<div
									class="flex-1 text-center text-lg font-bold leading-3 tracking-wide text-zinc-600">
									vs
								</div>
							{/if}
						</div>

						<ol class="mt-2">
							{#each timeline as { what, when }, i}
								{@const prev = timeline[i - 1]}
								{@const prevTime = prev?.when ?? 0}
								{@const splitName = prev ? `${prev.what} → ${what}` : what}
								<li class="py-0.5">
									<span class="mr-1 inline-block w-12 rounded-md bg-zinc-800 text-sm font-extrabold"
										>{formatTime(showingSplits ? when - prevTime : when)}</span>
									<span class="">{showingSplits ? shortenSplitName(splitName) : what}</span>
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
</div>
