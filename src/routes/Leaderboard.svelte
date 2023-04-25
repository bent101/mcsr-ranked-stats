<script lang="ts">
	import { afterNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { PlayerInfo } from "$lib/ranked-api";
	import { flip } from "svelte/animate";

	export let lb: PlayerInfo[] | undefined;
	let titleContainer: HTMLElement;
	let lbContainer: HTMLElement;
	let windowHeight: number;

	let rawQuery: string | undefined;
	$: query = rawQuery?.toLowerCase() ?? "";
	$: filteredLb = lb?.filter((player) => {
		return player.nickname.toLowerCase().includes(query);
	});

	let inputIsFocused = false;

	afterNavigate(() => {
		rawQuery = "";
	});
</script>

<svelte:window bind:innerHeight={windowHeight} />

<div class="min-h-screen w-80 border-r-2 border-zinc-700 bg-zinc-950">
	<h1
		bind:this={titleContainer}
		class="bg-zinc-950/70 p-4 text-center text-sm font-extrabold uppercase tracking-wide text-zinc-500">
		MSCR Ranked Leaderboard
	</h1>
	<div class="sticky top-0 z-20 mb-2 bg-zinc-950/70 px-6 py-2 text-zinc-500 backdrop-blur-md">
		<input
			on:focus={() => (inputIsFocused = true)}
			on:blur={() => (inputIsFocused = false)}
			on:keydown={(e) => {
				if (!rawQuery) return;
				if (e.key === "Enter") {
					goto(`/${rawQuery}`);
				}
			}}
			bind:value={rawQuery}
			placeholder="Search for players"
			class="w-full rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-zinc-400 placeholder:text-zinc-600" />
	</div>

	{#if lb}
		{#if filteredLb && filteredLb.length > 0}
			<ol class="pb-32 pl-4" bind:this={lbContainer}>
				{#each filteredLb as { nickname, elo_rate: elo, elo_rank: rank, uuid } (uuid)}
					{@const selected = nickname === $page.params.player}
					<li
						class={selected ? "sticky bottom-12 top-20 z-10" : ""}
						animate:flip={{ duration: inputIsFocused ? 0 : 400 }}>
						<a
							href="/{nickname}"
							class="group flex h-8 items-center rounded-l-full border-2 leading-normal transition-all {selected
								? ' translate-x-0.5 border-zinc-700 border-r-zinc-900 bg-zinc-900'
								: 'border-transparent hover:bg-zinc-900/50 '}">
							<div
								class=" w-12 px-2 text-right font-extrabold {selected
									? 'text-zinc-400'
									: 'text-zinc-800 group-hover:text-zinc-400'}">
								{rank ?? "???"}
							</div>
							<div
								class=" flex-1 px-2 text-center {selected
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
		{:else}
			<div class="w-[20.5rem] py-16 text-center text-zinc-500">No results in the top 150</div>
		{/if}
	{:else}
		<div class="mt-32 text-center font-bold text-red-700">Couldn't get leaderboard :/</div>
	{/if}
</div>
