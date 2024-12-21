<script lang="ts">
  import Badge from "$lib/components/Badge.svelte";
  import CopyBtn from "$lib/components/CopyBtn.svelte";
  import AppleIcon from "$lib/components/icons/AppleIcon.svelte";
  import DiscordIcon from "$lib/components/icons/DiscordIcon.svelte";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import LinuxIcon from "$lib/components/icons/LinuxIcon.svelte";
  import ListIcon from "$lib/components/icons/ListIcon.svelte";
  import WindowsIcon from "$lib/components/icons/WindowsIcon.svelte";
  import TooltipBtn from "$lib/components/TooltipBtn.svelte";
  import { downloads } from "$lib/config";
  import { Youtube } from "svelte-youtube-lite";
</script>

<svelte:head>
  <title>Download | MCSR Ranked</title>
</svelte:head>

<div class="px-4 pb-32 pt-8">
  <div class="mx-auto max-w-xl lg:max-w-7xl">
    <h1 class="text-4xl font-bold text-zinc-300">Download MCSR Ranked</h1>
    <div class="h-4" />
    <div class="flex flex-col-reverse gap-8 lg:flex-row">
      <div class="flex-1">
        <div class="step">
          <div class="step-number">
            <p>1</p>
            <div />
          </div>
          <div class="step-content">
            <p>Download, extract, and run <b>MultiMC</b></p>
            <a
              href="https://multimc.org/#Download"
              target="_blank"
              rel="noopener noreferrer"
              class="btn"
            >
              MultiMC Download <ExternalLinkIcon class="size-4" />
            </a>
          </div>
        </div>
        <div class="step">
          <div class="step-number">
            <p>2</p>
            <div />
          </div>
          <div class="step-content">
            <p>
              Click <strong>Add Instance</strong>
              <span class="text-zinc-500">&gt;</span>
              <strong><b>Import from zip</b></strong>
            </p>
            <div
              class="aspect-[1298/234] w-full overflow-hidden rounded-xl bg-white/5"
            >
              <img src="/import-from-zip-tab.png" alt="Import from zip" />
            </div>
          </div>
        </div>
        <div class="step">
          <div class="step-number">
            <p>3</p>
            <div />
          </div>
          <div class="step-content">
            <p>
              Copy a <b>download link</b> from below, paste it into MultiMC, and
              click OK
            </p>
            {#each downloads as download}
              <div class="flex gap-4 rounded-xl bg-zinc-800 p-2 pl-4 shadow-md">
                <div class="flex-1 space-y-1">
                  <div class="flex items-center gap-2">
                    <p class="text-lg font-semibold text-zinc-300">
                      {download.name}
                    </p>
                    {#if download.recommended}
                      <Badge>Recommended</Badge>
                    {/if}
                    <div class="flex-1" />
                    <div class="flex">
                      <CopyBtn
                        message={download.links.windows}
                        let:justCopied
                        let:copyMessage
                      >
                        <TooltipBtn
                          on:click={copyMessage}
                          tooltip={justCopied ? "Copied!" : "Copy Windows Link"}
                          class="rounded-full p-1 hover:bg-white/5"
                        >
                          <WindowsIcon class="size-6" />
                        </TooltipBtn>
                      </CopyBtn>
                      <CopyBtn
                        message={download.links.mac}
                        let:justCopied
                        let:copyMessage
                      >
                        <TooltipBtn
                          on:click={copyMessage}
                          tooltip={justCopied ? "Copied!" : "Copy Mac Link"}
                          class="rounded-full p-1 hover:bg-white/5"
                        >
                          <AppleIcon class="size-6" />
                        </TooltipBtn>
                      </CopyBtn>
                      <CopyBtn
                        message={download.links.linux}
                        let:justCopied
                        let:copyMessage
                      >
                        <TooltipBtn
                          on:click={copyMessage}
                          tooltip={justCopied ? "Copied!" : "Copy Linux Link"}
                          class="rounded-full p-1 hover:bg-white/5"
                        >
                          <LinuxIcon class="size-6" />
                        </TooltipBtn>
                      </CopyBtn>
                    </div>
                  </div>
                  <p class="text-pretty pr-2 text-sm">
                    {download.description}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        </div>
        <div class="step">
          <div class="step-number">
            <p>4</p>
            <div />
          </div>
          <div class="step-content">
            <div>
              <p>Launch the instance and <b>start playing!</b></p>
            </div>
            <p>
              Visit the <b>
                <span class="mr-0.5 inline-block">#</span>tech-help</b
              > Discord channel if you ran into any issues.
            </p>
            <div class="flex gap-2">
              <a
                href="https://mcsrranked.com/discord"
                target="_blank"
                rel="noopener noreferrer"
                class="btn"
              >
                <DiscordIcon class="size-5" />
                Join the Discord
              </a>
              <a href="/guidelines" class="btn">
                <ListIcon class="size-5" />
                Read the Guidelines
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 pb-7">
        <div
          class="sticky top-20 aspect-video w-full overflow-hidden rounded-lg bg-white/5"
        >
          <Youtube
            id="GsVgmR0q0fc"
            title="How To Install Ranked"
            thumbnail="maxresdefault"
          />
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div class="flex-1 border-t border-zinc-800" />
      <p class="text-sm font-bold text-zinc-600">OR</p>
      <div class="flex-1 border-t border-zinc-800" />
    </div>
    <div class="h-4" />
    <h2 class="text-2xl font-bold text-zinc-400">Download .jar only</h2>
    <p class=" text-pretty text-zinc-500">
      If you only want to download the mod file (.jar), go to the Modrinth page
      and download the most recent version.
    </p>
    <div class="h-4" />
    <a
      href="https://modrinth.com/mod/mcsr-ranked/versions"
      target="_blank"
      rel="noopener noreferrer"
      class="btn"
    >
      Download on Modrinth <ExternalLinkIcon class="size-4" />
    </a>
    <div class="h-4" />
    <!-- <div
      class="flex max-w-2xl items-start gap-2 text-pretty rounded-xl border border-zinc-800 p-2 text-sm text-zinc-500"
    >
      <InfoIcon class="size-6 shrink-0 text-zinc-600" />
      <p>
        Note that any other mods in your mods folder must be whilelisted on MCSR
        Ranked. Some popular mods like OptiFine are not whitelisted. Check the
        full list
        <a
          href="https://gist.github.com/RedLime/bb1d3f49a01ff43f21bc218da964cdd8"
          class="group inline-flex items-center gap-0.5 text-zinc-400 underline decoration-zinc-600 underline-offset-2 hover:decoration-zinc-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
          <ExternalLinkIcon
            class="size-[1em] text-zinc-600 group-hover:text-zinc-400"
          />
        </a>
      </p>
    </div> -->
  </div>
</div>

<style lang="postcss">
  b {
    @apply text-zinc-300;
  }

  .step {
    @apply flex gap-4 text-zinc-400;
  }

  .step-number {
    @apply flex shrink-0 flex-col items-center;
  }

  .step-number p {
    @apply grid size-12 place-items-center rounded-full bg-zinc-800 text-lg font-medium;
  }

  .step-number div {
    @apply w-px flex-1 bg-zinc-800;
  }

  .step:last-child .step-number div {
    @apply hidden;
  }

  .step-content {
    @apply flex-1 space-y-2 pb-7;
  }

  .btn {
    @apply inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700/50;
  }
</style>
