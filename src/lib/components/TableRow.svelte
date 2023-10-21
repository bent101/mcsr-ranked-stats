<script lang="ts">
	import { browser } from "$app/environment";
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import { isMdScreen } from "$lib/globals";
	import { convertRemToPixels } from "$lib/utils";
	import { writable } from "svelte/store";

	export let href: string | undefined = undefined;

	$: isLink = href && browser;

	let windowHeight = 0;
	let scrollY = 0;

	let elem: HTMLElement | null;

	const state = writable<"selected" | "loading" | "idle">("idle");

	beforeNavigate((navigation) => {
		if (!href) return;

		if (navigation.to?.url.pathname === href) {
			$state = "loading";
		}
	});

	afterNavigate((navigation) => {
		if (!href) return;

		if (navigation.to?.url.pathname === href) {
			$state = "selected";
		} else {
			$state = "idle";
		}
	});

	function scrollIntoView() {
		if (!elem) return;
		const currElemHeight = elem.getBoundingClientRect().y;
		const headerHeight = convertRemToPixels(7.5);
		const bottomHeight = convertRemToPixels(39);
		if (currElemHeight > headerHeight && currElemHeight < windowHeight - bottomHeight) return;

		window.scrollTo({
			behavior: "smooth",
			top: currElemHeight + scrollY - windowHeight + bottomHeight,
		});
	}

	$: if ($state === "selected" && !$isMdScreen) {
		scrollIntoView();
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
		{classesFromState}">
		<slot state={$state} />
	</a>
{:else}
	<div
		bind:this={elem}
		class="group flex items-center gap-2 rounded-lg border px-4 py-1.5 text-left
		{classesFromState}">
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
