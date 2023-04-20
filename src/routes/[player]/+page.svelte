<script lang="ts">
	import { getAvatar, formatTime, getMatches } from "$lib/utils.js";
	import { page } from "$app/stores";
	import discord from "$lib/assets/discord.svg";
	import youtube from "$lib/assets/youtube.svg";
	import twitch from "$lib/assets/twitch.svg";
	import { Tooltip } from "@svelte-plugins/tooltips";
	import { afterNavigate } from "$app/navigation";
	import { svg_element } from "svelte/internal";

	export let data;
	let curPage = 1;
	let noMoreMatches = true;
	let justCopiedDiscord = false;
	let matchesContainer: Element;

	const getNumMatches = () => {
		return (data.playerData.records[2].win +
			data.playerData.records[2].lose +
			data.playerData.records[2].draw) as number;
	};

	let numMatches = getNumMatches();

	const getWinrate = () => {
		return Math.round((100 * data.playerData.records[2].win) / numMatches);
	};

	let winrate = getWinrate();

	afterNavigate(() => {
		matchesContainer.scrollTop = 0;
		numMatches = getNumMatches();
		winrate = getWinrate();
		curPage = 1;
		noMoreMatches = data?.recentMatches?.length < 20;
	});

	const addMoreMatches = async () => {
		if (noMoreMatches) return;
		const matches = await getMatches($page.params.player, curPage++);
		data.recentMatches = [...data.recentMatches, ...matches];
		if (matches.length < 20) noMoreMatches = true;
	};

	const copyDiscord = () => {
		navigator.clipboard.writeText(data.playerData.connections.discord.name);
		justCopiedDiscord = true;
		setTimeout(() => {
			justCopiedDiscord = false;
		}, 1200);
	};
</script>

<svelte:head>
	<title>{data.playerData.nickname}'s stats</title>
</svelte:head>

<div bind:this={matchesContainer} class="max-h-full overflow-y-scroll overscroll-y-contain">
	<div class="sticky top-0 z-10 flex items-center gap-4 bg-zinc-900/70 px-12 py-2 backdrop-blur-md">
		<img
			class="rounded-lg"
			src={getAvatar(data.playerData.uuid)}
			width="48"
			height="48"
			alt="{data.playerData.nickname}'s avatar" />
		<div>
			<div class="flex items-center gap-2">
				<h1 class="text-3xl font-bold leading-10 text-zinc-300">{data.playerData.nickname}</h1>
				<div class="flex items-center">
					{#if data.playerData.connections.twitch}
						<a
							class="h-10 w-10 p-1 opacity-20 hover:opacity-100"
							href="https://twitch.tv/{data.playerData.connections.twitch.name}"
							rel="noreferrer"
							target="_blank"><img src={twitch} alt="Twitch logo" /></a>
					{/if}
					{#if data.playerData.connections.youtube}
						<a
							class="h-10 w-10 p-1 opacity-20 hover:opacity-100"
							rel="noreferrer"
							target="_blank"
							href="https://youtube.com/channel/{data.playerData.connections.youtube.id}"
							><img src={youtube} alt="Youtube logo" /></a>
					{/if}
					{#if data.playerData.connections.discord}
						<Tooltip content={justCopiedDiscord ? "Copied!" : "Copy&nbsp;discord"} position="right">
							<button class="h-10 w-10 p-1 opacity-20 hover:opacity-100" on:click={copyDiscord}
								><img src={discord} alt="Discord logo" /></button>
						</Tooltip>
					{:else if data.playerData.elo_rank === null}
						<Tooltip content={"Needs&nbsp;to&nbsp;link&nbsp;discord"} position="right">
							<span
								class="ml-2 rounded-full bg-zinc-700 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-zinc-300">
								Unverified
							</span>
						</Tooltip>
					{/if}
				</div>
			</div>
			<span class="text-lg text-zinc-500">
				{#if data.playerData.elo_rate === -1}
					Doing placements
				{:else}
					<b>{data.playerData.elo_rate}</b> elo
				{/if}
				{#if data.playerData.elo_rank}
					(#<b>{data.playerData.elo_rank}</b>)
				{/if}
				{#if winrate !== -1 && !isNaN(winrate)}
					<span class="px-1 font-extrabold text-zinc-600">•</span>
					<b>{winrate}</b>% winrate
				{/if}
				{#if data.playerData.best_record_time !== 0}
					<span class="px-1 font-extrabold text-zinc-600">•</span>
					<b>{formatTime(data.playerData.best_record_time)}</b> ranked pb
				{/if}
			</span>
		</div>
	</div>
	<div class="m-4 flex w-max flex-col items-center p-4">
		<h2
			class="mx-4 mb-2 mt-0 w-full border-b-2 border-zinc-800 px-4 pb-2 font-bold uppercase text-zinc-400">
			Matches <span
				class="ml-2 rounded-full bg-zinc-400 px-2 py-0.5 text-sm font-bold text-zinc-900"
				>{numMatches}</span>
		</h2>
		<ol class="">
			{#each data.recentMatches as { isDecay, opponent, outcome, forfeit, time, eloChange, eloAfter }}
				<li class="group flex items-center gap-2 rounded-lg px-4 py-1.5 hocus-within:bg-zinc-800">
					{#if isDecay}
						<div class="w-64 text-sm font-bold uppercase text-zinc-500">
							Elo decay (due to inactivity)
						</div>
						<div class="w-24 text-sm font-bold uppercase text-red-400">
							{eloChange >= 0 ? "+" : ""}{eloChange} elo
						</div>
					{:else}
						<div class="w-64 text-zinc-300">
							<a href="/{opponent}" class="hover:underline hover:underline-offset-4">{opponent}</a>
						</div>
						<div
							class="w-24 uppercase {outcome === 'draw'
								? 'text-blue-400'
								: outcome === 'won'
								? 'text-green-400'
								: 'text-red-400'} text-sm font-bold">
							{outcome}
							<span class="invisible ml-1 opacity-30 group-hocus-within:visible"
								>{eloChange >= 0 ? "+" : ""}{eloChange}</span>
						</div>
						{#if outcome !== "draw"}
							<div
								class="w-16 font-semibold uppercase tracking-wider {forfeit
									? 'text-sm font-bold text-zinc-600'
									: ''}">
								{forfeit ? "forfeit" : time}
							</div>
						{/if}
					{/if}
				</li>
			{/each}
		</ol>
		{#if !noMoreMatches}
			<button
				class="m-2 rounded-full px-4 py-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
				on:click={addMoreMatches}>Show more</button>
		{:else if curPage > 1}
			<div class="m-2 px-4 py-2 text-zinc-500">No more to show</div>
		{/if}
	</div>
</div>

<style>
	b {
		@apply font-bold;
	}
</style>
