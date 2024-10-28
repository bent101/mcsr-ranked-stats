<script>
  import { footerLinkGroups } from "$lib/config";
</script>

<div class="min-h-screen">
  <slot />
</div>
<footer class="p-8 pb-4 bg-zinc-950 text-zinc-500 text-sm">
  <div class="flex items-center justify-center gap-16 md:gap-0">
    {#each footerLinkGroups as links}
      <div class="flex flex-col items-center md:flex-row">
        {#each links as { href, label }}
          <a
            {href}
            target="_blank"
            rel="noopener noreferrer"
            class="hover:underline relative underline-offset-4 px-4 py-2 flex items-center gap-1 decoration-zinc-800"
          >
            {label}
          </a>
        {/each}
      </div>
    {/each}
  </div>
  <p class="text-center text-zinc-600 text-xs pt-4 text-balance">
    © 2022-24 MCSR Ranked. <span class="uppercase">
      This is not an official Minecraft product. Not approved by or associated
      with Mojang or Microsoft.
    </span>
  </p>
</footer>
