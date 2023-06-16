<script lang="ts">
	import PlayerProfile from "$lib/components/PlayerProfile.svelte";

	export let data;
</script>

<PlayerProfile playerData={data.player1} />
<PlayerProfile playerData={data.player2} />
