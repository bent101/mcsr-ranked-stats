<script lang="ts">
	import { browser } from "$app/environment";
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import { convertRemToPixels } from "$lib/utils";

	export let selected = false;
	export let href: string | undefined = undefined;

	$: isLink = href && browser;
	$: isSelected = href === $page.url.pathname;

	let windowHeight = 0;
	let scrollY = 0;

	let elem: HTMLElement | null;

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

	afterNavigate(() => {
		if (isSelected) {
			scrollIntoView();
		}
	});
</script>

<svelte:window bind:innerHeight={windowHeight} bind:scrollY />

{#if isLink}
	<a
		bind:this={elem}
		{href}
		data-sveltekit-replacestate
		data-sveltekit-noscroll
		class="group flex items-center gap-2 rounded-lg border px-4 py-1.5 text-left {selected
			? 'border-zinc-500 bg-zinc-800'
			: ' border-transparent hover-hover:hover:bg-zinc-800'}">
		<slot />
	</a>
{:else}
	<div
		bind:this={elem}
		class="group flex items-center gap-2 rounded-lg border px-4 py-1.5 text-left {selected
			? 'border-zinc-500 bg-zinc-800'
			: 'border-transparent hover-hover:hover:bg-zinc-800'}">
		<slot />
	</div>
{/if}
