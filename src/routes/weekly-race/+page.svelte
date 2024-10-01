<script lang="ts">
  import WeeklyRaceTableRow from "$lib/components/WeeklyRaceTableRow.svelte";
  import { formatRelativeTime } from "$lib/formatters.js";
  import { curDate } from "$lib/globals.js";
  import { flip } from "svelte/animate";

  export let data;
</script>

<svelte:head>
  <title>Weekly race | MCSR Ranked stats</title>
</svelte:head>

<div class="mx-auto max-w-md pt-16 md:ml-16">
  <h1 class="text-xl font-bold text-zinc-300">Weekly race</h1>
  <p class="text-zinc-500 text-sm">
    Week {data.weeklyRaceLeaderboard.id} • ends {formatRelativeTime(
      $curDate - data.weeklyRaceLeaderboard.endsAt,
    )}
  </p>
  <ol
    class="mx-auto mt-8 max-w-sm border-t-2 border-zinc-800 pb-[36rem] pt-8 md:ml-0"
  >
    {#each data.weeklyRaceLeaderboard.leaderboard as run (run.player.uuid)}
      <li>
        <WeeklyRaceTableRow {run} />
      </li>
    {/each}
  </ol>
</div>
<!-- 
<MatchDetailsFrame>
  <slot />
</MatchDetailsFrame> -->
