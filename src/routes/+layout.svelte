<script lang="ts">
  import { dev } from "$app/environment";
  import { beforeNavigate, invalidate } from "$app/navigation";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { showingLeaderboard } from "$lib/globals";
  import { getLeaderboardURL, getWeeklyRaceURL } from "$lib/urls";
  import { inject } from "@vercel/analytics";
  import { fade, fly } from "svelte/transition";
  import "../app.css";
  import rankedLogo from "$lib/assets/ranked.png";
  import { page } from "$app/stores";
  import { cn } from "$lib/utils";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import { headerLinks } from "$lib/config";

  inject({ mode: dev ? "development" : "production", debug: false });

  export let data;

  let lbButton: HTMLElement | undefined;

  let sidebar: HTMLElement | undefined;

  $: $showingLeaderboard, lbButton?.blur();

  const toggleLb = () => {
    $showingLeaderboard = !$showingLeaderboard;
    lbButton?.blur();
  };

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

<header
  class="fixed flex *:whitespace-nowrap inset-x-0 top-0 z-50 bg-zinc-800 shadow-md px-2 py-1 h-16"
>
  <button
    bind:this={lbButton}
    on:click={toggleLb}
    class="rounded-full self-center p-2 hover:bg-white/5 xl:hidden"
  >
    <MenuIcon class="size-6" />
  </button>
  <a href="/" class="flex items-center p-2 gap-3 group">
    <img src={rankedLogo} alt="" class="w-9" />
    <p
      class="text-zinc-300 font-semibold group-hover:underline underline-offset-4"
    >
      MCSR Ranked
    </p>
    <!-- <p class="text-xs text-zinc-600 font-normal">
      S{data.lb.season.number} • ends {formatRelativeTime(
        $curDate - data.lb.season.endsAt,
      )}
    </p> -->
  </a>
  <div class="w-2" />
  {#each headerLinks as link}
    {@const isExternal = !link.href.startsWith("/")}
    {@const isActive =
      link.href === "/"
        ? $page.url.pathname === "/"
        : $page.url.pathname.startsWith(link.href)}
    <a
      href={link.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      class={cn(
        link.hideUntilLg ? "hidden xl:flex" : "flex",
        "items-center group",
        isActive ? "text-zinc-300" : "text-zinc-400",
      )}
    >
      <p
        class="flex items-center gap-1 group-hover:bg-white/5 text-sm p-2 rounded-md"
      >
        {link.label}
        {#if isExternal}
          <ExternalLinkIcon class="size-4" />
        {/if}
      </p>
    </a>
  {/each}
</header>
<main class="flex relative gap-3">
  <div class="contents xl:hidden">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    {#if $showingLeaderboard}
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
        class="fixed top-16 z-40 h-full overflow-y-scroll overscroll-y-contain scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-900 [direction:rtl] hover:scrollbar-thumb-zinc-800"
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
  {#if $page.url.pathname.startsWith("/stats")}
    <div class="hidden xl:contents">
      <div class="w-80 border-r-2 border-zinc-700 bg-zinc-950" />
      <div
        bind:this={sidebar}
        class="fixed top-16 z-40 h-screen shrink-0 overflow-y-scroll overscroll-y-contain scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-900 [direction:rtl] hover:scrollbar-thumb-zinc-800"
      >
        <div class="[direction:ltr]">
          <Sidebar
            curSeason={data.lb.season.number}
            seasonEnd={data.lb.season.endsAt}
            {stopSidebarScroll}
            lb={data.lb.users}
          />
        </div>
      </div>
    </div>
  {/if}
  <div class="flex-1 pt-16">
    <slot />
  </div>
</main>

<Loading />
