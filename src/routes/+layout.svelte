<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import "../app.css";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import { beforeNavigate, invalidate } from "$app/navigation";
  import { dev } from "$app/environment";
  import { inject } from "@vercel/analytics";
  import { page } from "$app/stores";
  import { getLeaderboardURL, getWeeklyRaceURL } from "$lib/urls";

  inject({ mode: dev ? "development" : "production" });

  export let data;

  let lbButton: HTMLElement | undefined;

  let sidebar: HTMLElement | undefined;

  let showingLeaderboard = $page.url.pathname === "/";

  const showLb = () => {
    showingLeaderboard = true;
    if (lbButton) lbButton.blur();
  };
  const hideLb = () => {
    showingLeaderboard = false;
    if (lbButton) lbButton.blur();
  };

  const stopSidebarScroll = async () => {
    if (!sidebar) return;
    sidebar.scrollTop = 0;
  };
  beforeNavigate(hideLb);
</script>

<svelte:head>
  <meta name="darkreader-lock" />
  <meta
    name="description"
    content="Leaderboards, player statistics, match details, and more for MCSR Ranked (mcsrranked.com)"
  />
  <meta
    name="keywords"
    content="mcsr,minecraft,speedrun,ranked,mcsrranked,mcsrranked.com"
  />
</svelte:head>

<svelte:window
  on:keydown={(e) => {
    if (e.key === "Escape") hideLb();
  }}
  on:focus={() => {
    invalidate(getLeaderboardURL());
    invalidate(getWeeklyRaceURL());
  }}
/>

<div class="xl:flex">
  <button
    bind:this={lbButton}
    on:click={showLb}
    class="fixed left-0 top-32 z-50 rounded-r-full border-[0.125rem] border-l-0 border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-zinc-500 shadow-lg shadow-black/30"
  >
    Leaderboard
  </button>
  <div class="contents xl:hidden">
    {#if showingLeaderboard}
      <div
        transition:fade={{ duration: 200 }}
        on:click={hideLb}
        on:keydown={(e) => {
          if (e.key === "Escape") hideLb();
        }}
        class="fixed inset-0 z-50 bg-black/90"
      />
      <div
        bind:this={sidebar}
        transition:fly={{ x: -200, duration: 300 }}
        class="fixed top-0 z-50 h-full overflow-y-scroll overscroll-y-contain scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-900 [direction:rtl] hover:scrollbar-thumb-zinc-800"
      >
        <div class="[direction:ltr]">
          <Sidebar
            curSeason={data.lb.season.number}
            seasonEnd={data.lb.season.endsAt}
            {stopSidebarScroll}
            lb={data.lb?.users}
          />
        </div>
      </div>
    {/if}
  </div>
  <div class="hidden xl:contents">
    <div class="w-80 border-r-2 border-zinc-700 bg-zinc-950" />
    <div
      bind:this={sidebar}
      class="fixed top-0 z-50 h-screen shrink-0 overflow-y-scroll overscroll-y-contain scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-900 [direction:rtl] hover:scrollbar-thumb-zinc-800"
    >
      <div class="[direction:ltr]">
        <Sidebar
          curSeason={data.lb.season.number}
          seasonEnd={data.lb.season.endsAt}
          {stopSidebarScroll}
          lb={data.lb?.users}
        />
      </div>
    </div>
  </div>
  <div class="xl:flex-1">
    <slot />
  </div>
</div>

<Loading />
