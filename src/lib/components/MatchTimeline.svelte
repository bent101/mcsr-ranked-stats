<script lang="ts">
	import { formatTime } from "$lib/formatters";
	import type { MatchEvent } from "$lib/match-timelines";
	import Tooltip from "./Tooltip.svelte";

	export let timeline: MatchEvent[] = [];

	let timelineContainer: HTMLElement | undefined;

	/** in pixels */
	const gap = 4;
</script>

{#key timeline}
	<div
		bind:this={timelineContainer}
		class="flex h-4 items-center gap-[0.125rem] overflow-hidden rounded-full">
		{#each timeline.slice(0, -1) as event, i (event.name)}
			{@const splitLength = event.splitAfter?.length ?? 0}
			<div
				class="h-2 min-w-[0.25rem] transition-[height] duration-200 first:rounded-l-full last:rounded-r-full hover:h-full"
				style="
            background-color: {event.color}; 
            flex: {splitLength};
            ">
				<Tooltip
					anchor={timelineContainer?.children[i]}
					directionPreference={["top", "bottom", "right", "left"]}>
					<div class="text-left">
						<span class="inline-block min-w-[2.25rem] font-bold"
							>{formatTime(event.timestamp)}</span>
						<span class="text-zinc-800">{event.name}</span>
						<br />
						<span class="inline-block min-w-[2.25rem] font-bold">{formatTime(splitLength)}</span>
						<span class="text-zinc-800">{event.splitAfter?.name ?? ""}</span>
					</div>
				</Tooltip>
			</div>
		{/each}
	</div>
{/key}
