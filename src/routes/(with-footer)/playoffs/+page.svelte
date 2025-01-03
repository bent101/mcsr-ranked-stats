<script lang="ts">
  import PlayoffsPage from "./[season]/PlayoffsPage.svelte";
  export let data;
  $: ({ playoffs } = data);
</script>

<PlayoffsPage realPlayoffs={playoffs} />
