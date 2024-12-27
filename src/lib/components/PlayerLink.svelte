<script lang="ts">
  import type { APIResponse, DetailedPlayer } from "$lib/ranked-api";
  import { getPlayerURL } from "$lib/urls";
  import { cn } from "$lib/utils";
  import PlayerProfile from "./PlayerProfile.svelte";
  import Popup from "./Popup.svelte";

  export let name = "";
  export let uuid: string | null = null;

  let anchor: Element | undefined;

  const load = async () => {
    return {
      playerData: await fetch(getPlayerURL(uuid ?? name), {
        // cache: "force-cache",
        // headers: {
        //   "Cache-Control": "max-age=10, stale-while-revalidate=10",
        // },
      })
        .then((res) => res.json() as APIResponse<DetailedPlayer>)
        .then((res) => res.data),
    };
  };
</script>

<a
  bind:this={anchor}
  data-sveltekit-replacestate="off"
  data-sveltekit-noscroll="off"
  href={uuid ? `/stats/${uuid}` : `/stats/${name}`}
  {...$$props}
  class={cn(
    "pointer-events-auto relative underline-offset-4 hover:underline",
    $$props.class,
  )}
  translate="no"
>
  {name}
</a>
<Popup {anchor} hoverable {load} let:data>
  <div
    class="block overflow-clip rounded-3xl bg-zinc-800 p-2 shadow-[2px_2px_16px_0px_rgba(0,0,0,0.3),1px_1px_5px_0px_rgba(0,0,0,0.3)]"
  >
    <PlayerProfile isLink playerData={data?.playerData} />
  </div>
</Popup>
