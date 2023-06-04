<script lang="ts">
	import { getSkinURL } from "$lib/urls";

	// import { beforeNavigate } from "$app/navigation";
	// import { spring } from "svelte/motion";

	export let uuid: string;
	export let rotate = false;
	export let facingForward = false;

	$: skinURL = getSkinURL(uuid);

	let cube: HTMLElement | undefined;
	let cubeRect = undefined;
	let centerX = 0;
	let centerY = 0;
	let rotateX = facingForward ? 0 : -12;
	let rotateY = facingForward ? 0 : 20;
	$: if (cube) {
		cubeRect = cube.getBoundingClientRect();
		centerX = cubeRect.left + cubeRect.width / 2;
		centerY = cubeRect.top + cubeRect.height / 2;
	}
</script>

<svelte:window
	on:mousemove={(e) => {
		if (rotate) {
			rotateX = (Math.atan((centerY - e.clientY) / 800) / Math.PI) * 180;
			rotateY = (Math.atan(-(centerX - e.clientX) / 800) / Math.PI) * 180;
		}
	}} />

<div class="viewport m-2">
	<div class="cube" style="transform: rotateX({rotateX}deg) rotateY({rotateY}deg)" bind:this={cube}>
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
		width: 48px;
		height: 48px;
		position: relative;
		animation: rotate 10s infinite linear;
		backface-visibility: hidden;
		perspective: 200px;
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
		transform: translateZ(23.8px);
	}

	.back,
	.back::before {
		transform: translateZ(-23.8px) rotateY(180deg);
	}

	.right,
	.right::before {
		transform: rotateY(90deg) translateZ(23.8px);
	}

	.left,
	.left::before {
		transform: rotateY(-90deg) translateZ(23.8px);
	}

	.top,
	.top::before {
		transform: rotateX(90deg) translateZ(23.8px);
	}

	.bottom {
		transform: rotateX(-90deg) rotateZ(180deg) translateZ(23.8px);
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
