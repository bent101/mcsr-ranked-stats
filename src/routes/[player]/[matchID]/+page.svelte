<script lang="ts">
  import MatchDetails from "$lib/components/MatchDetails.svelte";
  export let data;
</script>

{#await data.match}
  <div class="absolute inset-0 grid place-items-center">
    <p class="animate-pulse text-lg font-semibold text-zinc-500">
      Loading match...
    </p>
  </div>
{:then match}
  <MatchDetails {match} />
{/await}
