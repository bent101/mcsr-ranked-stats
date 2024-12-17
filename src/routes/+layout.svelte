<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { beforeNavigate, invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import rankedLogo from "$lib/assets/ranked.png";
  import CartIcon from "$lib/components/icons/CartIcon.svelte";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import Header from "$lib/components/Header.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { headerLinks, store } from "$lib/config";
  import { onlinePlayers, showingLeaderboard } from "$lib/globals";
  import { getLeaderboardURL, getWeeklyRaceURL } from "$lib/urls";
  import { inject } from "@vercel/analytics";
  import { fade, fly } from "svelte/transition";
  import "../app.css";
  import { cn } from "$lib/utils";

  inject({ mode: dev ? "development" : "production", debug: false });

  export let data;

  $: $onlinePlayers = new Set(
    data.recentMatches.flatMap((m) => m.players.map((p) => p.nickname)),
  );

  let lbButton: HTMLElement | undefined;
  let sidebar: HTMLElement | undefined;

  $: $showingLeaderboard, lbButton?.blur();

  $: if ($page.url.pathname === "/stats") {
    $showingLeaderboard = true;
  }

  const hideLb = () => {
    $showingLeaderboard = false;
    lbButton?.blur();
  };

  const stopSidebarScroll = async () => {
    if (!sidebar) return;
    // sidebar.scrollTop = 0;
  };
  beforeNavigate(hideLb);
</script>

<svelte:head>
  <meta name="darkreader-lock" />
  <meta
    name="description"
    content="Home of MCSR Ranked, a Minecraft Mod that adds a ranked system to Minecraft Speedruns."
  />
  <meta
    name="keywords"
    content="mcsr,minecraft,speedrun,ranked,mcsrranked,mcsrranked.com"
  />
  <link
    rel="preload"
    href="https://i.ytimg.com/vi/GsVgmR0q0fc/maxresdefault.jpg"
    as="image"
  />
  <link rel="preload" href="/import-from-zip-tab.png" as="image" />

  <title>MCSR Ranked</title>
</svelte:head>

<svelte:window
  on:keydown={(e) => {
    if (e.key === "Escape") {
      hideLb();
    }
  }}
  on:focus={() => {
    invalidate(getLeaderboardURL());
    invalidate(getWeeklyRaceURL());
  }}
/>

<Header bind:lbButton />

<main class="relative flex">
  <div class="contents xl:hidden">
    {#if browser && $showingLeaderboard}
      <div
        transition:fade={{ duration: 100 }}
        on:click={hideLb}
        on:keydown={(e) => {
          if (e.key === "Escape") hideLb();
        }}
        class="fixed inset-0 z-40 bg-black/90"
      />
      <div
        bind:this={sidebar}
        transition:fly={{ x: -200, duration: 200 }}
        class="fixed top-header-height z-40 h-full overflow-y-scroll overscroll-y-contain scrollbar-track-zinc-950 [direction:rtl]"
      >
        <div class="[direction:ltr]">
          <!-- curSeason={data.lb.season.number}
          seasonEnd={data.lb.season.endsAt} -->
          <Sidebar {stopSidebarScroll} lb={data.lb?.users} />
        </div>
      </div>
    {/if}
  </div>
  {#if $page.url.pathname.startsWith("/stats")}
    <div class="hidden xl:contents">
      <!-- dummy sidebar to shift the main content to the right since the real sidebar is fixed -->
      <!-- (i didnt wanna make it sticky cuz it scrolls weird on overscroll) -->
      <div
        bind:this={sidebar}
        class="sticky top-header-height z-40 h-screen-minus-header shrink-0 overflow-y-scroll overscroll-y-contain scrollbar-track-zinc-950 [direction:rtl]"
      >
        <div class="min-h-screen-minus-header [direction:ltr]">
          <div
            class="min-h-screen-minus-header w-80 border-r-2 border-transparent pb-32 text-sm"
          ></div>
        </div>
      </div>
      <!--  -->
      <div
        bind:this={sidebar}
        class="fixed top-header-height z-40 h-screen-minus-header shrink-0 overflow-y-scroll overscroll-y-contain scrollbar-track-zinc-950 [direction:rtl]"
      >
        <div class="min-h-screen-minus-header [direction:ltr]">
          <!-- curSeason={data.lb.season.number}
          seasonEnd={data.lb.season.endsAt} -->
          <Sidebar {stopSidebarScroll} lb={data.lb.users} />
        </div>
      </div>
    </div>
  {/if}
  <div
    class={cn(
      "flex-1 overflow-x-clip",
      $page.url.pathname !== "/" && "pt-header-height",
    )}
  >
    <slot />
  </div>
</main>

<Loading />
