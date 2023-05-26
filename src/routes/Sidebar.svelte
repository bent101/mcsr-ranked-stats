<script lang="ts">
	import { afterNavigate, goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { derived } from "svelte/store";
	import type { PlayerInfo } from "$lib/ranked-api";
	import Leaderboard from "./Leaderboard.svelte";
	import SidebarTab from "./SidebarTab.svelte";
	import stopwatch from "$lib/assets/stopwatch.png";

	const bestTimesSelected = derived(page, (page) => $page.url.pathname === "/best-times");
	const compareSelected = derived(page, (page) => $page.url.pathname === "/vs");

	export let lb: PlayerInfo[] | undefined;
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

	$: cleanedLb = filteredLb.map((player) => ({
		name: player.nickname,
		href: `/${player.nickname}`,
		elo: player.elo_rate.toString(),
		rank: player.elo_rank?.toString() ?? "??",
		uuid: player.uuid,
	}));

	$: extraOption = {
		name: `"${rawQuery}"`,
		href: `/${rawQuery}`,
		elo: "????",
		rank: "??",
		uuid: "extra",
	};

	$: lbWithExtra = isExtra ? [...cleanedLb, extraOption] : cleanedLb;

	$: displayedLb = lbWithExtra.map((player, i) => ({
		...player,
		selected: player.name === $page.params.player,
		arrowSelected: arrowSelectedIdx === i,
	}));

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

	<div class="pb-16 pl-2">
		<SidebarTab href={"/best-times"} selected={$bestTimesSelected}>
			<div class="flex items-center pr-8">
				<img
					src={stopwatch}
					alt=""
					class="h-5 w-20 select-none object-contain {$bestTimesSelected
						? 'opacity-80'
						: 'opacity-30'} invert" />
				<div
					class="font-extrabold uppercase {$bestTimesSelected
						? 'text-zinc-300'
						: 'text-zinc-500 group-hover:text-zinc-400'}">
					Fastest times
				</div>
			</div>
		</SidebarTab>
		<SidebarTab href={"/vs"} selected={$compareSelected}>
			<div class="flex items-center pr-8">
				<div
					class="w-20 select-none text-center text-xs font-extrabold leading-3 text-white {$compareSelected
						? 'opacity-80'
						: 'opacity-30'}">
					VS
				</div>
				<div
					class="font-extrabold uppercase {$compareSelected
						? 'text-zinc-300'
						: 'text-zinc-500 group-hover:text-zinc-400'}">
					Compare players
				</div>
			</div>
		</SidebarTab>

		<hr class="my-2 ml-2 mr-6 border-zinc-800" />

		{#if lb}
			<Leaderboard lb={displayedLb} animating={!inputIsFocused} />
		{:else}
			<div class="mt-32 text-center font-bold text-red-400">Couldn't get leaderboard :/</div>
		{/if}
	</div>
</div>
