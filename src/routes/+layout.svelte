<script lang="ts">
	import "../app.css";
	import Leaderboard from "./Leaderboard.svelte";
	export let data;
</script>

<div class="mx-auto flex h-screen overflow-hidden">
	<div class="h-full overflow-y-scroll overscroll-y-contain [direction:rtl]">
		<div class="h-full [direction:ltr]">
			<Leaderboard lb={data.lb?.users} />
		</div>
	</div>
	<div class="flex-1">
		<slot />
	</div>
</div>
