<script>
	import { page } from "$app/stores";
	import { derived } from "svelte/store";

	const player = $page.url.pathname.split("/")[1];
</script>

<div class="grid h-screen place-items-center">
	<div class="text-xl font-semibold text-zinc-500">
		<span class="text-zinc-300">{player}</span> hasn't played MCSR Ranked yet
		<br /><br />
		Click or search for a player to see their stats
	</div>
</div>
