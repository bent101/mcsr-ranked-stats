<script lang="ts">
  import BestTimesTableRow from "$lib/components/BestTimesTableRow.svelte";
  import MatchDetailsFrame from "$lib/components/MatchDetailsFrame.svelte";
  import Switch from "$lib/components/Switch.svelte";
  import { createLocalStorageStore } from "$lib/utils";

  export let data;

  const showingAll = createLocalStorageStore("showingAll", false);
  export const showingAllTime = createLocalStorageStore(
    "showingAllTime",
    false,
  );

  $: matches = $showingAll
    ? $showingAllTime
      ? data.allBestTimesAllTime
      : data.allBestTimesThisSeason
    : $showingAllTime
      ? data.uniqueBestTimesAllTime
      : data.uniqueBestTimesThisSeason;
</script>

<svelte:head>
  <title>Fastest times | MCSR Ranked</title>
</svelte:head>

<div class="max-w-lg px-4 pb-[34rem] pt-16">
  <div class="mx-auto max-w-sm">
    <div class="h-20">
      <h1 class="text-xl font-bold text-zinc-300">Fastest times</h1>
      <div class="flex gap-2 pt-1">
        <Switch
          options={["all time", "this season"]}
          bind:onFirst={$showingAllTime}
        />
        <Switch options={["all", "1 per player"]} bind:onFirst={$showingAll} />
      </div>
    </div>
    <ol class="mx-auto max-w-sm border-t-2 border-zinc-800 pt-8 md:ml-0">
      {#each matches as match, i (match.id)}
        <li>
          <BestTimesTableRow place={i + 1} {match} />
        </li>
      {/each}
    </ol>
  </div>
</div>

<MatchDetailsFrame>
  <slot />
</MatchDetailsFrame>
