<script lang="ts">
  import MatchDetailsFrame from "$lib/components/MatchDetailsFrame.svelte";
  import WeeklyRaceTableRow from "$lib/components/WeeklyRaceTableRow.svelte";
  import { formatRelativeTime } from "$lib/formatters.js";
  import { curDate } from "$lib/globals.js";

  export let data;
</script>

<svelte:head>
  <title>Weekly race | MCSR Ranked stats</title>
</svelte:head>

<div class="max-w-lg px-4 pb-[34rem] pt-16">
  <div class="mx-auto max-w-sm">
    <h1 class="text-xl font-bold text-zinc-300">Weekly race</h1>
    <p class="text-sm text-zinc-500">
      Week {data.weeklyRace.id} • ends {formatRelativeTime(
        $curDate - data.weeklyRace.endsAt,
      )}
    </p>
    <ol class="mt-8 border-t-2 border-zinc-800 pt-8 md:ml-0">
      {#each data.weeklyRace.leaderboard as run (run.player.uuid)}
        <li>
          <WeeklyRaceTableRow {run} />
        </li>
      {/each}
    </ol>
  </div>
</div>

<MatchDetailsFrame>
  <slot />
</MatchDetailsFrame>
