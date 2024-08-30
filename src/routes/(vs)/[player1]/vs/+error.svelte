<script lang="ts">
	import { page } from "$app/stores";
	import BackBtn from "$lib/components/BackBtn.svelte";
	$: player1 = $page.params.player1;
	$: player2 = $page.params.player2;
</script>

<svelte:head>
	<title>MCSR Ranked stats</title>
</svelte:head>

<div class="grid h-screen place-items-center">
	<div class="p-4 text-xl font-semibold text-zinc-500">
		{#if $page.error && $page.status === 404}
			{#if $page.error.message === "same"}You can't compare
				<span class="text-zinc-300">{player1}</span> to themself!
				<div class="mt-16">
					<BackBtn />
				</div>
			{:else if $page.error.message === "both"}
				<span class="text-zinc-300">{player1}</span>
				and
				<span class="text-zinc-300">{player2}</span>
				haven't played MCSR Ranked yet
				<div class="mt-16">
					<BackBtn />
				</div>
			{:else}
				<span class="text-zinc-300">{$page.error.message === "player2" ? player1 : player2}</span>

				has played MCSR Ranked, but
				<span class="text-zinc-300">{$page.error.message === "player2" ? player2 : player1}</span>
				has not
				<div class="mt-16">
					<BackBtn />
				</div>
			{/if}
		{:else}
			<div class="flex items-center">
				<div class="mr-8 text-5xl text-zinc-700">
					{$page.status}
				</div>
				<div class="text-3xl">{$page.error?.message}</div>
			</div>
		{/if}
	</div>
</div>
