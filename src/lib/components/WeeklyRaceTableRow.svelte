<script lang="ts">
  import { formatTime, formatTimeWithPrecision } from "$lib/formatters";
  import type { WeeklyRaceLeaderboard } from "$lib/ranked-api";
  import PlayerLink from "./PlayerLink.svelte";
  import TableRow from "./TableRow.svelte";

  export let match: WeeklyRaceLeaderboard["leaderboard"][number];

  const { mainTime, decimal } = formatTimeWithPrecision(match.time, {
    precision: 2,
  });
</script>

<TableRow let:state>
  <div
    class="mr-4 w-4 text-right font-extrabold {state === 'selected'
      ? 'text-zinc-300'
      : 'text-zinc-600'}"
  >
    {match.rank}
  </div>
  <div class="flex-1 text-center text-zinc-300">
    <PlayerLink name={match.player.nickname} uuid={match.player.uuid} />
  </div>
  <div
    class="w-20 text-right font-extrabold tracking-wider
             {state === 'selected' ? 'text-zinc-300' : 'text-zinc-400'}"
  >
    {mainTime}<span class="text-zinc-600">.{decimal}</span>
  </div>
  <!-- <div
    class="w-10 text-right {state === 'selected'
      ? 'text-zinc-300'
      : 'text-zinc-600'}"
  >
    {formatTimeAgoShort($curDate - match.date)}
  </div> -->
</TableRow>
