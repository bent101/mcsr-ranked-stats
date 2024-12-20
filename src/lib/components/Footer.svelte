<script>
  import { footerLinkGroups, socialLinks } from "$lib/config";
</script>

<footer class="bg-zinc-950 p-8 pb-4 text-sm text-zinc-500">
  <div class="flex flex-col items-center justify-center lg:flex-row lg:gap-20">
    <div class="flex items-center">
      <p class="mr-2 text-nowrap text-lg font-semibold text-zinc-500">
        MCSR Ranked
      </p>
      {#each socialLinks as { href, icon, label }}
        <a
          {href}
          target="_blank"
          rel="noopener noreferrer"
          class="p-1 text-zinc-600 hover:text-zinc-400"
          aria-label={label}
        >
          <svelte:component this={icon} class="size-6" />
        </a>
      {/each}
    </div>
    <div class="flex">
      {#each footerLinkGroups as links}
        <div class="flex flex-col items-center pt-2 sm:flex-row sm:pt-0">
          {#each links as { href, label }}
            {@const internal = href.startsWith("/")}
            <a
              {href}
              target={internal ? "" : "_blank"}
              rel="noopener noreferrer"
              class="relative flex items-center gap-1 text-nowrap px-2.5 py-1 decoration-zinc-700 underline-offset-4 hover:underline"
            >
              {label}
            </a>
          {/each}
        </div>
      {/each}
    </div>
  </div>
  <p class="text-balance pt-4 text-center text-xs text-zinc-600">
    © 2022-24 MCSR Ranked. <span class="uppercase">
      This is not an official Minecraft product. Not approved by or associated
      with Mojang or Microsoft.
    </span>
  </p>
</footer>
