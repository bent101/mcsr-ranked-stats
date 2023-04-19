<script lang="ts">
	import "../app.css";
	import Leaderboard from "./Leaderboard.svelte";
	export let data;
</script>

<div class="mx-auto h-screen max-h-screen overflow-hidden flex">
	<Leaderboard {data} />
	<div class="flex-1">
		<slot />
	</div>
</div>
