<script lang="ts">
  import { formatTimeAgoShort, type FormattedMatch } from "$lib/formatters";
  import PlayerLink from "./PlayerLink.svelte";
  import TableRow from "./TableRow.svelte";

  export let match: FormattedMatch;
  export let curDate: number;

  $: href = match.isDecay ? undefined : `/${match.curPlayerName}/${match.id}`;
</script>

<TableRow {href} let:state>
  {#if match.isDecay}
    <div class="flex-1 italic text-zinc-500">Elo decay</div>
    <div class="w-28 text-center text-sm font-bold uppercase text-red-400">
      {match.eloChange >= 0 ? "+" : ""}{match.eloChange} elo
    </div>
    <div class="w-20" />
    <div class="w-10 text-right text-zinc-600">
      {formatTimeAgoShort(curDate - match.date)}
    </div>
  {:else}
    <div class="flex-1 text-zinc-300">
      <PlayerLink name={match.opponentName} uuid={match.opponentUUID} />
    </div>
    <div
      class="w-28 text-center uppercase {match.outcomeColor} text-sm font-bold"
    >
      <span
        class="{state === 'selected'
          ? ' hidden'
          : 'inline hover-hover:group-hover:hidden'} "
      >
        {match.outcome}
      </span>
      <span
        class={state === "selected"
          ? " inline"
          : "hidden hover-hover:group-hover:inline"}
      >
        {match.eloChange >= 0 ? "+" : ""}{match.eloChange} elo
      </span>
    </div>
    <div
      class="w-20 text-center font-extrabold tracking-wider {match.forfeited
        ? `text-xs font-semibold uppercase tracking-normal ${
            state === 'selected' ? 'text-zinc-300' : 'text-zinc-600'
          }`
        : ''} {state === 'selected'
        ? 'text-zinc-300'
        : match.outcome === 'won'
        ? 'text-zinc-400'
        : 'text-zinc-600'} "
    >
      {match.outcome === "draw" ? "" : match.forfeited ? "Forfeit" : match.time}
    </div>
    <div
      class="w-10 text-right {state === 'selected'
        ? 'text-zinc-300'
        : 'text-zinc-600'}"
    >
      {formatTimeAgoShort(curDate - match.date)}
    </div>
  {/if}
</TableRow>
