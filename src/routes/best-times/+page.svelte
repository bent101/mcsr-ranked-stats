<script lang="ts">
	import Switch from "$lib/Switch.svelte";

	export let data;
	let showingAll = true;
</script>

<div class="mx-auto max-w-4xl p-16">
	<h1 class="pb-16 text-xl font-bold text-zinc-300">
		Fastest times this season
		<span class="ml-2 inline-block -translate-y-px">
			<Switch options={["all", "unique"]} bind:onFirst={showingAll} />
		</span>
	</h1>
</div>
