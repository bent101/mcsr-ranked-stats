<script>
	import { page } from "$app/stores";
	$: player = $page.params.player;
</script>

<div class="grid h-screen place-items-center">
	<div class="text-xl font-semibold text-zinc-500">
		{#if $page.status === 404}
			<span class="text-zinc-300">{player}</span> hasn't played MCSR Ranked yet
			<br /><br />
			Click or search for a player to see their stats
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
