<script lang="ts">
	import "../app.css";
	import Leaderboard from "./Leaderboard.svelte";
	import { navigating } from "$app/stores";
	import Loading from "./Loading.svelte";
	export let data;
</script>

<!-- {JSON.stringify($navigating)} -->
<Loading />
<div class="mx-auto flex">
	<div
		class="sticky top-0 h-screen overflow-y-scroll overscroll-y-contain scrollbar-thin scrollbar-track-zinc-950 scrollbar-thumb-zinc-900 [direction:rtl] hover:scrollbar-thumb-zinc-800">
		<div class="h-full [direction:ltr]">
			<Leaderboard lb={data.lb?.users} />
		</div>
	</div>
	<div class="flex-1">
		<slot />
	</div>
</div>
