<script>
  import { licenses } from "$lib/config";
</script>

<svelte:head>
  <title>Licenses | MCSR Ranked</title>
</svelte:head>

<div class="px-4 pb-32 pt-16">
  <div class="mx-auto max-w-7xl">
    <h1 class="text-4xl font-bold text-zinc-300">OSS Licenses</h1>
    <div class="h-8" />
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each licenses as license}
        <div
          class="flex flex-col space-y-1 rounded-lg bg-zinc-800 px-4 py-2 shadow-md"
        >
          <h2 class="text-lg font-bold text-zinc-300">{license.title}</h2>
          <p class="flex-1 text-sm text-zinc-400">{license.license}</p>
          <div class="flex gap-2">
            <a
              href={license.sourceLink}
              target="_blank"
              class="text-sm text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:text-zinc-300"
            >
              Source
            </a>
            <a
              href={license.licenseLink}
              target="_blank"
              class="text-sm text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:text-zinc-300"
            >
              License
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
