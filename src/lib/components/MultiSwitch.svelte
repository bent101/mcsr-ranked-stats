<script lang="ts">
	export let options: string[] | readonly string[];
	export let selectedIdx = 0;
	export let label: string | null = null;
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

<div class="inline-flex w-max items-center font-extrabold">
	{#if label}
		<span class="mr-2 inline-block text-sm uppercase text-zinc-400">{label}:</span>
	{/if}
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
	button {
		@apply text-zinc-400;
	}
	button.selected {
		@apply bg-zinc-400 text-zinc-900;
	}
</style>
