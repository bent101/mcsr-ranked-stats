<script lang="ts">
  import ChevronDownIcon from "$lib/components/icons/ChevronDownIcon.svelte";
  import PlayerLink from "$lib/components/PlayerLink.svelte";
  import { formatTime } from "$lib/formatters";
  import type { PlayoffsData } from "$lib/ranked-api";
  import { cn } from "$lib/utils";
  import { type Writable } from "svelte/store";
  import { onpress } from "$lib/actions";

  export let playoffsData: PlayoffsData;
  export let curHoveredPlayer: Writable<string | null>;
  export let curHoveredMatchId: Writable<number | null>;
  $: ({ players, matches, results } = playoffsData);

  let sort: "seed" | "elo" | "pb" = "seed";

  $: sortedPlayers = players.toSorted((a, b) => {
    if (sort === "seed") return a.seedNumber - b.seedNumber;
    if (sort === "elo") return b.seasonEloRate - a.seasonEloRate;
    if (sort === "pb") return a.personalBest - b.personalBest;
    return 0;
  });
</script>

<div>
  <div class="flex pl-3 pr-4">
    <button
      class={cn(
        "relative w-14 -translate-x-2 rounded-md px-2 py-1 text-xs font-bold tracking-wide ",
        sort === "seed" ? "text-zinc-400" : "text-zinc-500 hover:bg-white/5",
      )}
      use:onpress={() => (sort = "seed")}
    >
      SEED
      {#if sort === "seed"}
        <div
          class="pointer-events-none absolute -left-1 top-0 h-40 w-full bg-gradient-to-b from-white/10 to-transparent blur"
        ></div>
        <ChevronDownIcon
          class="absolute -right-1 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
        />
      {/if}
    </button>
    <div class="flex-1" />
    <button
      class={cn(
        "relative mr-2.5 w-14 rounded-md px-2 py-1 text-xs font-bold tracking-wide ",
        sort === "elo" ? "text-zinc-400" : "text-zinc-500 hover:bg-white/5",
      )}
      use:onpress={() => (sort = "elo")}
    >
      ELO
      {#if sort === "elo"}
        <div
          class="pointer-events-none absolute left-1 top-0 h-40 w-full bg-gradient-to-b from-white/10 to-transparent blur"
        ></div>
        <ChevronDownIcon
          class="absolute -right-1 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
        />
      {/if}
    </button>
    <button
      class={cn(
        "relative w-14 rounded-md px-2 py-1 text-xs font-bold tracking-wide ",
        sort === "pb" ? "text-zinc-400" : "text-zinc-500 hover:bg-white/5",
      )}
      use:onpress={() => (sort = "pb")}
    >
      PB
      {#if sort === "pb"}
        <div
          class="pointer-events-none absolute left-1.5 top-0 h-40 w-full bg-gradient-to-b from-white/10 to-transparent blur"
        ></div>
        <ChevronDownIcon
          class="absolute -right-1 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
        />
      {/if}
    </button>
  </div>
  {#each sortedPlayers as player (player.uuid)}
    {@const seed = player.seedNumber + 1}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class={cn(
        "flex items-center gap-1 rounded-lg px-4 py-1.5",
        $curHoveredPlayer === player.uuid ? "bg-zinc-800" : "hover:bg-zinc-800",
      )}
      on:mouseenter={() => ($curHoveredPlayer = player.uuid)}
      on:mouseleave={() => ($curHoveredPlayer = null)}
    >
      <div class="w-8 shrink-0 pr-1 font-semibold text-zinc-600">
        {seed}
      </div>
      <div class="flex-1 truncate">
        <PlayerLink name={player.nickname} uuid={player.uuid} />
      </div>
      <div class="w-14 shrink-0 text-center tabular-nums text-zinc-500">
        {player.seasonEloRate}
      </div>
      <div class="w-14 shrink-0 text-right tabular-nums text-zinc-500">
        {formatTime(player.personalBest)}
      </div>
    </div>
  {/each}
</div>
