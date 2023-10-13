<script lang="ts">
	import { fade, fly } from "svelte/transition";
	import "../app.css";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import Loading from "$lib/components/Loading.svelte";
	import { beforeNavigate } from "$app/navigation";
	import { dev } from "$app/environment";
	import { inject } from "@vercel/analytics";
	import { isXlScreen } from "$lib/globals";
	import { page } from "$app/stores";
	// import { onNavigate } from "$app/navigation";

	// onNavigate((navigation) => {
	// 	if (!document.startViewTransition) return;
	// 	// if(!navigation.from?.

	// 	return new Promise((resolve) => {
	// 		document.startViewTransition(async () => {
	// 			resolve();
	// 			await navigation.complete;
	// 		});
	// 	});
	// });

	inject({ mode: dev ? "development" : "production" });

	export let data;

	let lbButton: HTMLElement | undefined;

	let sidebar: HTMLElement | undefined;

	let showingLeaderboard = $page.url.pathname === "/";

	const showLb = () => {
		showingLeaderboard = true;
		if (lbButton) lbButton.blur();
	};
	const hideLb = () => {
		showingLeaderboard = false;
		if (lbButton) lbButton.blur();
	};

	const stopSidebarScroll = async () => {
		if (!sidebar) return;
		sidebar.scrollTop = 0;
		// sidebar.style.overflow = "hidden";
		// setTimeout(() => {
		// 	sidebar!.style.overflow = "";
		// }, 0);
	};
	beforeNavigate(hideLb);
</script>

<svelte:head>
	<meta name="darkreader-lock" />
</svelte:head>

<svelte:window
	on:keydown={(e) => {
		if (e.key === "Escape") hideLb();
	}} />

{#if !$isXlScreen}
	<button
		bind:this={lbButton}
		on:click={showLb}
		class="fixed left-0 top-32 z-50 rounded-r-full border-[0.125rem] border-l-0 border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-extrabold uppercase tracking-wide text-zinc-500 shadow-lg shadow-black/30">
		Leaderboard
	</button>
	<div>
		<slot />
	</div>
	{#if showingLeaderboard}
		<div
			transition:fade={{ duration: 200 }}
			on:click={hideLb}
			on:keydown={(e) => {
				if (e.key === "Escape") hideLb();
			}}
			class="fixed inset-0 z-50 bg-black/90" />
		<div
			bind:this={sidebar}
			transition:fly={{ x: -40, duration: 200 }}
			class="fixed top-0 z-50 h-full overflow-y-scroll overscroll-y-contain scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-900 [direction:rtl] hover:scrollbar-thumb-zinc-800">
			<div class="[direction:ltr]">
				<Sidebar {stopSidebarScroll} lb={data.lb?.users} />
			</div>
		</div>
	{/if}
{:else}
	<div class="flex">
		<div
			bind:this={sidebar}
			class="sticky top-0 z-50 h-screen shrink-0 overflow-y-scroll overscroll-y-contain scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-900 [direction:rtl] hover:scrollbar-thumb-zinc-800">
			<div class="[direction:ltr]">
				<Sidebar {stopSidebarScroll} lb={data.lb?.users} />
			</div>
		</div>
		<div class="flex-1">
			<slot />
		</div>
	</div>
{/if}

<Loading />
