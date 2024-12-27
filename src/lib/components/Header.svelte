<script lang="ts">
  import { page } from "$app/stores";
  import rankedLogo from "$lib/assets/ranked.png";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import CartIcon from "$lib/components/icons/CartIcon.svelte";
  import { headerLinks, store } from "$lib/config";
  import { showingLeaderboard } from "$lib/globals";
  import { cn } from "$lib/utils";

  export let lbButton: HTMLElement | undefined;

  const toggleLb = () => {
    $showingLeaderboard = !$showingLeaderboard;
    lbButton?.blur();
  };

  let scrollY = 0;

  $: headerBgOpacity = Math.min(scrollY / 200, 0.85);
  $: headerBlur = Math.min(scrollY / 8.5, 20);
</script>

<svelte:window bind:scrollY />

<header
  class={cn(
    "fixed inset-x-0 top-0 z-50 flex h-16 bg-zinc-800 px-2 py-1 *:whitespace-nowrap",
    $page.url.pathname !== "/" && "shadow-md",
  )}
  style={$page.url.pathname === "/"
    ? `--tw-bg-opacity: ${headerBgOpacity};
    backdrop-filter: blur(${headerBlur}px)`
    : undefined}
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
  <a href="/" class="group flex items-center gap-1 p-2">
    <img src={rankedLogo} alt="" class="w-9" />
    <p class="font-semibold text-white/80 underline-offset-4" translate="no">
      MCSR Ranked
    </p>
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
          "group flex items-center font-medium",
          isActive ? "text-white/80" : "text-white/50",
        )}
      >
        <p
          class="flex items-center gap-1 rounded-md p-2 text-sm group-hover:bg-white/5"
        >
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
