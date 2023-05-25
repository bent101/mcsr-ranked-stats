<script lang="ts">
	import { formatTime, getAvatar } from "$lib/utils";
	import type { DetailedPlayer } from "$lib/ranked-api";

	import discord from "$lib/assets/discord.svg";
	import youtube from "$lib/assets/youtube.svg";
	import twitch from "$lib/assets/twitch.svg";
	import fire from "$lib/assets/fire.png";
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

	const getRank = (elo: number) => {
		const word = ["Coal", "Iron", "Gold", "Diamond"][Math.floor(elo / 600)];
		const color = [
			"from-gray-700 to-gray-500",
			"from-zinc-500 to-zinc-200",
			"from-yellow-300 to-yellow-600",
			"from-sky-300 to-blue-500",
		][Math.floor(elo / 600)];
		const number = 1 + (Math.floor(elo / 200) % 3);
		const name = `${word} ${"I".repeat(number)}`;

		return {
			name,
			color,
		};
	};

	$: rank = getRank(playerData.elo_rate);
</script>

<div class="flex w-max items-start gap-2 px-4 py-2">
	<img
		class="m-2 rounded-lg"
		src={getAvatar(playerData.uuid)}
		width="48"
		height="48"
		alt="{playerData.nickname}'s avatar" />
	<div>
		<div class="flex items-center">
			<h1 class="mr-2 fill-zinc-200 text-xl font-bold text-zinc-300">
				{#if playerData.elo_rank}
					<span class="mr-2 font-extrabold text-zinc-600">#{playerData.elo_rank}</span>
				{/if}{playerData.nickname}
			</h1>
			{#if playerData.connections.twitch}
				<a
					class="h-8 w-8 p-1 opacity-20 hover:opacity-100"
					href="https://twitch.tv/{playerData.connections.twitch.name}"
					rel="noreferrer"
					target="_blank"><img src={twitch} alt="Twitch logo" /></a>
			{/if}
			{#if playerData.connections.youtube}
				<a
					class="h-8 w-8 p-1 opacity-20 hover:opacity-100"
					rel="noreferrer"
					target="_blank"
					href="https://youtube.com/channel/{playerData.connections.youtube.id}"
					><img src={youtube} alt="Youtube logo" /></a>
			{/if}
			{#if playerData.connections.discord}
				<Tooltip content={justCopiedDiscord ? "Copied!" : "Copy&nbsp;discord"} position="right">
					<button class="h-8 w-8 p-1 opacity-20 hover:opacity-100" on:click={copyDiscord}
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
		<div class="text-zinc-500">
			{#if playerData.elo_rate === -1}
				Doing placements
			{:else}
				<b class="bg-gradient-to-r bg-clip-text font-extrabold text-transparent {rank.color}"
					>{rank.name}</b>
				(<span class="bg-gradient-to-r bg-clip-text font-extrabold text-transparent {rank.color}"
					>{playerData.elo_rate}</span> elo)
			{/if}
			{#if playerData.best_elo_rate > playerData.elo_rate}
				<span class="font-extrabold text-zinc-600">•</span>
				<b>{playerData.best_elo_rate}</b> peak elo
			{:else}
				<span
					class="ml-2 inline-block -translate-y-0.5 items-center rounded-full bg-gradient-to-r from-red-700 to-orange-500 py-0.5 pl-1 pr-2 text-xs font-semibold uppercase tracking-wide text-white">
					<img class="inline w-4" src={fire} alt="" />
					<span class="inline-block translate-y-px">peak elo</span>
				</span>
			{/if}
		</div>
		<div class="text-zinc-500">
			{#if winrate !== -1 && !isNaN(winrate)}
				<b>{winrate}</b>% winrate
			{/if}
			{#if playerData.best_record_time !== 0}
				<span class="font-extrabold text-zinc-600">•</span>
				<b>{formatTime(playerData.best_record_time)}</b> ranked pb
			{/if}
			{#if playerData.highest_winstreak > 1}
				<span class="font-extrabold text-zinc-600">•</span>
				<b>{playerData.highest_winstreak}</b> best winstreak
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	b {
		@apply font-bold;
	}
</style>
