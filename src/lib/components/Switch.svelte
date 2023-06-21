<script lang="ts">
	export let options: [string, string];
	export let onFirst: boolean = true;
	export let throttling = 0;
	export let dark = false;

	let disabled = false;
	let throttleTimeout = -1;

	const onClick = () => {
		onFirst = !onFirst;
		disabled = true;
		clearTimeout(throttleTimeout);
		throttleTimeout = setTimeout(() => {
			disabled = false;
		}, throttling);
	};
</script>

<button
	{disabled}
	class:dark
	class="inline-flex cursor-pointer overflow-clip rounded-full border border-zinc-400 text-xs font-extrabold uppercase"
	on:click={onClick}>
	<div class="px-3 py-1" class:selected={onFirst}>{options[0]}</div>
	<div class="px-3 py-1" class:selected={!onFirst}>{options[1]}</div>
</button>

<style lang="postcss">
	:not(.dark) :not(.selected) {
		@apply bg-zinc-800 text-zinc-400;
	}
	.dark :not(.selected) {
		@apply bg-zinc-900 text-zinc-400;
	}
	.selected {
		@apply bg-zinc-400 text-zinc-900;
	}
</style>
