<script lang="ts">
	export let options: string[];
	export let selectedIdx = 0;
	export let label = "";
	export let throttling = 0;
	let disabled = false;
	let throttleTimeout = -1;

	const onClick = (i: number) => {
		selectedIdx = i;
		disabled = true;
		clearTimeout(throttleTimeout);
		throttleTimeout = setTimeout(() => {
			disabled = false;
		}, throttling);
	};
</script>

<div class="inline-flex items-center font-extrabold">
	<span class="mr-2 inline-block text-sm uppercase text-zinc-400">{label}:</span>
	<div class="inline-flex overflow-clip rounded-full border border-zinc-400 text-xs">
		{#each options as option, i}
			<button
				{disabled}
				on:click={() => onClick(i)}
				class="cursor-pointer px-3 py-1 uppercase"
				class:selected={i === selectedIdx}>
				{option}
			</button>
		{/each}
	</div>
</div>

<style lang="postcss">
	:not(.selected) {
		@apply bg-zinc-800 text-zinc-400;
	}
	.selected {
		@apply bg-zinc-400 text-zinc-900;
	}
</style>
