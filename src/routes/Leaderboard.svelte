<script lang="ts">
	import { afterNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import type { PlayerInfo } from "$lib/ranked-api";
	import { flip } from "svelte/animate";

	export let lb: PlayerInfo[] | undefined;
	let titleContainer: HTMLElement | undefined;
	let lbContainer: HTMLElement | undefined;
	let searchInput: HTMLElement | undefined;

	let rawQuery = "";
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

	$: extraOption = {
		name: `"${rawQuery}"`,
		href: `/${rawQuery}`,
		elo: "????",
		rank: "??",
		uuid: "extra",
	};

	$: cleanedLb = filteredLb.map((player) => ({
		name: player.nickname,
		href: `/${player.nickname}`,
		elo: player.elo_rate.toString(),
		rank: player.elo_rank?.toString() ?? "??",
		uuid: player.uuid,
	}));

	$: displayedLb = isExtra ? [...cleanedLb, extraOption] : cleanedLb;

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
				on:blur={(e) => {
					inputIsFocused = false;
					arrowSelectedIdx = -1;
				}}
				on:keydown={(e) => {
					const n = displayedLb.length;
					if (e.key === "ArrowDown") {
						arrowSelectedIdx = (arrowSelectedIdx + 1) % n;
						e.preventDefault();
					} else if (e.key === "ArrowUp") {
						arrowSelectedIdx = (arrowSelectedIdx + n - 1) % n;
						e.preventDefault();
					} else if (e.key === "Enter") {
						goto(displayedLb[arrowSelectedIdx].href);
					} else if (e.key === "Escape") {
						rawQuery = "";
						searchInput?.blur();
					}
				}}
				placeholder="Search for players"
				class="w-full rounded-lg border border-zinc-800 bg-transparent px-4 py-2 text-zinc-400 placeholder:text-zinc-600 search-cancel:hidden" />
			{#if rawQuery !== ""}
				<button
					on:click={() => {
						rawQuery = "";
						searchInput?.blur();
					}}
					class="absolute inset-y-0 right-2 my-auto h-6 w-6 rounded-full border border-zinc-600 bg-zinc-900">
					<svg
						class="stroke-zinc-500 stroke-2"
						xmlns="http://www.w3.org/2000/svg"
						width="100%"
						height="100%"
						viewBox="0 0 24 24">
						<line x1="6" y1="6" x2="18" y2="18" />
						<line x1="6" y1="18" x2="18" y2="6" />
					</svg>
				</button>
			{:else if !inputIsFocused}
				<kbd
					class="pointer-events-none absolute inset-y-0 right-2 my-auto h-6 w-6 select-none rounded-[4px] border border-zinc-600 bg-zinc-900">
					<svg
						class="stroke-zinc-500 stroke-2"
						xmlns="http://www.w3.org/2000/svg"
						width="100%"
						height="100%"
						viewBox="0 0 24 24">
						<line x1="8" y1="20" x2="16" y2="4" />
					</svg>
				</kbd>
			{/if}
		</div>
	</div>

	{#if lb}
		<ol class="pb-16 pl-2" bind:this={lbContainer}>
			{#each displayedLb as { name, elo, rank, uuid, href }, i (uuid)}
				{@const selected = name === $page.params.player}
				{@const arrowSelected = arrowSelectedIdx === i}
				<li
					class={selected ? "sticky bottom-12 top-20 z-10" : ""}
					animate:flip={{ duration: inputIsFocused ? 0 : 400 }}>
					<a
						{href}
						class="group flex h-8 items-center rounded-l-full border-2 border-r-0 transition-transform duration-300
						{selected
							? `translate-x-1 ${arrowSelected ? 'border-blue-500' : 'border-zinc-700'} bg-zinc-900`
							: `${
									arrowSelected
										? 'border-blue-500 bg-zinc-900/90'
										: 'border-transparent hover:bg-zinc-900/50'
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
							{name}
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
		</ol>
	{:else}
		<div class="mt-32 text-center font-bold text-red-400">Couldn't get leaderboard :/</div>
	{/if}
</div>
