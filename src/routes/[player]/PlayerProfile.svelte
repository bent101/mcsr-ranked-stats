<script lang="ts">
	import { formatTime, getAvatar } from "$lib/utils";
	import type { DetailedPlayer } from "$lib/ranked-api";

	import discord from "$lib/assets/discord.svg";
	import youtube from "$lib/assets/youtube.svg";
	import twitch from "$lib/assets/twitch.svg";
	import { Tooltip } from "@svelte-plugins/tooltips";

	export let playerData: DetailedPlayer;

	let justCopiedDiscord = false;

	const copyDiscord = () => {
		navigator.clipboard.writeText(playerData.connections.discord!.name);
		justCopiedDiscord = true;
		setTimeout(() => {
			justCopiedDiscord = false;
		}, 1200);
	};

	$: numMatches =
		playerData.records[2].win + playerData.records[2].lose + playerData.records[2].draw;

	$: winrate = Math.round((100 * playerData.records[2].win) / numMatches);
</script>

<div class="flex items-center gap-4 px-12 py-2">
	<img
		class="rounded-lg"
		src={getAvatar(playerData.uuid)}
		width="48"
		height="48"
		alt="{playerData.nickname}'s avatar" />
	<div>
		<div class="flex h-12 items-center">
			<h1 class="mr-2 fill-zinc-200 text-3xl font-bold leading-10 text-zinc-300">
				{playerData.nickname}
			</h1>
			{#if playerData.connections.twitch}
				<a
					class="h-10 w-10 p-1 opacity-20 hover:opacity-100"
					href="https://twitch.tv/{playerData.connections.twitch.name}"
					rel="noreferrer"
					target="_blank"><img src={twitch} alt="Twitch logo" /></a>
			{/if}
			{#if playerData.connections.youtube}
				<a
					class="h-10 w-10 p-1 opacity-20 hover:opacity-100"
					rel="noreferrer"
					target="_blank"
					href="https://youtube.com/channel/{playerData.connections.youtube.id}"
					><img src={youtube} alt="Youtube logo" /></a>
			{/if}
			{#if playerData.connections.discord}
				<Tooltip content={justCopiedDiscord ? "Copied!" : "Copy&nbsp;discord"} position="right">
					<button class="h-10 w-10 p-1 opacity-20 hover:opacity-100" on:click={copyDiscord}
						><img src={discord} alt="Discord logo" /></button>
				</Tooltip>
			{:else if playerData.elo_rank === null}
				<Tooltip content={"Needs&nbsp;to&nbsp;link&nbsp;discord"} position="right">
					<span
						class="ml-2 rounded-full bg-zinc-700 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-zinc-300">
						Unverified
					</span>
				</Tooltip>
			{/if}
		</div>
		<span class="text-lg text-zinc-500">
			{#if playerData.elo_rate === -1}
				Doing placements
			{:else}
				<b>{playerData.elo_rate}</b> elo
			{/if}
			{#if playerData.elo_rank}
				(#<b>{playerData.elo_rank}</b>)
			{/if}
			{#if winrate !== -1 && !isNaN(winrate)}
				<span class="inline-block">
					<span class="px-1 font-extrabold text-zinc-600">•</span>
					<b>{winrate}</b>% winrate
				</span>
			{/if}
			{#if playerData.best_record_time !== 0}
				<span class="px-1 font-extrabold text-zinc-600">•</span>
				<b>{formatTime(playerData.best_record_time)}</b> ranked pb
			{/if}
		</span>
	</div>
</div>

<style lang="postcss">
	b {
		@apply font-bold;
	}
</style>
