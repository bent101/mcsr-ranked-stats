<script lang="ts">
  import { page } from "$app/stores";

  $: translateAndPadding = $page.params.matchID
    ? "translate-y-0 pb-0"
    : "translate-y-[29rem] pb-[29rem]";
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-0 z-10">
  <div
    class="{translateAndPadding} pointer-events-auto relative mx-auto h-[35rem] w-[35rem] rounded-t-3xl bg-zinc-800 shadow-lg shadow-black/30 transition-transform duration-300 md:mr-4 2xl:ml-[52rem] 2xl:w-[43rem] 3xl:w-[52rem]"
  >
    <slot />
  </div>
</div>
