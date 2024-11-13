<script lang="ts">
  import SidebarTab from "$lib/components/SidebarTab.svelte";

  export let lb: {
    name: string;
    elo: string;
    rank: string;
    uuid: string;
    href: string;
    selected: boolean;
    arrowSelected: boolean;
  }[];
</script>

{#each lb as { name, elo, rank, uuid, href, selected, arrowSelected } (uuid)}
  <SidebarTab {href} {selected} {arrowSelected}>
    <div
      class=" w-12 px-2 text-right font-extrabold {selected
        ? 'text-zinc-400'
        : 'text-zinc-700 group-hover:text-zinc-400'}"
    >
      {rank}
    </div>
    <div
      class="flex-1 px-2 text-center {selected
        ? ' text-zinc-300'
        : 'text-zinc-400 group-hover:text-zinc-300'}"
    >
      {name}
    </div>
    <div
      class=" w-16 px-2 font-semibold {selected
        ? 'text-zinc-500'
        : ' text-zinc-600  group-hover:text-zinc-500'}"
    >
      {elo}
    </div>
  </SidebarTab>
{/each}
