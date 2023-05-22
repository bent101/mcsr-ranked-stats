<script lang="ts">
	import { afterNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { PlayerInfo } from "$lib/ranked-api";
	import { flip } from "svelte/animate";

	export let lb: PlayerInfo[] | undefined;
	let titleContainer: HTMLElement | undefined;
	let lbContainer: HTMLElement | undefined;
	let searchInput: HTMLElement | undefined;

	let rawQuery: string | undefined;
	$: rawQuery = rawQuery?.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 16);
	$: query = rawQuery?.toLowerCase() ?? "";
	$: filteredLb =
		lb?.filter((player) => {
			if (query === "") return true;
			const name = player.nickname.toLowerCase();
			const start = name.indexOf(query[0]);
			if (start === -1) return false;
			let i = 1;
			for (let j = start + 1; j < name.length; j++) {
				if (name[j] === query[i]) {
					i++;
					if (i === query.length) break;
				}
			}
			return i === query.length;
		}) ?? [];

	$: filteredLb, (arrowSelectedIdx = rawQuery ? 0 : -1);

	$: isMatch = filteredLb.find((player) => player.nickname.toLowerCase() === query);

	$: isExtra = rawQuery !== "" && !isMatch;
	$: numResults = filteredLb.length + (isExtra ? 1 : 0);
	let arrowSelectedIdx = -1;

	let inputIsFocused = false;

	afterNavigate(() => {
		rawQuery = "";
	});
</script>

<svelte:window
	on:keypress={(e) => {
		if (e.key === "/") {
			searchInput?.focus();
		}
	}} />

<div class="min-h-screen w-80 border-r-2 border-zinc-700 bg-zinc-950 text-sm">
	<h1
		bind:this={titleContainer}
		class="bg-zinc-950/70 p-4 pl-2 text-center font-extrabold uppercase tracking-wide text-zinc-500">
		MSCR Ranked Leaderboard
	</h1>
	<div class="sticky top-0 z-20 mb-2 bg-zinc-950/70 p-4 pl-2 text-zinc-500 backdrop-blur-md">
		<div class="relative">
			<input
				type="search"
				bind:value={rawQuery}
				bind:this={searchInput}
				on:focus={() => {
					inputIsFocused = true;
				}}
				on:blur={() => {
					inputIsFocused = false;
					arrowSelectedIdx = -1;
				}}
				on:keydown={(e) => {
					if (e.key === "ArrowDown") {
						arrowSelectedIdx = (arrowSelectedIdx + 1) % numResults;
					} else if (e.key === "ArrowUp") {
						arrowSelectedIdx = (arrowSelectedIdx + numResults - 1) % numResults;
					} else if (e.key === "Enter") {
						if (arrowSelectedIdx === numResults - 1) {
							goto(`/${rawQuery}`);
						} else if (filteredLb[arrowSelectedIdx]?.nickname) {
							goto(`/${filteredLb[arrowSelectedIdx].nickname}`);
						}
					} else if (e.key === "Escape") {
						searchInput?.blur();
					}
				}}
				placeholder="Search for players"
				class="w-full rounded-lg border border-zinc-800 bg-transparent px-3 py-1.5 text-zinc-400 placeholder:text-zinc-600 search-cancel:hidden" />
			{#if !inputIsFocused}
				<kbd
					class="pointer-events-none absolute inset-y-0 right-1.5 my-auto h-6 w-6 rounded-sm border border-zinc-800 bg-zinc-900/50 text-center font-extrabold text-zinc-500">
					/
				</kbd>
			{/if}
		</div>
	</div>

	{#if lb}
		<ol class="pb-16 pl-2" bind:this={lbContainer}>
			{#each filteredLb as { nickname, elo_rate: elo, elo_rank: rank, uuid }, i (uuid)}
				{@const selected = nickname === $page.params.player}
				{@const arrowSelected = arrowSelectedIdx === i}
				<li
					class={selected ? "sticky bottom-12 top-20 z-10" : ""}
					animate:flip={{ duration: inputIsFocused ? 0 : 400 }}>
					<a
						href="/{nickname}"
						class=" group flex h-8 items-center rounded-l-full border-2 leading-normal transition-transform duration-300 {selected
							? ' translate-x-1 border-zinc-700 border-r-zinc-900 bg-zinc-900'
							: `border-transparent ${
									arrowSelected ? 'bg-zinc-900/90' : 'hover:bg-zinc-900/50'
							  } `}">
						<div
							class=" w-12 px-2 text-right font-extrabold {selected
								? 'text-zinc-400'
								: 'text-zinc-700 group-hover:text-zinc-400'}">
							{rank ?? "??"}
						</div>
						<div
							class="flex-1 px-2 text-center {selected
								? ' text-zinc-300'
								: 'text-zinc-400 group-hover:text-zinc-300'}">
							{nickname}
						</div>
						<div
							class=" w-16 px-2 font-semibold {selected
								? 'text-zinc-500'
								: ' text-zinc-600  group-hover:text-zinc-500'}">
							{elo ?? "????"}
						</div>
					</a>
				</li>
			{/each}
			{#if isExtra}
				{@const arrowSelected = arrowSelectedIdx === numResults - 1}
				<li>
					<a
						href="/{rawQuery}"
						class="group flex h-8 items-center rounded-l-full border-2 border-transparent leading-normal transition-transform duration-300 {arrowSelected
							? 'bg-zinc-900/90'
							: 'hover:bg-zinc-900/50'}">
						<div
							class=" w-12 px-2 text-right font-extrabold text-zinc-700 group-hover:text-zinc-400">
							??
						</div>
						<div class="flex-1 px-2 text-center text-zinc-400 group-hover:text-zinc-300">
							{rawQuery}
						</div>
						<div class=" w-16 px-2 font-semibold text-zinc-600 group-hover:text-zinc-500">????</div>
					</a>
				</li>
			{/if}
		</ol>
	{:else}
		<div class="mt-32 text-center font-bold text-red-400">Couldn't get leaderboard :/</div>
	{/if}
</div>
