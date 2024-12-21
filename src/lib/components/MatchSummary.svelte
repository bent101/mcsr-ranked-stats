<script lang="ts">
  import {
    type FormattedDetailedMatch,
    formatTime,
    formatTimeAgoShort,
  } from "$lib/formatters";
  import { curDate } from "$lib/globals";
  import Badge from "./Badge.svelte";

  export let match: Pick<
    FormattedDetailedMatch,
    | "forfeit"
    | "time"
    | "outcome"
    | "date"
    | "seedType"
    | "bastionType"
    | "rank"
  >;
  export let hideSeasonRank = false;
  export let hideAllTimeRank = false;
</script>

<div class="relative overflow-hidden pb-2">
  <div
    class="relative flex translate-y-1 items-center gap-1.5 overflow-x-scroll pr-4"
  >
    <p class="shrink-0 font-bold text-zinc-300">
      {#if match.outcome === "draw"}
        Draw
      {:else if match.outcome === "won" || match.outcome === undefined}
        {match.forfeit ? "Win" : formatTime(match.time)}
      {:else if match.outcome === "lost"}
        {match.forfeit ? "Forfeit" : "Loss"}
      {/if}
      <span class="text-zinc-600">•</span>
      <span
        class="font-medium text-zinc-500"
        title={new Date(match.date * 1000).toLocaleString()}
      >
        {formatTimeAgoShort($curDate - match.date, { withSuffix: true })}
      </span>
    </p>
    {#if match.seedType}
      <Badge>{match.seedType}</Badge>
    {/if}
    {#if match.bastionType}
      <Badge>{match.bastionType} bastion</Badge>
    {/if}

    {#if match.outcome === "won"}
      {#if match.rank.season !== null && match.rank.season <= 100 && !hideSeasonRank}
        <Badge>#{match.rank.season} season</Badge>
      {/if}
      {#if match.rank.allTime !== null && match.rank.allTime <= 100 && !hideAllTimeRank}
        <Badge>#{match.rank.allTime} all-time</Badge>
      {/if}
    {/if}
  </div>
  <div
    class="pointer-events-none absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-zinc-800 to-transparent"
  />
</div>
