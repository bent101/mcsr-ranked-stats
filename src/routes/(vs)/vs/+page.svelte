<script lang="ts">
	import { goto, preloadData } from "$app/navigation";
	import { ignFilter } from "$lib/actions";
	import { createLocalStorageStore } from "$lib/utils";
	import { onMount } from "svelte";

	let player1 = "";
	let player2 = "";

	const recentVs = createLocalStorageStore(
		"recentVs",
		[] as { player1: string; player2: string }[]
	);

	$: readyToSubmit = player1 && player2 && player1 !== player2;
	$: areSame = player1 && player1.toLowerCase() === player2.toLowerCase();

	const submitIfReady = () => {
		if (readyToSubmit) {
			goto(`/${player1}/vs/${player2}`);
		}
	};

	onMount(async () => {
		await preloadFirst();
	});

	async function preloadFirst() {
		const first = $recentVs[0];
		if (first) {
			const link = `/${first.player1}/vs/${first.player2}`;
			await preloadData(link);
		}
	}
</script>

<svelte:head>
	<title>Compare players | MCSR Ranked stats</title>
</svelte:head>

<div class="mt-48">
	<div
		on:keydown={(event) => {
			if (event.key === "Enter") {
				submitIfReady();
			}
		}}
		class="flex items-center justify-center font-semibold text-zinc-500">
		Compare
		<input
			use:ignFilter
			autofocus
			spellcheck="false"
			bind:value={player1}
			placeholder="a player"
			type="search"
			class="mx-2 w-44 rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-zinc-300 placeholder:text-zinc-700 search-cancel:hidden" />
		to
		<input
			use:ignFilter
			spellcheck="false"
			bind:value={player2}
			placeholder="another player"
			type="search"
			class="mx-2 w-44 rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-zinc-300 placeholder:text-zinc-700 search-cancel:hidden" />

		<a
			href={readyToSubmit ? `/${player1}/vs/${player2}` : ""}
			tabindex={readyToSubmit ? 0 : -1}
			aria-disabled={!readyToSubmit}
			class="grid {readyToSubmit
				? 'cursor-pointer opacity-100'
				: 'cursor-default opacity-10'} h-12 w-12 select-none place-items-center rounded-full border-2 border-zinc-700 bg-zinc-950 text-3xl text-zinc-300"
			>→</a>
	</div>
	<div
		class="{areSame
			? 'visible'
			: 'invisible'} mt-4 text-center text-sm font-semibold text-red-400/50">
		You can't compare <span class="text-red-400">{player1}</span> to themself!
	</div>
</div>

{#if $recentVs.length > 0}
	<div class="mx-auto grid max-w-3xl grid-flow-row grid-cols-2 gap-2 p-8">
		{#each { length: 6 } as _, i}
			{@const recent = $recentVs[i]}
			{#if recent}
				<a
					href="/{recent.player1}/vs/{recent.player2}"
					class="group flex h-24 items-center rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 font-semibold text-zinc-500 hover:border-zinc-300 hover:text-zinc-300">
					<div class="flex-1 text-center">
						{recent.player1}
						<span class="text-zinc-700 group-hover:text-zinc-500">vs</span>
						{recent.player2}
					</div>
				</a>
			{:else}
				<div class="h-24 rounded-xl border border-transparent bg-zinc-950/50" />
			{/if}
		{/each}
	</div>
{/if}
