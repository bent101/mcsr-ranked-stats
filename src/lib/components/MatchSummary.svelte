<script lang="ts">
  import {
    formatTime,
    formatRelativeTime,
    type FormattedDetailedMatch,
  } from "$lib/formatters";
  import { curDate } from "$lib/globals";
  import Badge from "./Badge.svelte";

  export let match: FormattedDetailedMatch;
</script>

<div class="flex items-center gap-1.5">
  <p class="font-bold text-zinc-300">
    {#if match.outcome === "draw"}
      Draw
    {:else if match.outcome === "won" || match.outcome === undefined}
      {match.forfeit ? "Win" : formatTime(match.time)}
    {:else if match.outcome === "lost"}
      {match.forfeit ? "Forfeit" : "Loss"}
    {/if}
    <span class=" text-zinc-600">•</span>
    <span class="text-zinc-500">
      {formatRelativeTime($curDate - match.date)}
    </span>
  </p>
  <Badge>{match.seedType}</Badge>
  {#if match.bastionType}
    <Badge>{match.bastionType} bastion</Badge>
  {/if}
</div>
