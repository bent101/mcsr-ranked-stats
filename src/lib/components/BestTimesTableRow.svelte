<script lang="ts">
  import {
    formatTimeAgoShort,
    type formatRecordLeaderboard,
  } from "$lib/formatters";
  import { curDate } from "$lib/globals";
  import PlayerLink from "./PlayerLink.svelte";
  import TableRow from "./TableRow.svelte";

  export let match: ReturnType<typeof formatRecordLeaderboard>[number];
  export let place: number;

  $: href = `/lb/${match.id}`;
</script>

<TableRow {href} let:state>
  <div
    class="mr-4 w-4 text-right font-extrabold {state === 'selected'
      ? 'text-zinc-300'
      : 'text-zinc-600'}"
  >
    {place}
  </div>
  <div class="flex-1 text-center text-zinc-300">
    <PlayerLink name={match.playerName} uuid={match.playerUUID} />
  </div>
  <div
    class="w-20 text-center font-extrabold tracking-wider
             {state === 'selected' ? 'text-zinc-300' : 'text-zinc-400'}"
  >
    {match.time}
  </div>
  <div
    class="w-10 text-right {state === 'selected'
      ? 'text-zinc-300'
      : 'text-zinc-600'}"
  >
    {formatTimeAgoShort($curDate - match.date)}
  </div>
</TableRow>
