<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import type { PlayerInfo } from "$lib/ranked-api";
	import { tick } from "svelte";
	import { flip } from "svelte/animate";

	export let lb: PlayerInfo[] | undefined;
	let titleContainer: HTMLElement;
	let lbContainer: HTMLElement;
	let windowHeight: number;

	// afterNavigate(async () => {
	// 	await tick();
	// 	const element = document.querySelector(".selected");
	// 	if (!element) return;
	// 	const { top, bottom } = element.getBoundingClientRect();
	// 	const minTop = titleContainer.getBoundingClientRect().height;
	// 	const maxBottom = windowHeight;

	// 	if (top < minTop || bottom > maxBottom) {
	// 		element.scrollIntoView({ behavior: "smooth", block: "center" });
	// 	}
	// });
</script>

<svelte:window bind:innerHeight={windowHeight} />

<!-- <div class=" w-6 bg-zinc-950 transition-all duration-[10000ms] hover:w-80"> -->
<div class=" w-max bg-zinc-950">
	<h1
		bind:this={titleContainer}
		class="sticky top-0 z-20 border-r-2 border-zinc-700 bg-zinc-950/70 p-4 text-center font-extrabold uppercase tracking-wider text-zinc-600 backdrop-blur-md">
		MSCR Ranked<br />Leaderboard
	</h1>
	{#if lb}
		<ol class=" pl-4" bind:this={lbContainer}>
			{#each lb as { nickname, elo_rate: elo, elo_rank: rank, uuid } (uuid)}
				{@const selected = nickname === $page.params.player}
				<li class={selected ? "sticky bottom-12 top-20 z-10" : ""} animate:flip={{ duration: 400 }}>
					<a
						href="/{nickname}"
						class="group flex h-8 items-center rounded-l-full border-l-2 border-zinc-700 leading-normal {selected
							? 'border-2 border-r-zinc-900 bg-zinc-900'
							: 'border-0 border-x-2 border-l-transparent hover:bg-zinc-900/50 '}">
						<div
							class=" w-12 px-2 text-right font-extrabold {selected
								? 'text-zinc-400'
								: 'text-zinc-800 group-hover:text-zinc-400'}">
							{rank ?? "???"}
						</div>
						<div
							class=" w-44 px-2 text-center {selected
								? ' text-zinc-300'
								: 'text-zinc-400 group-hover:text-zinc-300'}">
							{nickname}
						</div>
						<div
							class=" w-20 px-2 font-semibold {selected
								? 'text-zinc-500'
								: ' text-zinc-700  group-hover:text-zinc-500'}">
							{elo}
						</div>
					</a>
				</li>
			{/each}
		</ol>
		<div class="h-32 border-r-2 border-zinc-800" />
	{:else}
		<div class="mt-32 text-center font-bold text-red-700">Couldn't get leaderboard :/</div>
	{/if}
</div>
