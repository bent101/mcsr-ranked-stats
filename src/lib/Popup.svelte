<script lang="ts">
	import { backOut } from "svelte/easing";
	import { afterNavigate } from "$app/navigation";
	import { clamp, sleep } from "./utils";
	import { onMount, tick } from "svelte";
	import { scale } from "svelte/transition";

	type Direction = "top" | "bottom" | "left" | "right";
	export let directionPreference: Direction[] = ["top", "right", "bottom", "left"];
	let directionIndex = 0;

	$: transformOrigin = { top: "bottom", bottom: "top", left: "right", right: "left" }[
		directionPreference[directionIndex]
	];

	/** in milliseconds */
	export let delay: number = 300;

	/** in pixels, between the popup and anchor */
	export let padding: number = 16;

	/** in pixels, between the popup and the window edge */
	const windowPadding = 4;

	export let load: (() => Promise<object>) | undefined = undefined;

	let data: any;

	let popupSizer: HTMLElement;
	let popupContainer: HTMLElement;
	let transitionDuration = 200;

	let anchorContainer: HTMLElement;

	let popupX = 0;
	let popupY = 0;

	let screenWidth = 0;
	let screenHeight = 0;

	let hovering = false;
	let popupExists = false;

	const onMouseEnter = async () => {
		hovering = true;
		await sleep(delay);

		if (!hovering) return;

		if (load) {
			const entries = Object.entries(await load());
			const promises = entries.map(([key, promise]) => promise.then((value) => [key, value]));

			const resolvedEntries = await Promise.all(promises);
			if (!hovering) return;

			data = Object.fromEntries(resolvedEntries);
			await tick();
		}

		popupX = 0;
		popupY = 0;

		const popupBox = popupSizer.getBoundingClientRect();
		const anchorBox = anchorContainer.getBoundingClientRect();

		// the following bit of code is for positioning the popup. It tries
		// each of the directions in the preferred order, first with no clamping
		// then with clamping. If none of them are on screen, it takes the one
		// with the best score (least off-screen).

		/**
		 * @returns the score of the positioning; 0 is perfect, higher is worse
		 */
		const positionPopup = (direction: Direction) => {
			const minX = windowPadding;
			const minY = windowPadding;
			const maxX = screenWidth - popupBox.width - windowPadding;
			const maxY = screenHeight - popupBox.height - windowPadding;

			const centeredX = anchorBox.left + anchorBox.width / 2 - popupBox.width / 2;
			const centeredY = anchorBox.top + anchorBox.height / 2 - popupBox.height / 2;

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
		const scores = directionPreference.map((dir) => positionPopup(dir));
		console.log(scores);

		let minScore = Infinity;
		for (let i = 0; i < scores.length; i++) {
			if (scores[i] < minScore) {
				minScore = scores[i];
				directionIndex = i;
			}
		}

		positionPopup(directionPreference[directionIndex]);

		await tick();

		popupExists = true;
	};

	const onMouseLeave = async () => {
		popupExists = false;
		hovering = false;
	};

	afterNavigate(onMouseLeave);

	onMount(() => {
		document.body.appendChild(popupContainer);
	});
</script>

<svelte:window bind:innerWidth={screenWidth} bind:innerHeight={screenHeight} />

<span
	class="inline-block"
	bind:this={anchorContainer}
	on:mouseenter={onMouseEnter}
	on:mouseleave={onMouseLeave}
	on:focus={onMouseEnter}
	on:blur={onMouseLeave}>
	<slot name="anchor" />
</span>

<div
	bind:this={popupContainer}
	style="position: fixed; z-index: 999;
    top: {popupY}px; 
    left: {popupX}px">
	{#if popupExists && (!load || data)}
		<div
			style="transform-origin: {transformOrigin};"
			transition:scale={{ start: 0.8, duration: transitionDuration, easing: backOut }}>
			<slot {data} />
		</div>
	{/if}
</div>

<div bind:this={popupSizer} class="invisible absolute">
	{#if !load || data}
		<slot {data} />
	{/if}
</div>
