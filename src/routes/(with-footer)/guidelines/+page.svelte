<script>
  import { guidelines } from "$lib/config";
</script>

<svelte:head>
  <title>Guidelines | MCSR Ranked</title>
</svelte:head>

<div class="px-4 pb-32 pt-8 sm:pt-16">
  <div class="mx-auto max-w-2xl">
    <h1 class="text-2xl font-bold text-zinc-300 sm:text-4xl">Guidelines</h1>
    <div class="h-8" />
    <ol class="list-decimal space-y-6 pl-4 text-base/relaxed text-zinc-600">
      {#each guidelines as rule}
        <li>
          <span
            class="text-zinc-400 decoration-zinc-700 underline-offset-2 [&>a]:text-zinc-500 [&>a]:underline"
          >
            {@html rule}
          </span>
        </li>
      {/each}
    </ol>
  </div>
</div>
