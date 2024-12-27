<script lang="ts">
  import { cn } from "$lib/utils.js";
  import type { PlayoffsData, PlayoffsMatch } from "$lib/ranked-api.js";
  import type { Writable } from "svelte/store";

  export let match: PlayoffsMatch;
  export let players: PlayoffsData["players"];
  export let results: PlayoffsData["results"];
  export let curHoveredPlayer: Writable<string | null>;
  export let curHoveredMatchId: Writable<number | null>;

  $: isTie =
    match.participants[0].roundScore === match.participants[1].roundScore;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class={cn(
    "relative rounded-md shadow-md",
    match.name === "Grand Final"
      ? "gf-glow origin-left scale-125 bg-gradient-to-bl from-light-green to-transparent to-40%"
      : "bg-zinc-800",
  )}
  on:mouseenter={() => ($curHoveredMatchId = match.id)}
  on:mouseleave={() => ($curHoveredMatchId = null)}
>
  {#if match.name === "Grand Final"}
    <div class="absolute inset-px -z-50 rounded-[0.3125rem] bg-zinc-800"></div>
  {/if}
  {#if $curHoveredMatchId === match.id}
    <div class="pointer-events-none absolute inset-0 rounded-md bg-white/10" />
  {/if}
  {#if match.name === "Grand Final"}
    <h2
      class="pointer-events-none absolute inset-x-0 bottom-full pb-1 text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500"
    >
      Grand Final
    </h2>
  {/if}
  {#each match.participants as { player: index, roundScore }, i}
    {@const player = players[index]}
    {@const seed = index + 1}
    {@const isWinner = !isTie && roundScore === match.maxRoundScore}
    {@const playerPlace =
      results.findIndex((result) => result.player === index) + 1}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class={cn(
        "relative flex items-center gap-1 overflow-hidden",
        i === 0 && "rounded-t-md",
        i === match.participants.length - 1 && "rounded-b-md",
        isWinner && "bg-gradient-to-l from-light-green/10 to-transparent",
        $curHoveredPlayer === player.uuid && "bg-white/15 text-zinc-100",
      )}
      on:mouseenter={() => ($curHoveredPlayer = player.uuid)}
      on:mouseleave={() => ($curHoveredPlayer = null)}
    >
      <p class="w-5 shrink-0 text-right text-xs text-white/30">
        {seed}
      </p>
      <div class={cn("line-clamp-1 flex-1 text-sm")} translate="no">
        <span
          class={cn(
            (match.name === "Grand Final" || match.name === "3rd Place") && [
              [1, 2, 3].includes(playerPlace) &&
                "bg-gradient-to-r bg-clip-text text-transparent",
              playerPlace === 1 && "from-yellow-200 to-amber-500",
              playerPlace === 2 && "from-blue-100 to-slate-400",
              playerPlace === 3 && "from-[#fdbda6] to-[#e27852]",
            ],
          )}
        >
          {player.nickname}
        </span>
      </div>
      <div
        class={cn(
          "w-8 shrink-0 px-3 py-1 text-right text-sm font-semibold",
          isWinner
            ? "bg-light-green/80 text-white [text-shadow:1px_1px_1px_#0004]"
            : "bg-zinc-700/50 text-zinc-400",
        )}
      >
        {roundScore}
      </div>
    </div>
  {/each}
</div>

<style>
  .gf-glow {
    box-shadow:
      2px -1px 4px hsla(var(--light-green), 10%),
      8px -4px 22px hsla(var(--light-green), 20%);
  }
</style>
