<script lang="ts">
  import MatchDetails from "$lib/components/MatchDetails.svelte";
  export let data;
</script>

<MatchDetails match={data.match} hideAllTimeRank hideSeasonRank />
