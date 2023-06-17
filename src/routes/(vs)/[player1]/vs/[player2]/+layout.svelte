<script lang="ts">
	import CompareTableRow from "$lib/components/CompareTableRow.svelte";
	import PlayerProfile from "$lib/components/PlayerProfile.svelte";
	import RefreshBtn from "$lib/components/RefreshBtn.svelte";
	import { isLgScreen } from "$lib/globals.js";
	import { createLocalStorageStore } from "$lib/utils.js";
	import { onMount } from "svelte";

	export let data;

	$: numMatches = data.wins.total;
	$: player1Wins = data.wins[data.player1.uuid];
	$: player2Wins = data.wins[data.player2.uuid];
	$: numDraws = numMatches - player1Wins - player2Wins;

	$: player1WinPercent = Math.round((100 * player1Wins) / numMatches);
	$: player2WinPercent = Math.round((100 * player2Wins) / numMatches);

	const recentVs = createLocalStorageStore("recentVs", [
		{ player1: data.player1.nickname, player2: data.player2.nickname },
	]);

	onMount(() => {
		updateRecentVs();
	});

	function updateRecentVs() {
		const i = $recentVs.findIndex(
			({ player1, player2 }) =>
				(player1 === data.player1.nickname && player2 === data.player2.nickname) ||
				(player1 === data.player2.nickname && player2 === data.player1.nickname)
		);

		if (i === -1) {
			$recentVs = [
				{ player1: data.player1.nickname, player2: data.player2.nickname },
				...$recentVs,
			];
			$recentVs = $recentVs.splice(0, 6);
		} else {
			[$recentVs[i], $recentVs[0]] = [$recentVs[0], $recentVs[i]];
		}
	}

	const left = { x: -12, y: -40 };
	const right = { x: -12, y: 40 };
	const up = { x: 30, y: 0 };
	const down = { x: -30, y: 0 };
</script>

<div class="hidden h-8 xl:block" />
<div class="sticky top-0 z-10 bg-zinc-900/70 backdrop-blur-md">
	<div class="mx-auto max-w-max lg:ml-0 lg:max-w-5xl">
		<div class="flex flex-col justify-center lg:flex-row">
			<div class="flex-1">
				<div class="ml-auto max-w-max">
					<PlayerProfile
						headToRight={$isLgScreen}
						rotation={$isLgScreen ? right : down}
						color="text-orange-400"
						playerData={data.player1} />
				</div>
			</div>
			<div class="m-1 flex h-8 items-center gap-1 lg:h-auto lg:flex-col">
				<div class="flex-1 border border-zinc-600" />
				<div class="text-xs font-bold text-zinc-600">VS</div>
				<div class="flex-1 border border-zinc-600" />
			</div>
			<div class="flex-1">
				<PlayerProfile
					rotation={$isLgScreen ? left : up}
					color="text-yellow-400"
					playerData={data.player2} />
			</div>
		</div>
		{#if numMatches > 0}
			<div class="flex items-center justify-center gap-4 py-4 text-5xl font-bold">
				<div class="flex-1 text-right text-orange-400">
					{player1Wins}
					<div class="text-xs">{player1WinPercent}%</div>
				</div>
				<div class="text-center uppercase text-zinc-600">
					{numDraws > 0 ? `- ${numDraws} -` : `-`}
					<div class="text-xs">{@html numDraws === 0 ? "&nbsp;" : 1 ? "draw" : "draws"}</div>
				</div>
				<div class="flex-1 text-yellow-400">
					{player2Wins}
					<div class="text-xs">{player2WinPercent}%</div>
				</div>
			</div>
		{:else}
			<div class="mt-40 p-8 pt-16 text-xl font-semibold text-zinc-500">
				<span class="text-zinc-300">{data.player1.nickname}</span>
				and
				<span class="text-zinc-300">{data.player2.nickname}</span>
				haven't had any matches together yet this season

				<div class="mt-16">
					<a
						href="/vs"
						class="ml-auto block w-max rounded-full py-3 pl-4 pr-6 hover:bg-zinc-700/50 hover:text-zinc-300"
						>←&nbsp;&nbsp;&nbsp;Go back</a>
				</div>
			</div>
		{/if}
	</div>
</div>

{#if numMatches > 0}
	<div class="mx-auto max-w-sm pb-16 md:ml-16">
		<div class="mb-2 flex items-center border-b-2 border-zinc-800 p-4 pb-1 pl-4">
			<h2 class="text-sm font-bold uppercase text-zinc-400">Matches</h2>
			<div class="ml-2 rounded-full bg-zinc-400 px-2 py-0.5 text-xs font-extrabold text-zinc-900">
				{numMatches}
			</div>
			<div class="ml-auto"><RefreshBtn /></div>
		</div>

		<div class="text-xs font-bold uppercase tracking-wide text-zinc-600">
			<div class="flex px-4 py-2">
				<div class="flex-1">WINNER</div>
				<div class="w-24 text-center">ELO CHANGE</div>
				<div class="w-20 text-center">TIME</div>
				<div class="w-10 text-right">DATE</div>
			</div>
		</div>

		{#each data.matches as match}
			<CompareTableRow {match} player1UUID={data.player1.uuid} player2UUID={data.player2.uuid} />
		{/each}
	</div>

	<div class="pointer-events-none fixed bottom-0 left-0 right-0">
		<div
			class="pointer-events-auto relative mx-auto min-h-[6rem] w-[35rem] rounded-t-3xl bg-zinc-800 shadow-lg shadow-black/30 md:mr-4 2xl:ml-[52rem] 2xl:w-[43rem] 3xl:w-[52rem]">
			<slot />
		</div>
	</div>
{/if}
