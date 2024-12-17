<script lang="ts">
  import { afterNavigate, goto } from "$app/navigation";
  import { navigating, page } from "$app/stores";
  import { minWMd } from "$lib/globals";
  import { cn, rem2px } from "$lib/utils";

  export let href: string | undefined = undefined;
  export let dashed = false;

  $: isLink = href;

  let windowHeight = 0;
  let scrollY = 0;

  let elem: HTMLElement | null;

  function scrollIntoView() {
    if (!elem) return;
    const currElemHeight = elem.getBoundingClientRect().top;
    const padding = rem2px($minWMd ? 8 : 2);
    const headerHeight = rem2px(7.5);
    const bottomHeight = $minWMd ? 0 : rem2px(39);

    // Calculate target position clamped between header and bottom
    const targetPos = Math.max(
      headerHeight + padding,
      Math.min(windowHeight - bottomHeight - padding, currElemHeight),
    );

    const newScrollY = scrollY + (currElemHeight - targetPos);

    window.scrollTo({
      behavior: "smooth",
      top: newScrollY,
    });
  }

  $: state = !href
    ? "idle"
    : $navigating === null
      ? $page.url.pathname.startsWith(href)
        ? "selected"
        : "idle"
      : $navigating.to?.url.pathname.startsWith(href)
        ? "loading"
        : "idle";

  afterNavigate(() => {
    if (state === "selected") scrollIntoView();
  });

  $: if (state === "selected") scrollIntoView();
</script>

<svelte:window bind:innerHeight={windowHeight} bind:scrollY />

<div class="group relative">
  {#if isLink}
    <a
      bind:this={elem}
      {href}
      data-sveltekit-replacestate
      data-sveltekit-noscroll
      class={cn(
        "absolute inset-0 rounded-lg border px-4 py-1.5",
        dashed && "border-dashed",
        state === "selected" && "border-zinc-500 bg-zinc-800",
        state === "loading" && "border-pulse bg-zinc-800",
        state === "idle" && "border-transparent group-hover:bg-zinc-800",
      )}
    >
    </a>
  {/if}
  <div
    class="pointer-events-none relative flex items-center gap-2 rounded-lg bg-transparent px-4 py-1.5 text-left"
  >
    <slot {state} />
  </div>
</div>
