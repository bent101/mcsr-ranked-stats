<script lang="ts">
	export let selected = false;
	export let href: string | undefined = undefined;

	$: isLink = !!href;
</script>

{#if isLink}
	<a
		{href}
		data-sveltekit-replacestate
		data-sveltekit-noscroll
		class="group flex items-center gap-2 rounded-lg border px-4 py-1.5 text-left {selected
			? 'border-zinc-500 bg-zinc-800'
			: 'border-transparent hover:bg-zinc-800'}">
		<slot />
	</a>
{:else}
	<div
		class="group flex items-center gap-2 rounded-lg border px-4 py-1.5 text-left {selected
			? 'border-zinc-500 bg-zinc-800'
			: 'border-transparent hover:bg-zinc-800'}">
		<slot />
	</div>
{/if}