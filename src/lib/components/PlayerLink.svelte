<script lang="ts">
  import { getPlayerURL } from "$lib/urls";
  import PlayerProfile from "./PlayerProfile.svelte";
  import Popup from "./Popup.svelte";
  import type { DetailedPlayer, APIResponse } from "$lib/ranked-api";

  export let name = "";
  export let uuid = "";

  let anchor: Element | undefined;

  const load = async () => {
    return {
      playerData: fetch(getPlayerURL(name), {
        cache: "force-cache",
        headers: {
          "Cache-Control": "max-age=10, stale-while-revalidate=10",
        },
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
  href="/{name}"
  class="relative underline-offset-4 hover:underline"
>
  {name}
</a>
<Popup {anchor} hoverable {load} let:data>
  <div
    class="block overflow-clip rounded-3xl bg-zinc-800 p-2 shadow-lg shadow-black/50"
  >
    <PlayerProfile isLink playerData={data.playerData} />
  </div>
</Popup>
