<script lang="ts">
  import { backOut } from "svelte/easing";
  import { afterNavigate } from "$app/navigation";
  import { clamp, sleep } from "$lib/utils";
  import type { Direction } from "$lib/globals";
  import { onDestroy, onMount, tick } from "svelte";
  import { scale } from "svelte/transition";
  import { browser } from "$app/environment";

  export let anchor: Element | undefined;

  /** should the popup stay visible when you hover over it? */
  export let hoverable = false;

  /** optional function that loads data for the popup */
  export let load: (() => Promise<Record<string, unknown>>) | undefined =
    undefined;

  export let directionPreference: Direction[] = [
    "top",
    "right",
    "bottom",
    "left",
  ];

  /** in milliseconds */
  export let delay: number = 300;

  /** in pixels, between the popup and anchor */
  export let padding: number = 16;

  let directionIndex = 0;

  const updateAnchor = (anchor: Element | undefined) => {
    if (anchor) {
      anchor.addEventListener("mouseenter", onMouseEnterAnchor);
      anchor.addEventListener("mouseleave", onMouseLeaveAnchor);
    }
  };

  $: updateAnchor(anchor);

  $: transformOrigin = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  }[directionPreference[directionIndex]];

  /** in pixels, between the popup and the window edge */
  const windowPadding = 16;

  /** in milliseconds; the grace period to switch mouse between anchor and popup */
  const outDelay = 150;

  let data: any;

  let popupSizer: HTMLElement;
  let popupContainer: HTMLElement;
  let transitionDuration = 250;

  let popupX = 0;
  let popupY = 0;

  let screenWidth = 0;
  let screenHeight = 0;

  let hovering = false;
  let popupExists = false;
  let popupSizerExists = false;

  const positionPopup = async () => {
    if (!anchor) {
      console.error("could find anchor for popup");
      return;
    }

    popupSizerExists = true;
    await tick();
    const popupBox = popupSizer.getBoundingClientRect();
    popupSizerExists = false;

    const anchorBox = anchor.getBoundingClientRect();

    // the following bit of code is for positioning the popup. It tries
    // each of the directions in the preferred order, first with no clamping
    // then with clamping. If none of them are on screen, it takes the one
    // with the best score (least off-screen).

    /**
     * @returns the score of the positioning; 0 is perfect, higher is worse
     */
    const tryPopupPosition = (direction: Direction) => {
      const minX = windowPadding;
      const minY = windowPadding;
      const maxX = screenWidth - popupBox.width - windowPadding;
      const maxY = screenHeight - popupBox.height - windowPadding;

      const centeredX =
        anchorBox.left + anchorBox.width / 2 - popupBox.width / 2;
      const centeredY =
        anchorBox.top + anchorBox.height / 2 - popupBox.height / 2;

      let score = Infinity;

      switch (direction) {
        case "top":
          popupX = clamp(centeredX, minX, maxX);
          popupY = anchorBox.top - popupBox.height - padding;
          score = Math.max(minY - popupY, popupY - maxY);
          break;
        case "bottom":
          popupX = clamp(centeredX, minX, maxX);
          popupY = anchorBox.bottom + padding;
          score = Math.max(minY - popupY, popupY - maxY);
          break;

        case "left":
          popupX = anchorBox.left - popupBox.width - padding;
          popupY = clamp(centeredY, minY, maxY);
          score = Math.max(minX - popupX, popupX - maxX);
          break;

        case "right":
          popupX = anchorBox.right + padding;
          popupY = clamp(centeredY, minY, maxY);
          score = Math.max(minX - popupX, popupX - maxX);
          break;
      }
      return Math.max(0, score);
    };

    /** higher is worse, 0 is perfect */
    const scores = directionPreference.map((dir) => tryPopupPosition(dir));

    let minScore = Infinity;
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] < minScore) {
        minScore = scores[i];
        directionIndex = i;
      }
    }

    tryPopupPosition(directionPreference[directionIndex]);
  };

  const onMouseEnterAnchor = async () => {
    hovering = true;
    await sleep(delay);

    if (!hovering) return;

    if (load) {
      const entries = Object.entries(await load());
      const promises = entries.map(([key, promise]) =>
        Promise.resolve(promise).then((value) => [key, value]),
      );
      const resolvedEntries = await Promise.all(promises);

      if (!hovering) return;

      data = Object.fromEntries(resolvedEntries);
      await tick();
    }

    await positionPopup();

    await tick();

    popupExists = true;
  };

  const onMouseLeaveAnchor = async () => {
    hovering = false;

    if (hoverable) await sleep(outDelay);

    if (!hovering) {
      popupExists = false;
    }
  };

  const onMouseEnterPopup = () => {
    if (hoverable && popupExists) {
      hovering = true;
    }
  };

  const onMouseLeavePopup = () => {
    hovering = false;
    popupExists = false;
  };

  afterNavigate(onMouseLeavePopup);

  onMount(() => {
    if (browser) {
      document.body.appendChild(popupContainer);
      window.addEventListener("scroll", onMouseLeavePopup);
    }
  });

  onDestroy(() => {
    if (browser) {
      try {
        document.body.removeChild(popupContainer);
      } catch (error) {
        console.error(`couldnt remove popup from body. load func: ${load}`);
      }
    }
  });
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<div
  bind:this={popupContainer}
  on:mouseenter={onMouseEnterPopup}
  on:mouseleave={onMouseLeavePopup}
  class={hoverable ? "" : "pointer-events-none"}
  style="position: fixed; z-index: 999;
    top: {popupY}px; 
    left: {popupX}px;
	"
  role="tooltip"
>
  {#if popupExists && (!load || data)}
    <div
      style="transform-origin: {transformOrigin};"
      class="w-max"
      in:scale={{
        start: 0.8,
        duration: transitionDuration,
        delay: delay,
        easing: backOut,
      }}
      out:scale={{
        start: 0.8,
        duration: transitionDuration,
        easing: backOut,
      }}
    >
      <slot {data} />
    </div>
  {/if}
</div>

<div bind:this={popupSizer} class="invisible fixed left-0 top-0">
  {#if popupSizerExists}
    <slot {data} />
  {/if}
</div>
