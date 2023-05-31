<script lang="ts">
	import { page } from "$app/stores";
	import PlayerLink from "./PlayerLink.svelte";
	import TableRow from "./TableRow.svelte";
	import type { FormattedMatch } from "./utils";
	export let match: FormattedMatch;

	const href = match.isDecay ? undefined : `/${match.curPlayerName}/${match.id}`;
	$: selected = $page.url.pathname === href;
</script>

<TableRow {selected} {href}>
	{#if match.isDecay}
		<div class="flex-1 italic text-zinc-500">Elo decay</div>
		<div class="w-28 text-center text-sm font-bold uppercase text-red-400">
			{match.eloChange >= 0 ? "+" : ""}{match.eloChange} elo
		</div>
		<div class="w-20" />
		<div class="w-10 text-right text-zinc-600">{match.date}</div>
	{:else}
		<div class="flex-1 text-zinc-300">
			<PlayerLink name={match.opponentName} uuid={match.opponentUUID} />
		</div>
		<div class="w-28 text-center uppercase {match.outcomeColor} text-sm font-bold">
			<span class="{selected ? ' hidden' : 'inline group-hover:hidden'} ">{match.outcome}</span>
			<span class={selected ? " inline" : "hidden group-hover:inline"}
				>{match.eloChange >= 0 ? "+" : ""}{match.eloChange} elo</span>
		</div>
		<div
			class="w-20 text-center font-extrabold tracking-wider {match.forfeit
				? `text-xs font-semibold uppercase tracking-normal ${
						selected ? 'text-zinc-300' : 'text-zinc-600'
				  }`
				: ''} {selected
				? 'text-zinc-300'
				: match.outcome === 'won'
				? 'text-zinc-400'
				: 'text-zinc-600'} ">
			{match.outcome === "draw" ? "" : match.forfeit ? "Forfeit" : match.time}
		</div>
		<div class="w-10 text-right {selected ? 'text-zinc-300' : 'text-zinc-600'}">
			{match.date}
		</div>
	{/if}
</TableRow>
