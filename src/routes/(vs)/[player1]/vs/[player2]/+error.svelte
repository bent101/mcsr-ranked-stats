<script lang="ts">
	import { page } from "$app/stores";
	$: player1 = $page.params.player1;
	$: player2 = $page.params.player2;
</script>

<svelte:head>
	<title>MCSR Ranked stats</title>
</svelte:head>

<div class="grid h-screen place-items-center">
	<div class="text-xl font-semibold text-zinc-500">
		{#if $page.error && $page.status === 404}
			{#if $page.error.message === "both"}
				<span class="text-zinc-300">{player1}</span>
				and
				<span class="text-zinc-300">{player2}</span>
				haven't played MCSR Ranked yet
				<br /><br />
				Click or search for a player to see their stats
			{:else}
				<span class="text-zinc-300">{$page.error.message === "player1" ? player1 : player2}</span>

				hasn't played MCSR Ranked yet
				<br /><br />
				Click or search for a player to see their stats
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
