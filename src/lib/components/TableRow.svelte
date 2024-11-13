<script lang="ts">
  import { browser } from "$app/environment";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { isMdScreen } from "$lib/globals";
  import { cn, rem2px } from "$lib/utils";
  import { writable } from "svelte/store";

  export let href: string | undefined = undefined;
  export let dashed = false;

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

  $: classes = cn(
    "group flex items-center gap-2 rounded-lg border px-4 py-1.5 text-left",
    dashed && "border-dashed",
    $state === "selected" && "border-zinc-500 bg-zinc-800 z-10",
    $state === "loading" && "border-pulse bg-zinc-800",
    $state === "idle" && ["border-transparent", isLink && "hover:bg-zinc-800"],
  );
</script>

<svelte:window bind:innerHeight={windowHeight} bind:scrollY />

{#if isLink}
  <a
    bind:this={elem}
    {href}
    data-sveltekit-replacestate
    data-sveltekit-noscroll
    class={classes}
  >
    <slot state={$state} />
  </a>
{:else}
  <div class={classes}>
    <slot state={$state} />
  </div>
{/if}
