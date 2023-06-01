<script lang="ts">
	export let options: [string, string];
	export let onFirst: boolean = true;
</script>

<button
	class="inline-flex overflow-clip rounded-full border border-zinc-400 text-xs font-extrabold uppercase"
	on:click={() => (onFirst = !onFirst)}>
	<div class="px-2" class:selected={onFirst}>{options[0]}</div>
	<div class="px-2" class:selected={!onFirst}>{options[1]}</div>
</button>

<style lang="postcss">
	:not(.selected) {
		@apply bg-zinc-800 text-zinc-400;
	}
	.selected {
		@apply bg-zinc-400 text-zinc-900;
	}
</style>
