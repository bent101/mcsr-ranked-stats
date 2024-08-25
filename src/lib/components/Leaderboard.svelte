<script lang="ts">
	import { flip } from "svelte/animate";
	import SidebarTab from "$lib/components/SidebarTab.svelte";

	export let lb = [];
	export let animating = true;
</script>

{#if animating}
	{#each lb as { name, elo, rank, uuid, href, selected, arrowSelected } (uuid)}
		<!-- <div animate:flip={{ duration: 400 }}> -->
		<SidebarTab {href} {selected} {arrowSelected}>
			<div
				class=" w-12 px-2 text-right font-extrabold {selected
					? 'text-zinc-400'
					: 'text-zinc-700 hover-hover:group-hover:text-zinc-400'}"
			>
				{rank ?? "??"}
			</div>
			<div
				class="flex-1 px-2 text-center {selected
					? ' text-zinc-300'
					: 'text-zinc-400 hover-hover:group-hover:text-zinc-300'}"
			>
				{name}
			</div>
			<div
				class=" w-16 px-2 font-semibold {selected
					? 'text-zinc-500'
					: ' text-zinc-600  hover-hover:group-hover:text-zinc-500'}"
			>
				{elo ?? "????"}
			</div>
		</SidebarTab>
		<!-- </div> -->
	{/each}
{:else}
	<!-- this is a copy paste of the above list but without the animate:flip,
    because animate:flip={{ duration: 0 }} was causing performance issues -->
	{#each lb as { name, elo, rank, uuid, href, selected, arrowSelected } (uuid)}
		<SidebarTab {href} {selected} {arrowSelected}>
			<div
				class=" w-12 px-2 text-right font-extrabold {selected
					? 'text-zinc-400'
					: 'text-zinc-700 hover-hover:group-hover:text-zinc-400'}"
			>
				{rank ?? "??"}
			</div>
			<div
				class="flex-1 px-2 text-center {selected
					? ' text-zinc-300'
					: 'text-zinc-400 hover-hover:group-hover:text-zinc-300'}"
			>
				{name}
			</div>
			<div
				class=" w-16 px-2 font-semibold {selected
					? 'text-zinc-500'
					: ' text-zinc-600  hover-hover:group-hover:text-zinc-500'}"
			>
				{elo ?? "????"}
			</div>
		</SidebarTab>
	{/each}
{/if}
