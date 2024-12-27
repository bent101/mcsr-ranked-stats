<script lang="ts">
  import { isTouchScreen } from "$lib/globals";
  import { getSkinURL } from "$lib/urls";

  export let uuid: string;
  export let rotation = { x: 0, y: 0 };
  export let followCursor = false;

  $: skinURL = getSkinURL(uuid);

  let cube: HTMLElement | undefined;

  function handleMouseMove(
    event: MouseEvent & { currentTarget: EventTarget & Window },
  ) {
    if (!cube) return;

    const cubeRect = cube.getBoundingClientRect();
    const centerX = cubeRect.left + cubeRect.width / 2;
    const centerY = cubeRect.top + cubeRect.height / 2;

    if ($isTouchScreen) {
      rotation.x = rotation.x;
      rotation.y = rotation.y;
    } else {
      rotation.x = (Math.atan((centerY - event.clientY) / 800) / Math.PI) * 180;
      rotation.y =
        (Math.atan(-(centerX - event.clientX) / 800) / Math.PI) * 180;
    }
  }
</script>

<svelte:window
  on:mousemove={followCursor ? handleMouseMove : null}
  on:drag={followCursor ? handleMouseMove : null}
/>

<div class="viewport m-2">
  <div
    class="cube"
    style="transform: rotateX({rotation.x}deg) rotateY({rotation.y}deg)"
    bind:this={cube}
  >
    <div style="background-image: url('{skinURL}')" class="inner front" />
    <div style="background-image: url('{skinURL}')" class="inner back" />
    <div style="background-image: url('{skinURL}')" class="inner right" />
    <div style="background-image: url('{skinURL}')" class="inner left" />
    <div style="background-image: url('{skinURL}')" class="inner top" />
    <div style="background-image: url('{skinURL}')" class="inner bottom" />

    <div style="background-image: url('{skinURL}')" class="outer front" />
    <div style="background-image: url('{skinURL}')" class="outer back" />
    <div style="background-image: url('{skinURL}')" class="outer right" />
    <div style="background-image: url('{skinURL}')" class="outer left" />
    <div style="background-image: url('{skinURL}')" class="outer top" />
    <div style="background-image: url('{skinURL}')" class="outer bottom" />
  </div>
</div>

<style>
  .viewport {
    width: 3rem;
    height: 3rem;
    position: relative;
    backface-visibility: hidden;
    perspective: 12.5rem;
  }

  .cube {
    transform-style: preserve-3d;
    position: absolute;
    inset: 0;
  }

  .cube div {
    position: absolute;
    inset: 0;
    background-size: 800%;
    image-rendering: pixelated;
  }

  .outer {
    scale: 1.125 1.125 1.125;
  }

  .front,
  .front::before {
    transform: translateZ(1.4875rem);
  }

  .back,
  .back::before {
    transform: translateZ(-1rem) rotateY(180deg);
  }

  .right,
  .right::before {
    transform: rotateY(90deg) translateZ(1.4875rem);
  }

  .left,
  .left::before {
    transform: rotateY(-90deg) translateZ(1.4875rem);
  }

  .top,
  .top::before {
    transform: rotateX(90deg) translateZ(1.4875rem);
  }

  .bottom {
    transform: rotateX(-90deg) rotateZ(180deg) translateZ(1.4875rem);
  }

  /*  */

  .inner.front {
    background-position: -100% -100%;
  }

  .inner.back {
    background-position: -300% -100%;
  }

  .inner.right {
    background-position: -200% -100%;
  }

  .inner.left {
    background-position: 0 -100%;
  }

  .inner.top {
    background-position: -100% 0;
  }

  .inner.bottom {
    background-position: -200% 0;
  }

  /*  */

  .outer.front {
    background-position: -500% -100%;
  }

  .outer.back {
    background-position: -700% -100%;
  }

  .outer.right {
    background-position: -600% -100%;
  }

  .outer.left {
    background-position: -400% -100%;
  }

  .outer.top {
    background-position: -500% 0;
  }

  .outer.bottom {
    background-position: -600% 0;
  }

  /*  */
</style>
