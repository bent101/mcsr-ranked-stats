<script lang="ts">
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import importFromZip from "$lib/assets/import-from-zip.png";
  import MultiSwitch from "$lib/components/MultiSwitch.svelte";
  import { downloads } from "$lib/config";
  import Badge from "$lib/components/Badge.svelte";
  import CopyBtn from "$lib/components/CopyBtn.svelte";

  let selectedOS: "Windows" | "Mac" | "Linux" = "Windows";
</script>

<svelte:head>
  <title>Download | MCSR Ranked</title>
</svelte:head>

<div class="px-4 py-16">
  <div class="mx-auto max-w-7xl">
    <h1 class="text-4xl text-zinc-300 font-bold">Download</h1>
    <div class="h-4" />
    <div class="flex flex-col-reverse xl:flex-row gap-8">
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
              Add Instance &gt; <b>Import from zip</b>
            </p>
            <img
              src={importFromZip}
              alt="Import from zip"
              class="rounded-md max-w-sm"
            />
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
              {@const link = download.links[selectedOS]}
              <div class="bg-zinc-800 rounded-xl shadow-md p-2 pl-4">
                <div class="flex items-center justify-between gap-1">
                  <p class="text-zinc-300 font-medium">{download.name}</p>
                  {#if download.recommended}
                    <Badge>Recommended</Badge>
                  {/if}
                </div>
                <p class="text-sm">Includes basic mods for MCSR Ranked</p>
                <div class="flex justify-end">
                  <CopyBtn message={link} let:justCopied></CopyBtn>
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
              <a href="/guidelines" class="btn"> Read the Guidelines </a>
              <a
                href="https://mcsrranked.com/discord"
                target="_blank"
                rel="noopener noreferrer"
                class="btn"
              >
                Join the Discord
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/GsVgmR0q0fc"
          title="Youtube Player"
          class="mx-auto mt-4 rounded-lg"
          allowFullScreen
        />
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
