<script lang="ts">
  import { browser } from "$app/environment";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { isMdScreen } from "$lib/globals";
  import { rem2px } from "$lib/utils";
  import { writable } from "svelte/store";

  export let href: string | undefined = undefined;

  $: isLink = href && browser;

  let windowHeight = 0;
  let scrollY = 0;

  let elem: HTMLElement | null;

  const state = writable<"selected" | "loading" | "idle">("idle");

  beforeNavigate((navigation) => {
    if (!href) return;

    if (navigation.to?.url.pathname.startsWith(href)) {
      $state = "loading";
    }
  });

  afterNavigate((navigation) => {
    if (!href) {
      $state = "idle";
      return;
    }

    if (navigation.to?.url.pathname.startsWith(href)) {
      $state = "selected";
      if (!$isMdScreen) {
        scrollIntoView();
      }
    } else {
      $state = "idle";
    }
  });

  function scrollIntoView() {
    if (!elem) return;
    const currElemHeight = elem.getBoundingClientRect().top;
    const headerHeight = rem2px(7.5);
    const bottomHeight = rem2px(39);
    if (
      currElemHeight > headerHeight &&
      currElemHeight < windowHeight - bottomHeight
    )
      return;

    const newScrollY = currElemHeight + scrollY - windowHeight + bottomHeight;

    window.scrollTo({
      behavior: "smooth",
      top: newScrollY,
    });
  }

  function getClassesFromState() {
    switch ($state) {
      case "selected":
        return "border-zinc-500 bg-zinc-800";
      case "loading":
        return "border-pulse bg-zinc-800";
      case "idle":
        return "border-transparent hover-hover:hover:bg-zinc-800";
    }
  }

  let classesFromState = getClassesFromState();
  $: $state, (classesFromState = getClassesFromState());
</script>

<svelte:window bind:innerHeight={windowHeight} bind:scrollY />

{#if isLink}
  <a
    bind:this={elem}
    {href}
    data-sveltekit-replacestate
    data-sveltekit-noscroll
    class="group flex items-center gap-2 rounded-lg border px-4 py-1.5 text-left
		{classesFromState}"
  >
    <slot state={$state} />
  </a>
{:else}
  <div
    class="group flex items-center gap-2 rounded-lg border px-4 py-1.5 text-left
		{classesFromState}"
  >
    <slot state={$state} />
  </div>
{/if}

<style lang="postcss">
  @keyframes border-pulse-keyframes {
    0%,
    100% {
      @apply border-zinc-600/0;
    }
    50% {
      @apply border-zinc-600/100;
    }
  }
  .border-pulse {
    animation: border-pulse-keyframes 2s infinite;
  }
</style>
