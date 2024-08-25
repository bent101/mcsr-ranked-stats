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
	import { sum } from "$lib/utils";

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

	$: numWins = playerData.statistics.season.wins.ranked;
	$: numLosses = playerData.statistics.season.loses.ranked;
	$: numMatches = playerData.statistics.season.playedMatches.ranked;
	$: numForfeits = playerData.statistics.season.forfeits.ranked;
	$: numCompletions = playerData.statistics.season.completions.ranked;

	$: winrate = Math.floor((100 * numWins) / (numWins + numLosses));
	$: bestTime = playerData.statistics.total.bestTime.ranked;
	$: bestWinstreak = playerData.statistics.total.highestWinStreak.ranked;
	$: peakElo = playerData.seasonResult.highest;

	$: avgTime = playerData.statistics.season.completionTime.ranked / numCompletions;
	$: ffRatePercent = (100 * numForfeits) / numMatches;
	$: fmtdFFRate = ffRatePercent < 1 ? ffRatePercent.toFixed(1) : Math.floor(ffRatePercent);
	$: points = sum(playerData.seasonResult.phases.map((phase) => phase.point));

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

	$: rank = getRank(playerData.eloRate);

	let scrollY = 0;
</script>

<svelte:window bind:scrollY />

<div
	class="flex w-max flex-row items-center gap-2 px-4 py-2
	{pos === 'first' ? 'lg:flex-row-reverse' : ''}"
>
	<div class="pb-2">
		{#key scrollY}
			<PlayerHead3D {isHeader} {rotation} uuid={playerData.uuid} />
		{/key}
	</div>
	<div class="pl-2">
		<div class="flex h-8 items-center">
			<div class="mr-2 text-xl font-bold opacity-80 {color}">
				{#if playerData.eloRank}
					<span class="mr-2 font-extrabold text-white/30">#{playerData.eloRank}</span>
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
					target="_blank"
				>
					<div
						class="glow-{playerData.roleType} pointer-events-none absolute -inset-12 bg-gradient-radial"
					/>
					<div
						class="glow-{playerData.roleType} pointer-events-none absolute -inset-48 bg-gradient-radial opacity-50"
					/>
					<img
						class="h-full w-8"
						style="image-rendering: pixelated;"
						src={[stone, iron, diamond][playerData.roleType - 1]}
						alt=""
					/>
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
					target="_blank"><img src={twitch} alt="Twitch logo" /></a
				>
			{/if}
			{#if playerData.connections.youtube}
				<a
					class="h-full w-8 p-1 opacity-20 hover:opacity-100"
					rel="noreferrer"
					target="_blank"
					href="https://youtube.com/channel/{playerData.connections.youtube.id}"
					><img src={youtube} alt="Youtube logo" /></a
				>
			{/if}
			{#if playerData.connections.discord}
				<button
					bind:this={discord}
					class="h-full w-8 p-1 opacity-20 hover:opacity-100"
					on:click|preventDefault={copyDiscord}><img src={discordLogo} alt="Discord logo" /></button
				>
				<Tooltip anchor={discord}>
					{justCopiedDiscord ? "Copied!" : "Copy Discord"}
				</Tooltip>
			{:else if playerData.eloRank === null}
				<span
					bind:this={unverified}
					class="ml-2 inline-flex items-center gap-2 rounded-full bg-zinc-700 py-0.5 pl-3 pr-1 text-sm font-semibold uppercase tracking-wide text-white/90"
				>
					Unverified
					<img src={info} alt="" class="inline h-4 w-4 select-none opacity-30 invert" />
				</span>
				<Tooltip anchor={unverified}>Needs to link Discord</Tooltip>
			{/if}
		</div>
		<div class="text-white/50">
			{#if playerData.eloRate === null}
				<b>Doing placements</b>
			{:else}
				<span class="bg-gradient-to-r bg-clip-text font-extrabold text-transparent {rank.color}"
					>{rank.name}</span
				>
				(<span class="bg-gradient-to-r bg-clip-text font-extrabold text-transparent {rank.color}"
					>{playerData.eloRate}</span
				>
				elo)
				{#if peakElo > playerData.eloRate}
					<span class="inline-block h-[1.53125rem] font-extrabold text-white/30">•</span>
					<b>{peakElo}</b> peak elo
				{:else}
					<span
						class="ml-2 inline-block -translate-y-0.5 rounded-full bg-gradient-to-r from-red-700 to-orange-500 py-px pl-1 pr-2 text-xs font-semibold tracking-wide text-white"
					>
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
			{#if bestTime !== 0}
				<b>{formatTime(bestTime)}</b> pb
				<span class="font-extrabold text-white/30">•</span>
			{/if}
			<b>{bestWinstreak}</b> best winstreak
		</div>
		{#if showAllStatsBtn && numMatches > 0}
			<p class="text-white/50">
				{#if avgTime}
					<b>{formatTime(avgTime)}</b> average
					<span class="font-extrabold text-white/30">•</span>
				{/if}
				<b>{fmtdFFRate}</b>% forfeit rate
				<span class="font-extrabold text-white/30">•</span>
				<b>{points}</b> points
			</p>
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
