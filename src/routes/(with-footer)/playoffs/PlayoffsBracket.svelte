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
</script>

<div
  class={cn(
    "relative overflow-x-auto pr-20 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-800",
    playoffs.data.type === "alpha"
      ? "[--matches-gap:1rem]"
      : "[--matches-gap:2rem]",
  )}
>
  <div class="relative flex w-max pb-4 pt-4">
    {#each roundNames as roundName, i}
      {@const roundMatches = matches.filter((m) => m.name === roundName)}
      <div
        class={cn("flex shrink-0 flex-col", i === 0 ? "w-[11.5rem]" : "w-52")}
      >
        {#if roundName !== "Grand Final"}
          <h2
            class={cn(
              "text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500",
              i !== 0 && "pl-6",
            )}
          >
            {roundName}
          </h2>
        {/if}
        <div
          class="flex flex-1 flex-col justify-around gap-[var(--matches-gap)] pt-2"
        >
          {#each roundMatches as match}
            {@const player1Id = match.participants[0].player}
            {@const player2Id = match.participants[1].player}
            {@const player1Hovered =
              $curHoveredPlayer === players[player1Id].uuid}
            {@const player2Hovered =
              $curHoveredPlayer === players[player2Id].uuid}
            <div class="flex items-center">
              {#if i > 0}
                {#if playoffs.data.type === "alpha"}
                  <div
                    class="flex w-2.5 shrink-0 flex-col space-y-0.5"
                    style="height: calc(
                      {(roundSizes[0] / roundSizes[i] / 2) * 100}% +
                      {roundSizes[0] / roundSizes[i] / 2} * var(--matches-gap)
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
                      "-ml-0.5 w-3 shrink-0 border-t-2",
                      player1Hovered || player2Hovered
                        ? "border-white/70"
                        : "border-white/10",
                    )}
                  ></div>
                {:else}
                  <div class="w-6" />
                {/if}
              {/if}
              <div class="flex-1">
                <PlayoffsMatch
                  {match}
                  {players}
                  {results}
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
        "absolute -right-12",
        playoffs.data.type === "alpha" ? "bottom-36" : "bottom-0",
      )}
    >
      <div class="flex w-52 shrink-0 flex-col">
        <h2
          class="text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500"
        >
          3rd Place
        </h2>
        <div class="flex flex-1 flex-col justify-around gap-2 pt-2">
          {#each matches.filter((m) => m.name === "3rd Place") as match}
            <PlayoffsMatch
              {match}
              {players}
              {results}
              {curHoveredPlayer}
              {curHoveredMatchId}
            />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
