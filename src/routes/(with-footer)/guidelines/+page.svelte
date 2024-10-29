<script>
  import { guidelines } from "$lib/config";
</script>

<svelte:head>
  <title>Guidelines | MCSR Ranked</title>
</svelte:head>

<div class="px-4 pt-16 pb-32">
  <div class="mx-auto max-w-2xl">
    <h1 class="text-4xl text-zinc-300 font-bold">Guidelines</h1>
    <div class="h-8" />
    <ol class="list-decimal text-base/relaxed text-zinc-600 space-y-6 pl-4">
      {#each guidelines as rule}
        <li>
          <span
            class="text-zinc-400 [&>a]:text-zinc-500 [&>a]:underline underline-offset-2 decoration-zinc-700"
          >
            {@html rule}
          </span>
        </li>
      {/each}
    </ol>
  </div>
</div>
