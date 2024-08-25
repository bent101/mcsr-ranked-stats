<script lang="ts">
	export let options: [string, string];
	export let onFirst: boolean = true;
	export let throttling = 0;

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
	class="inline-flex cursor-pointer overflow-clip rounded-full border border-zinc-400 text-xs font-extrabold uppercase"
	on:mousedown={onClick}
>
	<div class="px-3 py-1" class:selected={onFirst}>{options[0]}</div>
	<div class="px-3 py-1" class:selected={!onFirst}>{options[1]}</div>
</button>

<style lang="postcss">
	div {
		@apply text-zinc-400 hover:bg-white/5;
	}
	div.selected {
		@apply bg-zinc-400 text-zinc-900;
	}
</style>
