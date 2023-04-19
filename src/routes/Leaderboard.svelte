<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	export let data;
	import { page } from "$app/stores";
	import { derived } from "svelte/store";

	let curPlayer = derived(page, (page) => $page.url.pathname.split("/")[1]);
	let selectedElement;

	afterNavigate(() => {
		const element = document.querySelector(".selected");
		if (!element) return;
		element.scrollIntoView({ behavior: "smooth", block: "center" });
	});
</script>

<div
	class="h-full w-max min-w-max overflow-y-scroll overscroll-y-contain border-r-2 border-zinc-800 bg-zinc-950 pt-0">
	<h1
		class="sticky top-0 bg-zinc-950/70 p-4 text-center font-extrabold uppercase tracking-widest text-zinc-600 backdrop-blur-md">
		MSCR Ranked Leaderboard
	</h1>
	<ol class="p-4">
		{#each data.lb.users as { uuid, nickname, elo_rate, elo_rank }}
			{@const selected = nickname === $curPlayer}
			<li class="" class:selected>
				<a
					href="/{nickname}"
					class="group flex items-center rounded-lg {selected
						? 'bg-zinc-400'
						: 'hover:bg-zinc-900'}">
					<span
						class="inline-block w-12 px-2 py-1 text-right font-extrabold {selected
							? 'text-zinc-600'
							: 'text-zinc-800 group-hover:text-zinc-400'}">{elo_rank}</span>
					<span
						class="inline-block flex-1 text-ellipsis px-2 py-1 text-lg {selected
							? 'font-bold text-zinc-900'
							: 'text-zinc-400 group-hover:text-white'}">{nickname}</span>
					<span
						class="inline-block w-20 px-2 py-1 font-semibold text-zinc-700 {selected
							? ''
							: 'group-hover:text-zinc-500'}">{elo_rate}</span>
				</a>
			</li>
		{/each}
	</ol>
</div>
