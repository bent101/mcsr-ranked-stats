<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { page } from "$app/stores";
	import type { PlayerInfo } from "$lib/ranked-api";
	import { tick } from "svelte";

	export let lb: PlayerInfo[] | undefined;

	afterNavigate(async () => {
		await tick();
		const element = document.querySelector(".selected");
		if (!element) return;
		element.scrollIntoView({ behavior: "smooth", block: "center" });
	});
</script>

<div
	class="h-full w-max overflow-y-scroll overscroll-y-contain border-r-2 border-zinc-800 bg-zinc-950 pt-0">
	<h1
		class="sticky top-0 bg-zinc-950/70 p-4 text-center font-extrabold uppercase tracking-wider text-zinc-600 backdrop-blur-md">
		MSCR Ranked Leaderboard
	</h1>
	{#if lb}
		<ol class="p-4 pl-0">
			{#each lb as { nickname, elo_rate, elo_rank }}
				{@const selected = nickname === $page.params.player}
				<li class="" class:selected>
					<a
						href="/{nickname}"
						class="group flex items-center rounded-r-full {selected
							? 'bg-zinc-400'
							: 'hover:bg-zinc-900'}">
						<span
							class="inline-block w-12 px-2 py-1 text-right font-extrabold {selected
								? 'text-zinc-600'
								: 'text-zinc-800 group-hover:text-zinc-400'}">{elo_rank ?? "???"}</span>
						<span
							class="inline-block flex-1 px-2 py-1 {selected
								? 'font-bold tracking-tight text-zinc-900'
								: 'text-zinc-400 group-hover:text-white'}">{nickname}</span>
						<span
							class="inline-block w-20 px-2 py-1 font-semibold text-zinc-700 {selected
								? ''
								: 'group-hover:text-zinc-500'}">{elo_rate}</span>
					</a>
				</li>
			{/each}
		</ol>
	{:else}
		<div class="mt-32 text-center font-bold text-red-700">Couldn't get leaderboard :/</div>
	{/if}
</div>
