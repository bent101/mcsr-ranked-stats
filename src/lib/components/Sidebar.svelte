<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { ignFilter } from "$lib/actions";
  import { headerLinks, sidebarLinks } from "$lib/config";
  import { minWSmMd } from "$lib/globals";
  import type { Player } from "$lib/ranked-api";
  import { cn } from "$lib/utils";
  import ChevronLeftIcon from "./icons/ChevronLeftIcon.svelte";
  import ChevronRightIcon from "./icons/ChevronRightIcon.svelte";
  import ExternalLinkIcon from "./icons/ExternalLinkIcon.svelte";
  import XIcon from "./icons/XIcon.svelte";
  import Leaderboard from "./Leaderboard.svelte";
  import RefreshBtn from "./RefreshBtn.svelte";
  import SidebarTab from "./SidebarTab.svelte";

  export let lb: Player[] | undefined;
  // export let curSeason: number;
  // export let seasonEnd: number;

  let state =
    $page.url.pathname.startsWith("/stats") || $minWSmMd
      ? "leaderboard"
      : "root";

  let searchInput: HTMLElement | undefined;

  let rawQuery = "";
  $: query = rawQuery?.toLowerCase() ?? "";
  $: filteredLb =
    lb?.filter((player) => {
      if (query === "") return true;
      const name = player.nickname.toLowerCase();
      const start = name.indexOf(query[0]);
      if (start === -1) return false;
      let i = 1;
      for (let j = start + 1; j < name.length; j++) {
        if (name[j] === query[i]) {
          i++;
          if (i === query.length) break;
        }
      }
      return i === query.length;
    }) ?? [];

  const onLbChange = () => {
    arrowSelectedIdx = rawQuery ? 0 : -1;
  };

  $: filteredLb, onLbChange();

  $: isMatch = filteredLb.find(
    (player) => player.nickname.toLowerCase() === query,
  );
  $: isExtra = rawQuery !== "" && !isMatch;

  $: cleanedLb = filteredLb.map((player) => ({
    name: player.nickname,
    href: `/stats/${player.nickname}`,
    elo: player.eloRate?.toString() ?? "",
    rank: player.eloRank?.toString() ?? "??",
    uuid: player.uuid,
  }));

  $: extraOption = {
    name: `"${rawQuery}"`,
    href: `/stats/${rawQuery}`,
    elo: "",
    rank: "",
    uuid: "extra",
  };

  $: lbWithExtra = isExtra ? [...cleanedLb, extraOption] : cleanedLb;

  $: displayedLb = lbWithExtra.map((player, i) => ({
    ...player,
    selected: player.name?.toLowerCase() === $page.params.player?.toLowerCase(),
    arrowSelected: arrowSelectedIdx === i,
  }));

  let arrowSelectedIdx = -1;

  let inputIsFocused = false;

  afterNavigate(() => {
    rawQuery = "";
  });
</script>

<svelte:window
  on:keypress={(e) => {
    if (e.key === "/") {
      e.preventDefault();
      searchInput?.focus();
    }
  }}
/>

<div
  class=" min-h-screen-minus-header w-80 border-r-2 border-zinc-700 bg-zinc-950 pb-32 text-sm"
>
  {#if state === "leaderboard"}
    <div>
      <div
        class="sticky top-0 z-20 mb-2 space-y-2 bg-zinc-950/70 pb-4 pl-2 pr-4 pt-2 text-zinc-500 backdrop-blur-md"
      >
        <button
          on:click={() => (state = "root")}
          class="flex items-center gap-2 rounded-full py-1 pl-1.5 pr-3 text-sm font-medium text-zinc-500 hover:bg-zinc-900 sm-md:hidden"
        >
          <ChevronLeftIcon class="size-4" /> Menu
        </button>
        <div class="relative">
          <input
            type="search"
            bind:value={rawQuery}
            bind:this={searchInput}
            use:ignFilter
            on:focus={() => {
              inputIsFocused = true;
            }}
            on:blur={(e) => {
              inputIsFocused = false;
              arrowSelectedIdx = -1;
            }}
            on:keydown={(e) => {
              const n = displayedLb.length;
              if (e.key === "ArrowDown") {
                arrowSelectedIdx = (arrowSelectedIdx + 1) % n;
                e.preventDefault();
              } else if (e.key === "ArrowUp") {
                arrowSelectedIdx = (arrowSelectedIdx + n - 1) % n;
                e.preventDefault();
              } else if (e.key === "Enter") {
                goto(displayedLb[arrowSelectedIdx].href);
              } else if (e.key === "Escape") {
                rawQuery = "";
                searchInput?.blur();
              }
            }}
            placeholder="Search for players"
            class="w-full appearance-none rounded-lg border border-zinc-800 bg-transparent px-4 py-2 text-zinc-400 placeholder:text-zinc-600 focus:border-zinc-700 search-cancel:hidden"
          />
          {#if rawQuery !== ""}
            <button
              on:click={() => {
                rawQuery = "";
                searchInput?.blur();
              }}
              class="absolute inset-y-0 right-2 my-auto h-6 w-6 rounded-full hover:bg-zinc-900"
            >
              <XIcon class="stroke-zinc-700 stroke-2" />
            </button>
          {:else if !inputIsFocused}
            <kbd
              class="pointer-events-none absolute inset-y-0 right-2 my-auto h-6 w-6 select-none rounded-[0.25rem] border border-b-[2.5px] border-zinc-700/60 bg-zinc-900 text-center font-mono font-extrabold text-zinc-500/90"
            >
              /
            </kbd>
          {/if}
        </div>
      </div>

      <div class="pl-2 pt-1">
        {#each sidebarLinks as { href, label, Icon }}
          {@const selected =
            href === "/stats/vs"
              ? $page.url.pathname.startsWith("/stats/vs") ||
                $page.url.pathname.includes("/vs/")
              : $page.url.pathname.startsWith(href)}
          <SidebarTab {href} {selected}>
            <div class="flex items-center gap-10 pl-8">
              <Icon
                class={cn(
                  "size-5 select-none",
                  selected ? "text-zinc-300" : "text-zinc-600",
                )}
              />
              <div
                class={cn(
                  "font-extrabold uppercase",
                  selected
                    ? "text-zinc-300"
                    : "text-zinc-500 group-hover:text-zinc-400",
                )}
              >
                {label}
              </div>
            </div>
          </SidebarTab>
        {/each}
        <div class="mr-2 flex scroll-mt-16 items-center">
          <hr class="m-2 flex-1 border-zinc-800" />
          <RefreshBtn dark />
        </div>

        {#if lb}
          <Leaderboard lb={displayedLb} />
        {:else}
          <div class="mt-32 font-bold text-red-400">
            Couldn't get leaderboard :/
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="flex flex-col pr-2 pt-10">
      {#each headerLinks as { href, label, Icon }}
        {#if href === "/stats"}
          <button
            on:click={() => (state = "leaderboard")}
            class="w-full rounded-lg text-left hover:bg-zinc-900"
          >
            <div class="flex items-center gap-10 px-4 py-2">
              <Icon class="size-7 select-none text-zinc-600" />
              <div
                class="flex-1 text-lg font-semibold tracking-wide text-zinc-500"
              >
                {label}
              </div>
              <ChevronRightIcon class="size-7 select-none text-zinc-600" />
            </div>
          </button>
        {:else}
          <a {href} class="rounded-lg hover:bg-zinc-900">
            <div class="flex items-center gap-10 px-4 py-2">
              <Icon class="size-7 select-none text-zinc-600" />
              <div
                class="flex-1 text-lg font-semibold tracking-wide text-zinc-500"
              >
                {label}
              </div>
              {#if !href.startsWith("/")}
                <ExternalLinkIcon class="size-5 select-none text-zinc-600" />
              {/if}
            </div>
          </a>
        {/if}
      {/each}
    </div>
  {/if}
</div>
