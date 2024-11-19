<script lang="ts">
  import { dev } from "$app/environment";
  import { beforeNavigate, invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import rankedLogo from "$lib/assets/ranked.png";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { headerLinks, store } from "$lib/config";
  import { showingLeaderboard } from "$lib/globals";
  import { getLeaderboardURL, getWeeklyRaceURL } from "$lib/urls";
  import { cn } from "$lib/utils";
  import { inject } from "@vercel/analytics";
  import { fade, fly } from "svelte/transition";
  import "../app.css";
  import CartIcon from "$lib/components/icons/CartIcon.svelte";

  inject({ mode: dev ? "development" : "production", debug: false });

  export let data;

  let lbButton: HTMLElement | undefined;

  let sidebar: HTMLElement | undefined;

  $: $showingLeaderboard, lbButton?.blur();

  $: if ($page.url.pathname === "/stats") {
    $showingLeaderboard = true;
  }

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
  class="fixed inset-x-0 top-0 z-50 flex h-16 bg-zinc-800 px-2 py-1 shadow-md *:whitespace-nowrap"
>
  <div class="flex flex-1 items-center sm:contents">
    <button
      bind:this={lbButton}
      on:click={toggleLb}
      class="self-center rounded-full p-2 hover:bg-white/5 xl:hidden"
    >
      <MenuIcon class="size-6" />
    </button>
  </div>
  <a href="/" class="group flex items-center gap-3 p-2">
    <img src={rankedLogo} alt="" class="w-9" />
    <p
      class="hover-hover:group-hover:underline font-semibold text-zinc-300 underline-offset-4"
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
  <div class="hidden sm:contents">
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
          "group flex items-center hover:[&>p]:bg-white/5",
          isActive ? "text-zinc-300" : "text-zinc-400",
        )}
      >
        <p class="flex items-center gap-1 rounded-md p-2 text-sm">
          {link.label}
          {#if isExternal}
            <ExternalLinkIcon class="size-4" />
          {/if}
        </p>
      </a>
    {/each}
  </div>
  <div class="flex flex-1 items-center justify-end sm:hidden">
    <a
      href={store.href}
      target="_blank"
      rel="noopener noreferrer"
      class="self-center rounded-full p-2 hover:bg-white/5 xl:hidden"
    >
      <CartIcon class="size-6" />
    </a>
  </div>
</header>
<main class="relative flex">
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
  <div class="flex-1 overflow-x-clip pt-header-height">
    <slot />
  </div>
</main>

<Loading />
