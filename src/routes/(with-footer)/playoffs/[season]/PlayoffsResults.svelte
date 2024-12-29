<script lang="ts">
  import PlayerHead3D from "$lib/components/PlayerHead3D.svelte";
  import PlayerLink from "$lib/components/PlayerLink.svelte";
  import type { PlayoffsData } from "$lib/ranked-api";
  import { cn } from "$lib/utils";
  import type { Writable } from "svelte/store";
  import playoffs1 from "$lib/assets/playoffs_1.png";
  import playoffs2 from "$lib/assets/playoffs_2.png";
  import playoffs3 from "$lib/assets/playoffs_3.png";
  import Hoverable from "$lib/components/Hoverable.svelte";

  export let playoffsData: PlayoffsData;
  export let curHoveredPlayer: Writable<string | null>;
  $: ({ players, results } = playoffsData);
</script>

<div class="flex items-end justify-center gap-2 *:flex-1">
  {#each [1, 0, 2] as i}
    {@const result = results[i]}
    {@const player = players[result.player]}
    {@const name = player.nickname}
    {@const image = [playoffs1, playoffs2, playoffs3][i]}
    <!-- {@const name = "silverrruns"} -->

    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <Hoverable store={curHoveredPlayer} value={player.uuid} let:isHovered>
      <div class="flex flex-col items-center">
        <div class="relative">
          <img
            src={image}
            alt=""
            style="
						height: {i === 0 ? '6rem' : '4rem'};
						image-rendering: pixelated;
					"
          />
          <img
            src={image}
            alt=""
            class="absolute inset-0 -z-10 opacity-50"
            style="
						height: {i === 0 ? '6rem' : '4rem'};
						image-rendering: pixelated;
						filter: blur({i === 0 ? '0.5rem' : '0.4rem'})
					"
          />
          {#if i === 0}
            <img
              src={image}
              alt=""
              class="absolute inset-0 -z-10 opacity-80 transition-[scale] duration-300"
              style="
							height: 6rem;
							image-rendering: pixelated; 
							filter: blur(2rem); 
							scale: {isHovered ? 1.1 : 1};
						"
            />
          {/if}
        </div>
        <div
          style={i === 0
            ? "scale: 1.4; transform-origin: center; padding: 0.5rem;"
            : undefined}
        >
          <PlayerHead3D
            uuid={player.uuid}
            rotation={[
              { x: 9, y: 0 },
              { x: 0, y: -14 },
              { x: 0, y: 14 },
            ][i]}
          />
        </div>
        <div
          class={cn(
            "relative w-full border-4 bg-gradient-to-br pt-1",
            [
              "border-[#EBB331] from-[#c68711] to-[#FEF55F] text-[#fff185]",
              "border-[#DEDEDE] from-[#939b9d] to-[#FFFFFF] text-[#FFFFFF]",
              "border-[#AB593D] from-[#6D3422] to-[#E77D55] text-[#ff956f]",
            ][i],
          )}
          style="height: calc(4rem + {2 - i} * 2rem);"
        >
          <div
            class={cn(
              "absolute -inset-x-1 bottom-0 -z-10 bg-gradient-to-b from-transparent blur transition-[opacity,top] duration-300",
              ["to-[#EBB331]", "to-[#DEDEDE]", "to-[#AB593D]"][i],
              isHovered ? "-top-12 opacity-100" : "top-0 opacity-0",
            )}
          />

          <div
            class={cn(
              "w-full truncate text-center font-minecraft text-xs",
              name.length <= 11 && i === 0
                ? "text-lg"
                : name.length <= 13
                  ? "text-sm"
                  : "text-xs",
            )}
            style="text-shadow: 0 -1px 0 #0008, 0 0 3px #0007, 0 0 6px #0003;"
          >
            <PlayerLink {name} uuid={player.uuid} />
          </div>
          <div
            class={cn(
              "text-center font-bold",
              i === 0 ? "text-base" : "text-xs",
            )}
            style="text-shadow: 0 -1px 0 #0008, 0 0 2px #0007, 0 0 4px #0003;"
          >
            {result.prize.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            })}
          </div>
        </div>
      </div>
    </Hoverable>
  {/each}
</div>
<div class="h-2"></div>
<div>
  {#each [results[3]] as result}
    {@const player = players[result.player]}
    <Hoverable store={curHoveredPlayer} value={player.uuid} let:isHovered>
      <div
        class={cn(
          "relative flex items-center overflow-hidden rounded-lg pl-0.5 pr-4",
          isHovered ? "bg-zinc-800" : "hover:bg-zinc-800",
        )}
      >
        <div
          class="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent"
        ></div>
        <div class="-m-2.5 scale-[0.45]">
          <PlayerHead3D uuid={player.uuid} />
        </div>
        <div class="flex-1 font-medium text-zinc-400">
          <PlayerLink name={player.nickname} uuid={player.uuid} />
        </div>
        <div class="text-zinc-500">4<small>th</small></div>
      </div>
    </Hoverable>
  {/each}
  <div class="h-2"></div>
  <div class="grid grid-flow-col grid-cols-2 grid-rows-6">
    {#each results.slice(4) as result}
      {@const player = players[result.player]}
      <Hoverable store={curHoveredPlayer} value={player.uuid} let:isHovered>
        <div
          class={cn(
            "flex items-center gap-2 rounded-lg px-2 py-1",
            isHovered ? "bg-zinc-800" : "hover:bg-zinc-800",
          )}
        >
          <div class="text-zinc-600">
            {result.place}<small>th</small>
          </div>
          <div>
            <PlayerLink name={player.nickname} uuid={player.uuid} />
          </div>
        </div>
      </Hoverable>
    {/each}
  </div>
</div>
