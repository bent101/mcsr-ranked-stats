<script lang="ts">
  import type { PlayoffsData, PlayoffsMatch } from "$lib/ranked-api.js";
  import { cn } from "$lib/utils.js";
  import type { Writable } from "svelte/store";
  import Hoverable from "$lib/components/Hoverable.svelte";

  export let match: PlayoffsMatch;
  export let players: PlayoffsData["players"];
  export let results: PlayoffsData["results"];
  export let curHoveredPlayer: Writable<string | null>;
  export let curHoveredMatchId: Writable<number | null>;

  $: isTie =
    match.state === "DONE" &&
    match.participants[0]?.roundScore === match.participants[1]?.roundScore;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<Hoverable
  store={curHoveredMatchId}
  value={match.id}
  disabled={match.startTime == null}
  let:isHovered
>
  <div
    class={cn(
      "relative rounded-md",
      match.name === "Grand Final" && "origin-left scale-[var(--gf-scale)]",
      match.participants.length === 0
        ? "bg-zinc-800/40"
        : match.name === "Grand Final"
          ? "gf-glow bg-gradient-to-bl from-light-green to-zinc-900 to-40%"
          : "bg-zinc-800 shadow-md",
    )}
  >
    {#if match.name === "Grand Final" && match.participants.length > 0}
      <div
        class="absolute inset-px -z-50 rounded-[0.3125rem] bg-zinc-800"
      ></div>
    {/if}
    {#if isHovered}
      <div
        class="pointer-events-none absolute inset-0 rounded-md bg-white/10"
      />
    {/if}
    {#if match.name === "Grand Final"}
      <h2
        class="pointer-events-none absolute inset-x-0 bottom-full pb-1 text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500"
      >
        Grand Finals
      </h2>
    {/if}
    {#each [0, 1] as i}
      {@const index = match.participants[i]?.player}
      {@const roundScore = match.participants[i]?.roundScore}
      {@const player = index === undefined ? null : players[index]}
      {@const seed = index === undefined ? null : index + 1}
      {@const isWinner = !isTie && roundScore === match.maxRoundScore}
      {@const playerPlace = results.find((r) => r.player === index)?.place}

      <Hoverable
        store={curHoveredPlayer}
        value={player?.uuid}
        disabled={player == null}
        let:isHovered
      >
        <div
          class={cn(
            "relative flex items-center gap-1 overflow-hidden",
            i === 0 && "rounded-t-md",
            i === 1 && "rounded-b-md",
            isWinner && "bg-gradient-to-l from-light-green/10 to-transparent",
            isHovered && "bg-white/15 text-zinc-100",
          )}
        >
          {#if player}
            <p class="w-5 shrink-0 text-right text-xs text-white/30">
              {seed}
            </p>
            <div class={cn("line-clamp-1 flex-1 py-1 text-sm")} translate="no">
              <span
                class={cn(
                  (match.name === "Grand Final" ||
                    match.name === "3rd Place") && [
                    [1, 2, 3].includes(playerPlace) &&
                      "bg-gradient-to-l bg-clip-text text-transparent",
                    playerPlace === 1 && "from-yellow-200 to-amber-500",
                    playerPlace === 2 && "from-blue-100 to-slate-400",
                    playerPlace === 3 && "from-[#fdbda6] to-[#e27852]",
                  ],
                )}
              >
                {player.nickname}
              </span>
            </div>
            {#if match.state === "ACTIVE" || match.state === "DONE"}
              <div
                class={cn(
                  "w-8 shrink-0 px-3 py-1 text-right text-sm font-semibold",
                  isWinner
                    ? "bg-light-green/80 text-white [text-shadow:1px_1px_1px_#0004]"
                    : "bg-white/5 text-zinc-400",
                )}
              >
                {roundScore}
              </div>
            {/if}
          {:else}
            <div class="h-7"></div>
          {/if}
        </div>
      </Hoverable>
    {/each}
  </div>
</Hoverable>

<style>
  .gf-glow {
    box-shadow:
      2px -1px 4px hsla(var(--light-green), 10%),
      8px -4px 22px hsla(var(--light-green), 20%);
  }
</style>
