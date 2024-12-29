<script lang="ts">
  import PlayoffsPage from "./PlayoffsPage.svelte";
  export let data;
  $: ({ playoffs } = data);
</script>

<PlayoffsPage {playoffs} />
