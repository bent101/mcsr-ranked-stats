<script lang="ts">
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import importFromZipTab from "$lib/assets/import-from-zip-tab.png";
  import { downloads } from "$lib/config";
  import Badge from "$lib/components/Badge.svelte";
  import CopyBtn from "$lib/components/CopyBtn.svelte";
  import LinuxIcon from "$lib/components/icons/LinuxIcon.svelte";
  import TooltipBtn from "$lib/components/TooltipBtn.svelte";
  import WindowsIcon from "$lib/components/icons/WindowsIcon.svelte";
  import AppleIcon from "$lib/components/icons/AppleIcon.svelte";
  import { Youtube } from "svelte-youtube-lite";
  import ListIcon from "$lib/components/icons/ListIcon.svelte";
  import DiscordIcon from "$lib/components/icons/DiscordIcon.svelte";

  const buttons: Record<
    (typeof downloads)[number]["name"],
    Record<keyof (typeof downloads)[number]["links"], Element | undefined>
  > = {
    "Normal Pack": {
      linux: undefined,
      windows: undefined,
      mac: undefined,
    },
    "Pro Pack": {
      linux: undefined,
      windows: undefined,
      mac: undefined,
    },
    "All-in Pack": {
      linux: undefined,
      windows: undefined,
      mac: undefined,
    },
  };
</script>

<svelte:head>
  <title>Download | MCSR Ranked</title>
</svelte:head>

<div class="px-4 py-16">
  <div class="mx-auto max-w-xl lg:max-w-7xl">
    <h1 class="text-4xl text-zinc-300 font-bold">Download</h1>
    <div class="h-4" />
    <div class="flex flex-col-reverse lg:flex-row gap-8">
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
              class="w-full rounded-xl overflow-hidden bg-white/5 aspect-[1298/311]"
            >
              <img src={importFromZipTab} alt="Import from zip" />
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
              Copy a <b>download link</b> from below and paste it into MultiMC
            </p>
            {#each downloads as download}
              <div class="bg-zinc-800 rounded-xl shadow-md p-2 pl-4 flex gap-4">
                <div class="flex-1 space-y-1">
                  <div class="flex items-center gap-2">
                    <p class="text-zinc-300 font-medium">{download.name}</p>
                    {#if download.recommended}
                      <Badge>Recommended</Badge>
                    {/if}
                  </div>
                  <p class="text-sm text-pretty">
                    {@html download.description}
                  </p>
                </div>
                <div class="flex flex-col">
                  <CopyBtn
                    message={download.links.linux}
                    let:justCopied
                    let:copyMessage
                  >
                    <TooltipBtn
                      on:click={copyMessage}
                      tooltip={justCopied ? "Copied!" : "Copy Linux Link"}
                      class="rounded-full hover:bg-white/5 p-1"
                    >
                      <LinuxIcon class="size-6" />
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
                      class="rounded-full hover:bg-white/5 p-1"
                    >
                      <AppleIcon class="size-6" />
                    </TooltipBtn>
                  </CopyBtn>
                  <CopyBtn
                    message={download.links.windows}
                    let:justCopied
                    let:copyMessage
                  >
                    <TooltipBtn
                      on:click={copyMessage}
                      tooltip={justCopied ? "Copied!" : "Copy Windows Link"}
                      class="rounded-full hover:bg-white/5 p-1"
                    >
                      <WindowsIcon class="size-6" />
                    </TooltipBtn>
                  </CopyBtn>
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
            <p>Click OK, launch the instance, and <b>start playing!</b></p>
            <div class="flex gap-2">
              <a href="/guidelines" class="btn">
                <ListIcon class="size-5" />
                Read the Guidelines
              </a>
              <a
                href="https://mcsrranked.com/discord"
                target="_blank"
                rel="noopener noreferrer"
                class="btn"
              >
                <DiscordIcon class="size-5" />
                Join the Discord
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div
          class="sticky bg-white/5 rounded-lg overflow-hidden top-20 w-full aspect-video"
        >
          <Youtube
            id="GsVgmR0q0fc"
            title="How To Install Ranked"
            thumbnail="maxresdefault"
          />
        </div>
      </div>
    </div>
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
    @apply shrink-0 flex flex-col items-center;
  }

  .step-number p {
    @apply grid place-items-center rounded-full size-12 text-lg bg-zinc-800 font-medium;
  }

  .step-number div {
    @apply w-px bg-zinc-800 flex-1;
  }

  .step:last-child .step-number div {
    @apply hidden;
  }

  .step-content {
    @apply flex-1 space-y-2 pb-10;
  }

  .btn {
    @apply rounded-md border inline-flex items-center gap-2 hover:bg-zinc-700/50 border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium;
  }
</style>
