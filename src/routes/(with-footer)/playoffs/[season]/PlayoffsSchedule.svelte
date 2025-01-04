<script lang="ts">
  import PlayerLink from "$lib/components/PlayerLink.svelte";
  import type { PlayoffsData } from "$lib/ranked-api";
  import { cn, groupByDivideCondition } from "$lib/utils";
  import { formatDate, getMinutes } from "date-fns";
  import { type Writable } from "svelte/store";
  import Hoverable from "$lib/components/Hoverable.svelte";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import { formatTime } from "$lib/formatters";
  import { curDate } from "$lib/globals";

  export let playoffsData: PlayoffsData;
  export let curHoveredPlayer: Writable<string | null>;
  export let curHoveredMatchId: Writable<number | null>;
  $: ({ players, matches, results } = playoffsData);
  $: scheduleDays = groupByDivideCondition(
    matches
      .filter((m) => m.startTime !== null)
      .toSorted((a, b) => a.startTime - b.startTime),
    (a, b) => b.startTime - a.startTime > 8 * 60 * 60,
  );
</script>

<div class="space-y-4">
  {#each scheduleDays as dayMatches}
    {@const start = new Date(1000 * dayMatches[0].startTime)}
    <div>
      <h3 class="pb-1 pl-4 text-xl font-bold text-zinc-300">
        {formatDate(start, "EEE, MMM dd")}
        <span class="text-zinc-600">{formatDate(start, "yyyy")}</span>
      </h3>
      {#each dayMatches as match}
        {@const player1 =
          match.participants[0]?.player != null
            ? players[match.participants[0].player]
            : null}
        {@const player2 =
          match.participants[1]?.player != null
            ? players[match.participants[1].player]
            : null}
        {@const player1Won =
          match.participants[0]?.roundScore === match.maxRoundScore}
        {@const player2Won =
          match.participants[1]?.roundScore === match.maxRoundScore}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <Hoverable store={curHoveredMatchId} value={match.id} let:isHovered>
          <div
            class={cn(
              "flex items-center rounded-lg px-4 py-1.5",
              isHovered ? "bg-zinc-800" : "hover:bg-zinc-800",
            )}
          >
            <div class="flex-1 truncate text-zinc-400">
              {#if !player1 || !player2}
                <span class="text-zinc-400">{match.name}</span>
              {:else}
                <span
                  class={cn("inline-block", player1Won && "text-light-green")}
                >
                  <PlayerLink name={player1.nickname} uuid={player1.uuid} />
                </span>
                <span class="inline-block text-zinc-500">vs</span>
                <span class={cn(player2Won && "text-light-green")}>
                  <PlayerLink name={player2.nickname} uuid={player2.uuid} />
                </span>
              {/if}
            </div>
            {#if match.state === "DONE"}
              <div
                class="w-max shrink-0 px-2 font-medium tabular-nums text-zinc-500"
              >
                {match.participants[0].roundScore}<span
                  class="inline-block px-1 text-zinc-600">&ndash;</span
                >{match.participants[1].roundScore}
              </div>
            {/if}
            <div
              class="w-16 shrink-0 text-right text-zinc-500 min-[500px]:w-20"
            >
              {#if match.state === "ACTIVE"}
                <a
                  href="https://www.twitch.tv/feinberg"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-end gap-1.5 text-red-500"
                >
                  <div
                    class="relative h-2 w-2 shrink-0 rounded-full bg-red-500"
                  >
                    <div
                      class="absolute inset-0 animate-ping rounded-full bg-red-500"
                    />
                  </div>
                  <div class="text-xs font-bold">LIVE</div>
                  <ExternalLinkIcon class="size-4" />
                </a>
                <!-- {:else if match.state === "SCHEDULED" && match.startTime - $curDate <= 30 * 60 && !matches.some((m) => m.state === "ACTIVE")}
                <a
                  href="https://www.twitch.tv/feinberg"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center justify-end gap-1.5 text-red-500"
                >
                  {formatTime((match.startTime - $curDate) * 1000)}
                  <ExternalLinkIcon class="size-4" />
                </a> -->
              {:else}
                {formatDate(
                  new Date(1000 * match.startTime),
                  getMinutes(new Date(1000 * match.startTime)) === 0
                    ? "haaa"
                    : "h:mmaaa",
                )}
              {/if}
            </div>
          </div>
        </Hoverable>
      {/each}
    </div>
  {/each}
</div>
