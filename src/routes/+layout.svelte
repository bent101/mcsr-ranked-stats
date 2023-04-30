<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import "../app.css";
	import Leaderboard from "./Leaderboard.svelte";
	import Loading from "./Loading.svelte";
	import { afterNavigate } from "$app/navigation";
	import { dev } from "$app/environment";
	import { inject } from "@vercel/analytics";

	inject({ mode: dev ? "development" : "production" });

	export let data;

	let width: number;
	let showingLeaderboard = true;
	const showLb = () => (showingLeaderboard = true);
	const hideLb = () => (showingLeaderboard = false);

	afterNavigate(hideLb);
</script>

<svelte:head>
	<meta name="darkreader-lock" />
</svelte:head>

<svelte:window
	bind:innerWidth={width}
	on:keydown={(e) => {
		if (e.key === "Escape") hideLb();
	}} />

<Loading />
{#if width >= 1280}
	<div class="flex">
		<div
			class="sticky top-0 z-50 h-screen overflow-y-scroll overscroll-y-contain scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-900 [direction:rtl] hover:scrollbar-thumb-zinc-800">
			<div class="[direction:ltr]">
				<Leaderboard lb={data.lb?.users} />
			</div>
		</div>
		<div class="flex-1">
			<slot />
		</div>
	</div>
{:else}
	<button
		class="fixed left-0 top-24 z-50 rounded-r-full border-2 border-l-0 border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-zinc-500 shadow-lg shadow-black/30"
		on:click={showLb}>
		Leaderboard
	</button>
	<slot />
	{#if showingLeaderboard}
		<div
			transition:fade={{ duration: 200 }}
			on:click={hideLb}
			on:keydown={(e) => {
				if (e.key === "Escape") hideLb();
			}}
			class="fixed inset-0 z-50 bg-zinc-900/50" />
		<div
			transition:fly={{ x: -40, duration: 200 }}
			class="fixed top-0 z-50 h-screen overflow-y-scroll overscroll-y-contain scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-900 [direction:rtl] hover:scrollbar-thumb-zinc-800">
			<div class="[direction:ltr]">
				<Leaderboard lb={data.lb?.users} />
			</div>
		</div>
	{/if}
{/if}
