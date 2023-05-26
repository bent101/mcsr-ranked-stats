<script lang="ts">
	export let name = "";
	export let uuid = "";
	import PlayerProfile from "./PlayerProfile.svelte";
	import type { DetailedPlayer } from "./ranked-api";
	import { getPlayerURL, getSkin } from "./utils";
	import { scale } from "svelte/transition";
	import { afterNavigate } from "$app/navigation";

	let playerData: DetailedPlayer | undefined;

	let justFetched = false;
	let hovering = false;
	let showing = false;
	let fetchTimeout: number | undefined;
	// let hoverTimeout: number | undefined;

	const onMouseEnter = async () => {
		hovering = true;
		const delayPromise = new Promise((res) => setTimeout(res, 500));

		if (!justFetched) {
			const playerDataPromise = fetch(getPlayerURL(name))
				.then((res) => res.json())
				.then((res) => res.data);

			const imagePromise = fetch(getSkin(uuid));

			[playerData] = await Promise.all([playerDataPromise, imagePromise, delayPromise]);

			justFetched = true;
			setTimeout(() => {
				justFetched = false;
			}, 10_000);
		} else {
			await delayPromise;
		}

		if (hovering) showing = true;
	};

	const onMouseLeave = () => {
		hovering = false;
		showing = false;
	};

	afterNavigate(onMouseLeave);
</script>

<a
	on:mouseenter={onMouseEnter}
	on:mouseleave={onMouseLeave}
	data-sveltekit-replacestate="off"
	data-sveltekit-noscroll="off"
	href="/{name}"
	class="relative hover:underline hover:underline-offset-4">
	{name}
	{#if showing && playerData}
		<div
			in:scale={{ start: 0.8, duration: 150 }}
			out:scale={{ start: 0.8, duration: 100 }}
			class="pointer-events-none absolute -inset-y-[999rem] left-full z-50 my-auto ml-4 h-min origin-left rounded-3xl bg-zinc-800 p-2 shadow-lg shadow-black/30">
			<PlayerProfile {playerData} />
		</div>
	{/if}
</a>
