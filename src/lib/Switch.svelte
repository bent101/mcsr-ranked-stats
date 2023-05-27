<script lang="ts">
	export let options: [string, string];
	export let onFirst: boolean = true;
</script>

<button
	class="inline-flex w-max overflow-clip rounded-full border border-zinc-400 text-xs font-extrabold uppercase"
	on:click={() => (onFirst = !onFirst)}>
	<span class="flex-1 border-r border-zinc-400 px-2" class:selected={onFirst}>{options[0]}</span>
	<span class="flex-1 px-2" class:selected={!onFirst}>{options[1]}</span>
</button>

<style lang="postcss">
	span:not(.selected) {
		@apply text-zinc-400;
	}
	span.selected {
		@apply bg-zinc-400 text-zinc-900;
	}
</style>
