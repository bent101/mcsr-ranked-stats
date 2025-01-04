<script lang="ts">
  import Hoverable from "$lib/components/Hoverable.svelte";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import { formatTime } from "$lib/formatters";
  import { curDate } from "$lib/globals";
  import type { PlayoffsData, PlayoffsMatch } from "$lib/ranked-api.js";
  import { cn } from "$lib/utils.js";
  import { formatDate } from "date-fns";
  import type { Writable } from "svelte/store";

  export let match: PlayoffsMatch;
  export let playoffs: PlayoffsData;
  export let curHoveredPlayer: Writable<string | null>;
  export let curHoveredMatchId: Writable<number | null>;

  $: isTie =
    match.state === "DONE" &&
    match.participants[0]?.roundScore === match.participants[1]?.roundScore;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<Hoverable
  store={curHoveredMatchId}
  value={match.id}
  disabled={match.startTime == null}
  let:isHovered
>
  <div
    class={cn(
      "relative",
      match.name === "Grand Final" &&
        "gf-glow -m-px origin-left scale-[var(--gf-scale)] rounded-[0.4375rem] bg-gradient-to-bl from-light-green to-zinc-900 to-40% p-px",
    )}
  >
    {#if match.state === "ACTIVE" || (match.state === "SCHEDULED" && match.startTime < $curDate)}
      <a
        href="https://www.twitch.tv/feinberg"
        target="_blank"
        rel="noopener noreferrer"
        class={cn(
          "absolute inset-x-2 bottom-full flex items-center justify-center gap-1.5 rounded-t-md bg-red-500 px-2 py-px text-center text-xs font-bold tracking-wide text-white [text-shadow:1px_1px_1px_#0004] hover:bg-red-500/80",
        )}
      >
        <div class="relative h-2 w-2 shrink-0 rounded-full bg-white">
          <div class="absolute inset-0 animate-ping rounded-full bg-white" />
        </div>
        LIVE
        <ExternalLinkIcon class="size-4" />
      </a>
    {/if}
    {#if match.state === "SCHEDULED"}
      {#if match.startTime - $curDate <= 30 * 60 && !playoffs.matches.some((m) => m.state === "ACTIVE")}
        <a
          href="https://www.twitch.tv/feinberg"
          target="_blank"
          rel="noopener noreferrer"
          class={cn(
            "absolute inset-x-2 bottom-full flex items-center justify-center gap-1.5 rounded-t-md bg-red-500 px-2 py-px text-center text-xs tracking-wide text-white [text-shadow:1px_1px_1px_#0004] hover:bg-red-500/80",
          )}
        >
          Starting in {formatTime((match.startTime - $curDate) * 1000)}
          <ExternalLinkIcon class="size-4" />
        </a>
      {:else}
        <div
          class="absolute inset-x-2 bottom-full rounded-t-md bg-light-green/80 px-2 py-px text-center text-xs font-medium text-white [text-shadow:1px_1px_1px_#0004]"
        >
          {formatDate(new Date(1000 * match.startTime), "MMM d, h:mmaaa")}
        </div>
      {/if}
    {/if}
    {#if match.name === "Grand Final"}
      <div
        class="absolute inset-px -z-50 rounded-md bg-zinc-950/70 backdrop-blur-lg"
      ></div>
    {/if}
    {#if isHovered}
      <div
        class={cn(
          "pointer-events-none absolute inset-0 z-10 rounded-md bg-white/10",
          match.name === "Grand Final" && "rounded-[0.4375rem]",
        )}
      />
    {/if}
    {#if match.name === "Grand Final"}
      <h2
        class="pointer-events-none absolute inset-x-0 bottom-full pb-5 text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500"
      >
        Grand Finals
      </h2>
    {/if}
    {#each [0, 1] as i}
      {@const index = match.participants[i]?.player}
      {@const roundScore = match.participants[i]?.roundScore}
      {@const player = index === undefined ? null : playoffs.players[index]}
      {@const seed = index === undefined ? null : index + 1}
      {@const isWinner = !isTie && roundScore === match.maxRoundScore}
      {@const playerPlace = playoffs.results.find(
        (r) => r.player === index,
      )?.place}

      <Hoverable
        store={curHoveredPlayer}
        value={player?.uuid}
        disabled={player == null}
        let:isHovered
      >
        <div
          class={cn(
            "relative flex h-7 items-center gap-1 overflow-hidden",
            i === 0 ? "rounded-t-md" : "rounded-b-md",
            !player ? "bg-zinc-800/40" : "bg-zinc-800 shadow-md",
          )}
        >
          <div
            class={cn(
              "absolute inset-0",
              isWinner && "bg-gradient-to-l from-light-green/10 to-transparent",
              isHovered && "bg-white/15 text-zinc-100",
            )}
          />
          {#if player}
            <p class="w-5 shrink-0 text-right text-xs text-white/30">
              {seed}
            </p>
            <div class={cn("line-clamp-1 flex-1 py-1 text-sm")} translate="no">
              <span
                class={cn(
                  ["Grand Final", "3rd Place"].includes(match.name) &&
                    playerPlace != null &&
                    [1, 2, 3].includes(playerPlace) && [
                      "bg-gradient-to-l bg-clip-text text-transparent",
                      playerPlace === 1 && "from-yellow-200 to-amber-500",
                      playerPlace === 2 && "from-blue-100 to-slate-400",
                      playerPlace === 3 && "from-[#fdbda6] to-[#e27852]",
                    ],
                )}
              >
                {player.nickname}
              </span>
            </div>
            {#if match.state === "ACTIVE" || match.state === "DONE"}
              <div
                class={cn(
                  "flex h-full w-8 shrink-0 items-center justify-center text-lg font-bold",
                  isWinner
                    ? "bg-light-green/70 text-white [text-shadow:1px_1px_0px_#0004,1px_1px_2px_#0006,1px_1px_0px_#0004,1px_1px_0px_#0004]"
                    : "bg-white/5 text-zinc-400",
                )}
              >
                {roundScore}
              </div>
            {/if}
          {/if}
        </div>
      </Hoverable>
    {/each}
  </div>
</Hoverable>

<style>
  .gf-glow {
    box-shadow:
      2px -1px 4px hsla(var(--light-green), 10%),
      8px -4px 22px hsla(var(--light-green), 20%);
  }
</style>
