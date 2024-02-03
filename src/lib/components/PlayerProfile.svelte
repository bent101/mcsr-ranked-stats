<script lang="ts">
	import { formatTime, getRank } from "$lib/formatters";
	import type { DetailedPlayer } from "$lib/ranked-api";

	import diamond from "$lib/assets/diamond.webp";
	import discordLogo from "$lib/assets/discord.svg";
	import fire from "$lib/assets/fire.png";
	import info from "$lib/assets/info.png";
	import iron from "$lib/assets/iron.webp";
	import stone from "$lib/assets/stone.webp";
	import twitch from "$lib/assets/twitch.svg";
	import youtube from "$lib/assets/youtube.svg";

	import PlayerHead3D from "./PlayerHead3D.svelte";
	import Tooltip from "./Tooltip.svelte";
	import MoreStats from "./MoreStats.svelte";

	export let playerData: DetailedPlayer;
	/**
	 * position on the compare page (it affects head rotation/position)
	 */
	export let pos: "first" | "second" | null = null;
	export let color = "text-white";
	export let rotation = { x: -12, y: 20 };
	export let isLink = false;
	export let showAllStatsBtn = false;
	export let isHeader = false;

	$: numWins = playerData.records[2].win;
	$: numLosses = playerData.records[2].lose;
	$: numDraws = playerData.records[2].draw;

	$: numMatches = numWins + numLosses + numDraws;

	$: winrate = Math.round((100 * numWins) / (numWins + numLosses));

	let justCopiedDiscord = false;

	let roleType: Element | undefined;
	let discord: Element | undefined;
	let unverified: Element | undefined;

	const copyDiscord = () => {
		navigator.clipboard.writeText(playerData.connections.discord!.name);
		justCopiedDiscord = true;
		setTimeout(() => {
			justCopiedDiscord = false;
		}, 2000);
	};

	$: rank = getRank(playerData.elo_rate);

	let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<div
	class="flex w-max flex-row items-center gap-2 px-4 py-2
	{pos === 'first' ? 'lg:flex-row-reverse' : ''}">
	<div class="pb-2">
		{#key scrollY}
			<PlayerHead3D {isHeader} {rotation} uuid={playerData.uuid} />
		{/key}
	</div>
	<div class="pl-2">
		<div class="flex h-8 items-center">
			<div class="mr-2 text-xl font-bold opacity-80 {color}">
				{#if playerData.elo_rank}
					<span class="mr-2 font-extrabold text-white/30">#{playerData.elo_rank}</span>
				{/if}
				{#if isLink}
					<a href="/{playerData.nickname}" class="underline-offset-4 hover:underline">
						{playerData.nickname}
					</a>
				{:else}
					<h1 class="inline">
						{playerData.nickname}
					</h1>
				{/if}
			</div>
			{#if playerData.roleType}
				<a
					bind:this={roleType}
					href="https://www.patreon.com/mcsrranked"
					rel="noreferrer"
					class="relative right-2 grid place-items-center"
					target="_blank">
					<div
						class="glow-{playerData.roleType} pointer-events-none absolute -inset-12 bg-gradient-radial" />
					<div
						class="glow-{playerData.roleType} pointer-events-none absolute -inset-48 bg-gradient-radial opacity-50" />
					<img
						class="h-full w-8"
						style="image-rendering: pixelated;"
						src={[stone, iron, diamond][playerData.roleType - 1]}
						alt="" />
				</a>
				<Tooltip anchor={roleType} directionPreference={["top", "bottom", "right", "left"]}>
					<div>
						Tier {playerData.roleType} patreon :D
					</div>
					<div class="text-xs text-zinc-600">Click to learn more</div>
				</Tooltip>
			{/if}
			{#if playerData.connections.twitch}
				<a
					class="h-full w-8 p-1 opacity-20 hover:opacity-100"
					href="https://twitch.tv/{playerData.connections.twitch.name}"
					rel="noreferrer"
					target="_blank"><img src={twitch} alt="Twitch logo" /></a>
			{/if}
			{#if playerData.connections.youtube}
				<a
					class="h-full w-8 p-1 opacity-20 hover:opacity-100"
					rel="noreferrer"
					target="_blank"
					href="https://youtube.com/channel/{playerData.connections.youtube.id}"
					><img src={youtube} alt="Youtube logo" /></a>
			{/if}
			{#if playerData.connections.discord}
				<button
					bind:this={discord}
					class="h-full w-8 p-1 opacity-20 hover:opacity-100"
					on:click|preventDefault={copyDiscord}
					><img src={discordLogo} alt="Discord logo" /></button>
				<Tooltip anchor={discord}>
					{justCopiedDiscord ? "Copied!" : "Copy Discord"}
				</Tooltip>
			{:else if playerData.elo_rank === null}
				<span
					bind:this={unverified}
					class="ml-2 inline-flex items-center gap-2 rounded-full bg-zinc-700 py-0.5 pl-3 pr-1 text-sm font-semibold uppercase tracking-wide text-white/90">
					Unverified
					<img src={info} alt="" class="inline h-4 w-4 select-none opacity-30 invert" />
				</span>
				<Tooltip anchor={unverified}>Needs to link Discord</Tooltip>
			{/if}
		</div>
		<div class="text-white/50">
			{#if playerData.elo_rate === -1}
				<b>Doing placements</b>
			{:else}
				<span class="bg-gradient-to-r bg-clip-text font-extrabold text-transparent {rank.color}"
					>{rank.name}</span>
				(<span class="bg-gradient-to-r bg-clip-text font-extrabold text-transparent {rank.color}"
					>{playerData.elo_rate}</span>
				elo)
				{#if playerData.best_elo_rate > playerData.elo_rate}
					<span class="inline-block h-[1.53125rem] font-extrabold text-white/30">•</span>
					<b>{playerData.best_elo_rate}</b> peak elo
				{:else}
					<span
						class="ml-2 inline-block -translate-y-0.5 rounded-full bg-gradient-to-r from-red-700 to-orange-500 py-px pl-1 pr-2 text-xs font-semibold tracking-wide text-white">
						<img class="inline w-4 -translate-y-[0.04375rem]" src={fire} alt="" />
						<span class="inline-block translate-y-px">PEAK ELO</span>
					</span>
				{/if}
			{/if}
		</div>
		<div class="text-white/50">
			{#if winrate !== -1 && !isNaN(winrate)}
				<b>{winrate}</b>% winrate
				<span class="font-extrabold text-white/30">•</span>
			{/if}
			{#if playerData.best_record_time !== 0}
				<b>{formatTime(playerData.best_record_time)}</b> pb
				<span class="font-extrabold text-white/30">•</span>
			{/if}
			<b>{playerData.highest_winstreak}</b> best winstreak
		</div>
		{#if showAllStatsBtn && numMatches > 0}
			{#key playerData.uuid}
				<MoreStats {playerData} {numMatches} />
			{/key}
		{/if}
	</div>
</div>

<style lang="postcss">
	b {
		@apply font-bold text-white/70;
	}

	.glow-1 {
		@apply from-white/10 via-transparent to-transparent;
	}
	.glow-2 {
		@apply from-sky-200/20 via-transparent to-transparent;
	}
	.glow-3 {
		@apply from-sky-500/20 via-transparent to-transparent;
	}
</style>
