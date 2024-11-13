<script lang="ts">
  import { page } from "$app/stores";
  import { parseWeeklyRaceRun } from "$lib/formatters.js";

  export let data;

  $: run = data.run;
  $: playerUUID = $page.params.playerUUID;
  $: runOnLb = data.weeklyRace.leaderboard.find(
    (r) => r.player.uuid === playerUUID,
  );
  $: timeline = parseWeeklyRaceRun(run, runOnLb?.time ?? 0, playerUUID);
</script>

<!-- <MatchDetails match={formatDetailedMatch({
  category
})} /> -->
<!-- <div class="overflow-y-auto max-h-[30rem]">
  <MatchTimeline {timeline} />
  <pre class="text-xs">
    {JSON.stringify(timeline, null, 2)}
  </pre>
</div> -->
