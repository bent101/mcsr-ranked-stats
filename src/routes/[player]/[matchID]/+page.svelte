<script lang="ts">
	import MatchDetails from "./MatchDetails.svelte";
	export let data;
</script>

{#if data.match}
	<MatchDetails match={data.match} />
{:else}
	<div class="p-12 text-center text-zinc-500">Click a match to see its details</div>
{/if}
