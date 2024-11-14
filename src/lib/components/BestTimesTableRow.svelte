<script lang="ts">
  import {
    formatTimeAgoShort,
    type formatRecordLeaderboard,
  } from "$lib/formatters";
  import { curDate } from "$lib/globals";
  import { cn } from "$lib/utils";
  import PlayerLink from "./PlayerLink.svelte";
  import TableRow from "./TableRow.svelte";

  export let match: ReturnType<typeof formatRecordLeaderboard>[number];
  export let place: number;

  $: href = `/stats/lb/${match.id}`;
</script>

<TableRow {href} let:state>
  <div
    class={cn(
      "mr-4 w-4 text-right font-extrabold",
      state === "selected" ? "text-zinc-300" : "text-zinc-600",
    )}
  >
    {place}
  </div>
  <div class="flex-1 text-center text-zinc-300">
    <PlayerLink name={match.playerName} />
  </div>
  <div
    class={cn(
      "w-20 text-right font-extrabold tabular-nums tracking-wide",
      state === "selected" ? "text-zinc-300" : "text-zinc-400",
    )}
  >
    {match.time}
  </div>
  <div
    class={cn(
      "w-10 text-right",
      state === "selected" ? "text-zinc-300" : "text-zinc-600",
    )}
  >
    {formatTimeAgoShort($curDate - match.date)}
  </div>
</TableRow>
