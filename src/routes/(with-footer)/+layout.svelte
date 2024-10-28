<script>
  import { footerLinks } from "$lib/config";
</script>

<div class="min-h-screen">
  <slot />
</div>
<footer class="px-4 py-12 bg-zinc-950 text-zinc-500">
  <div class="flex items-center justify-center">
    {#each footerLinks as { href, label }}
      <a
        {href}
        target="_blank"
        rel="noopener noreferrer"
        class="hover:underline underline-offset-4 px-4 py-2 decoration-zinc-800"
      >
        {label}
      </a>
    {/each}
  </div>
  <p class="text-center text-zinc-600 text-sm">
    © 2022-24 MCSR Ranked. This is not an official Minecraft product. Not
    approved by or associated with Mojang or Microsoft.
  </p>
</footer>
