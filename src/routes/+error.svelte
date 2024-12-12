<script>
  import Footer from "$lib/components/Footer.svelte";
  import { page } from "$app/stores";
  $: player = $page.params.player;
</script>

<div class="grid h-screen-minus-header place-items-center">
  <div class="text-xl font-semibold text-zinc-500">
    <div class="flex items-center">
      <div class="mr-8 text-5xl text-zinc-700">
        {$page.status}
      </div>
      <div class="text-3xl">{$page.error?.message}</div>
    </div>
  </div>
</div>
<Footer />
