<script lang="ts">
  import { formatTimeWithPrecision } from "$lib/formatters";
  import type { WeeklyRace } from "$lib/ranked-api";
  import PlayerLink from "./PlayerLink.svelte";
  import TableRow from "./TableRow.svelte";

  export let run: WeeklyRace["leaderboard"][number];

  const { mainTime, decimal } = formatTimeWithPrecision(run.time, {
    precision: 2,
  });
</script>

<TableRow let:state href={`/stats/weekly-race/${run.player.uuid}`}>
  <div
    class="mr-4 w-4 text-right font-extrabold {state === 'selected'
      ? 'text-zinc-300'
      : 'text-zinc-600'}"
  >
    {run.rank}
  </div>
  <div class="flex-1 truncate text-center text-zinc-300">
    <PlayerLink name={run.player.nickname} />
  </div>
  <div
    class="w-20 text-right font-extrabold tabular-nums
             {state === 'selected' ? 'text-zinc-300' : 'text-zinc-400'}"
  >
    {mainTime}<span
      class={state === "selected" ? "text-zinc-500" : "text-zinc-600"}
      >.{decimal}</span
    >
  </div>
  <!-- <div
    class="w-10 text-right {state === 'selected'
      ? 'text-zinc-300'
      : 'text-zinc-600'}"
  >
    {formatTimeAgoShort($curDate - run.date)}
  </div> -->
</TableRow>
