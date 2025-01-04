<script lang="ts">
  import type { PlayoffsResponse } from "$lib/ranked-api";
  import { cn } from "$lib/utils";
  import type { Writable } from "svelte/store";
  import PlayoffsMatch from "./PlayoffsMatch.svelte";
  import _ from "lodash";

  export let playoffs: PlayoffsResponse;
  export let curHoveredPlayer: Writable<string | null>;
  export let curHoveredMatchId: Writable<number | null>;

  $: ({ players, matches, results } = playoffs.data);

  $: roundNames =
    playoffs.data.type === "alpha"
      ? ["Round of 16", "Round of 8", "Semifinals", "Grand Final"]
      : ["Round 1", "Round 2", "Quarterfinals", "Semifinals", "Grand Final"];

  $: roundSizes = roundNames.map(
    (name) => matches.filter((m) => m.name === name).length,
  );

  $: thirdPlaceMatch = matches.find((m) => m.name === "3rd Place");
</script>

<div
  class={cn(
    "relative w-max [--col-width:11rem] [--gf-scale:1.25] ",
    playoffs.data.type === "alpha"
      ? "[--matches-hgap:1.5rem] [--matches-vgap:1rem]"
      : "[--matches-hgap:0.6rem] [--matches-vgap:2rem]",
  )}
>
  <div class="relative flex pb-4 pr-10 pt-4">
    {#each roundNames as roundName, i}
      {@const roundMatches = matches.filter((m) => m.name === roundName)}
      <div
        class={cn(
          "flex shrink-0 flex-col",
          i === 0
            ? "w-[var(--col-width)]"
            : roundName === "Grand Final"
              ? "w-[calc(var(--matches-hgap)+var(--col-width)*var(--gf-scale))] pr-[calc(var(--col-width)*(var(--gf-scale)-1))]" // lol
              : "w-[calc(var(--matches-hgap)+var(--col-width))]",
        )}
      >
        <h2
          class={cn(
            "text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500",
            i !== 0 && "pl-6",
          )}
        >
          {#if roundName !== "Grand Final"}
            {roundName}
          {:else}
            <div class="h-[1lh]" />
          {/if}
        </h2>
        <div
          class="flex flex-1 flex-col justify-around gap-[var(--matches-vgap)] pt-5"
        >
          {#each roundMatches as match}
            {@const player1Id = match.participants[0]?.player}
            {@const player2Id = match.participants[1]?.player}
            {@const player1Hovered =
              player1Id != null &&
              $curHoveredPlayer === players[player1Id]?.uuid}
            {@const player2Hovered =
              player2Id != null &&
              $curHoveredPlayer === players[player2Id]?.uuid}
            <div class="flex items-center">
              {#if i > 0}
                {#if playoffs.data.type === "alpha"}
                  <div
                    class="flex w-[calc(var(--matches-hgap)/2-0.125rem)] shrink-0 flex-col space-y-0.5"
                    style="height: calc(
                      {(roundSizes[0] / roundSizes[i] / 2) * 100}% +
                      {roundSizes[0] / roundSizes[i] / 2} * var(--matches-vgap)
                    )"
                  >
                    <div
                      class={cn(
                        "flex-1 border-r-2 border-t-2",
                        player1Hovered ? "border-white/70" : "border-white/10",
                      )}
                    ></div>
                    <div
                      class={cn(
                        "flex-1 border-b-2 border-r-2",
                        player2Hovered ? "border-white/70" : "border-white/10",
                      )}
                    ></div>
                  </div>
                  <div
                    class={cn(
                      "-ml-0.5 w-[calc(var(--matches-hgap)/2)] shrink-0 border-t-2",
                      player1Hovered || player2Hovered
                        ? "border-white/70"
                        : "border-white/10",
                    )}
                  ></div>
                {:else}
                  <div class="w-[var(--matches-hgap)]" />
                {/if}
              {/if}
              <div class="flex-1">
                <PlayoffsMatch
                  {match}
                  playoffs={playoffs.data}
                  {curHoveredPlayer}
                  {curHoveredMatchId}
                />
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
    <div
      class={cn(
        "absolute right-12",
        playoffs.data.type === "alpha" ? "bottom-36" : "bottom-4",
      )}
    >
      {#if thirdPlaceMatch}
        <div class="flex w-[var(--col-width)] shrink-0 flex-col">
          <h2
            class="text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500"
          >
            3rd Place
          </h2>
          <div class="flex flex-1 flex-col justify-around gap-2 pt-5">
            <PlayoffsMatch
              match={thirdPlaceMatch}
              playoffs={playoffs.data}
              {curHoveredPlayer}
              {curHoveredMatchId}
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
