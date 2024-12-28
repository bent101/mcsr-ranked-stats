<script lang="ts">
  import type { PlayoffsData } from "$lib/ranked-api";
  import { cn } from "$lib/utils";
  import type { Writable } from "svelte/store";
  import PlayoffsMatch from "./PlayoffsMatch.svelte";

  export let playoffsData: PlayoffsData;
  export let curHoveredPlayer: Writable<string | null>;
  export let curHoveredMatchId: Writable<number | null>;

  $: ({ players, matches, results } = playoffsData);
</script>

<div
  class="relative overflow-x-auto pr-20 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-800"
>
  <div class="relative flex w-max pb-4 pt-4">
    {#each ["Round of 16", "Round of 8", "Semifinals", "Grand Final"] as roundName, i}
      {@const roundMatches = matches.filter((m) => m.name === roundName)}
      <div class="flex w-52 shrink-0 flex-col">
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
                <div
                  class="flex w-2.5 shrink-0 flex-col space-y-0.5"
                  style="height: calc(
                      {Math.pow(2, i - 1) * 100}% +
                      {Math.pow(2, i - 1)} * var(--matches-gap)
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
    <div class="absolute -right-12 bottom-36">
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

<style>
  :root {
    --matches-gap: 1rem;
  }
</style>
