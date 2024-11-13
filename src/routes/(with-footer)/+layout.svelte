<script>
  import { footerLinkGroups } from "$lib/config";
</script>

<div class="min-h-screen">
  <slot />
</div>
<footer class="bg-zinc-950 p-8 pb-4 text-sm text-zinc-500">
  <div class="flex items-center justify-center gap-16 md:gap-0">
    {#each footerLinkGroups as links}
      <div class="flex flex-col items-center md:flex-row">
        {#each links as { href, label }}
          {@const internal = href.startsWith("/")}
          <a
            {href}
            target={internal ? "" : "_blank"}
            rel="noopener noreferrer"
            class="relative flex items-center gap-1 px-4 py-2 decoration-zinc-800 underline-offset-4 hover:underline"
          >
            {label}
          </a>
        {/each}
      </div>
    {/each}
  </div>
  <p class="text-balance pt-4 text-center text-xs text-zinc-600">
    © 2022-24 MCSR Ranked. <span class="uppercase">
      This is not an official Minecraft product. Not approved by or associated
      with Mojang or Microsoft.
    </span>
  </p>
</footer>
