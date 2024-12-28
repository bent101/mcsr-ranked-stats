<script lang="ts" generics="T extends string">
  import { cn } from "$lib/utils";
  import { onpress } from "$lib/actions";

  export let tabs: readonly T[];
  export let currentTab: T;
  export let onSwitch: ((oldTab: T, newTab: T) => void) | undefined = undefined;
  export let spaceEvenly: boolean = false;
</script>

<div class={cn("flex", spaceEvenly && "*:flex-1")}>
  {#each tabs as tab}
    <div
      class={cn(
        "py-1",
        tab === currentTab
          ? "border-b-2 border-zinc-400 text-zinc-400"
          : "border-b border-white/5 text-zinc-500",
      )}
    >
      <button
        class={cn(
          "w-full rounded-md px-3 py-1.5 text-sm font-medium hover:bg-white/5",
        )}
        use:onpress={() => {
          onSwitch?.(currentTab, tab);
          currentTab = tab;
        }}
      >
        {tab}
      </button>
    </div>
  {/each}
  {#if !spaceEvenly}
    <div class="flex-1 border-b border-white/5" />
  {/if}
</div>
