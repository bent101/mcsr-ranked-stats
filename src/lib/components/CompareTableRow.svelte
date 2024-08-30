<script lang="ts">
  import { page } from "$app/stores";
  import { formatTimeAgoShort, type FormattedMatch } from "$lib/formatters";
  import { curDate } from "$lib/globals";
  import TableRow from "./TableRow.svelte";

  export let match: FormattedMatch;
  export let player1UUID: string;
  export let player2UUID: string;

  $: player1 = $page.params.player1;
  $: player2 = $page.params.player2;
  $: href = `/${player1}/vs/${player2}/${match.id}`;

  $: player1Won = match.winnerUUID === player1UUID;
  $: player2Won = match.winnerUUID === player2UUID;
  $: isDraw = !player1Won && !player2Won;
</script>

<div
  class={player1Won
    ? "text-orange-300/80"
    : player2Won
    ? "text-yellow-300/80"
    : "text-zinc-400"}
>
  <TableRow {href} let:state>
    <div
      class="flex-1 {player1Won || player2Won ? '' : 'italic text-zinc-500'}"
    >
      {player1Won ? player1 : player2Won ? player2 : "Draw"}
    </div>
    <div class="w-16 text-center text-sm font-bold">
      {isDraw ? "+/-" : "+"}{Math.abs(match.eloChange)}
    </div>
    <div
      class="w-20 text-center font-extrabold tracking-wider {match.forfeited
        ? `text-xs font-semibold uppercase tracking-normal ${
            state === 'selected' ? 'opacity-100' : 'opacity-50'
          }`
        : `${state === 'selected' ? 'opacity-100' : 'opacity-80'}`}"
    >
      {match.outcome === "draw" ? "" : match.forfeited ? "Forfeit" : match.time}
    </div>
    <div
      class="w-10 text-right {state === 'selected'
        ? 'opacity-100'
        : 'opacity-50'}"
    >
      {formatTimeAgoShort($curDate - match.date)}
    </div>
  </TableRow>
</div>
