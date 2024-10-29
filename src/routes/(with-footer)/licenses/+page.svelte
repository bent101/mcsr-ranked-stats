<script>
  import { licenses } from "$lib/config";
</script>

<svelte:head>
  <title>Licenses | MCSR Ranked</title>
</svelte:head>

<div class="px-4 pt-16 pb-32">
  <div class="mx-auto max-w-7xl">
    <h1 class="text-4xl text-zinc-300 font-bold">OSS Licenses</h1>
    <div class="h-8" />
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {#each licenses as license}
        <div class="rounded-lg bg-zinc-800 shadow-md px-4 py-2">
          <h2 class="text-lg text-zinc-300 font-bold">{license.title}</h2>
          <p class="text-zinc-400 text-sm mt-1">{license.license}</p>
          <div class="flex gap-2 mt-2">
            <a
              href={license.sourceLink}
              target="_blank"
              class="text-zinc-400 text-sm hover:text-zinc-300 underline underline-offset-2 decoration-zinc-600"
            >
              Source
            </a>
            <a
              href={license.licenseLink}
              target="_blank"
              class="text-zinc-400 text-sm hover:text-zinc-300 underline underline-offset-2 decoration-zinc-600"
            >
              License
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
