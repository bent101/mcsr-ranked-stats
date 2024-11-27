<script lang="ts">
  import { formatTimeAgoShort, type FormattedMatch } from "$lib/formatters";
  import { cn } from "$lib/utils";
  import PlayerLink from "./PlayerLink.svelte";
  import TableRow from "./TableRow.svelte";
  import { curDate } from "$lib/globals";

  export let match: FormattedMatch;

  $: href = match.isDecay
    ? undefined
    : `/stats/${match.curPlayerName}/${match.id}`;
</script>

<TableRow {href} let:state>
  {#if match.isDecay}
    <div class="flex-1 italic text-zinc-500">Elo decay</div>
    <div class="w-20 text-center text-sm font-bold uppercase text-red-400">
      {match.eloChange >= 0 ? "+" : ""}{match.eloChange} elo
    </div>
    <div class="w-20" />
    <div class="w-10 text-right text-zinc-600">
      {formatTimeAgoShort($curDate - match.date)}
    </div>
  {:else}
    <div class="flex-1 overflow-hidden truncate text-zinc-300">
      <PlayerLink name={match.opponentName} />
    </div>
    <div
      class={cn(
        "w-20 text-center text-sm font-bold uppercase",
        match.outcomeColor,
      )}
    >
      <span
        class={cn(
          state === "selected" ? "hidden" : "inline group-hover:hidden",
        )}
      >
        {match.outcome}
      </span>
      <span
        class={cn(
          state === "selected" ? "inline" : "hidden group-hover:inline",
        )}
      >
        {match.eloChange >= 0 ? "+" : ""}{match.eloChange} elo
      </span>
    </div>
    <div
      class={cn(
        "w-20 text-center",
        match.forfeited
          ? "text-xs font-semibold uppercase tracking-normal"
          : "font-extrabold tracking-wider",
        state === "selected"
          ? "text-zinc-300"
          : match.forfeited || match.outcome === "lost"
            ? "text-zinc-600"
            : "text-zinc-400",
      )}
    >
      {match.outcome === "draw" ? "" : match.forfeited ? "Forfeit" : match.time}
    </div>
    <div
      class={cn(
        "w-10 text-right",
        state === "selected" ? "text-zinc-300" : "text-zinc-600",
      )}
    >
      {formatTimeAgoShort($curDate - match.date)}
    </div>
  {/if}
</TableRow>
