<script lang="ts">
	import { goto } from "$app/navigation";
	import { ignFilter } from "$lib/actions";

	let player1 = "";
	let player2 = "";

	$: readyToSubmit = player1 && player2;

	const submitIfReady = () => {
		if (readyToSubmit) {
			goto(`/${player1}/vs/${player2}`);
		}
	};
</script>

<svelte:head>
	<title>Compare players | MCSR Ranked stats</title>
</svelte:head>

<div class="grid h-screen place-items-center p-4 text-zinc-300">
	<div
		on:keydown={(event) => {
			if (event.key === "Enter") {
				submitIfReady();
			}
		}}
		class="flex flex-wrap items-center justify-center">
		Compare
		<input
			use:ignFilter
			autofocus
			spellcheck="false"
			bind:value={player1}
			placeholder="a player"
			type="search"
			class="mx-2 rounded-lg border border-zinc-700 bg-transparent px-4 py-2 placeholder:text-zinc-700 search-cancel:hidden" />
		to
		<input
			use:ignFilter
			spellcheck="false"
			bind:value={player2}
			placeholder="another player"
			type="search"
			class="mx-2 rounded-lg border border-zinc-700 bg-transparent px-4 py-2 placeholder:text-zinc-700 search-cancel:hidden" />

		<a
			href={readyToSubmit ? `/${player1}/vs/${player2}` : ""}
			tabindex={readyToSubmit ? 0 : -1}
			aria-disabled={!readyToSubmit}
			class="grid {readyToSubmit
				? 'cursor-pointer opacity-100'
				: 'cursor-default opacity-10'} h-12 w-12 select-none place-items-center rounded-full border-2 border-zinc-700 bg-zinc-950 text-3xl text-zinc-300"
			>→</a>
	</div>
</div>
