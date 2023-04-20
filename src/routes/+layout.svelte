<script lang="ts">
	import "../app.css";
	import Leaderboard from "./Leaderboard.svelte";
	export let data;
</script>

<div class="mx-auto flex h-screen max-h-screen overflow-hidden">
	<Leaderboard lb={data.lb?.users} />
	<div class="flex-1">
		<slot />
	</div>
</div>
