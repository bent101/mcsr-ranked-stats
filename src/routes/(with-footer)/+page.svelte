<script lang="ts">
  import ChevronDownIcon from "$lib/components/icons/ChevronDownIcon.svelte";
  import RankedSvg from "$lib/components/icons/RankedSvg.svelte";
  import TitleSvg from "$lib/components/icons/TitleSvg.svelte";
  import { cn } from "$lib/utils";
  import { onMount } from "svelte";

  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  let scrollY = 0;
  let windowHeight = 0;

  $: scrollPercent = (scrollY / windowHeight) * 100;

  const cards = [
    {
      title: "Ranked Mode",
      description:
        "Race in a Minecraft speedrun against an opponent of similar skill, in the same seed and at the same time. Put your elo on the line to climb the ranks!",
      image: "/brent-village.jpeg",
      imagePosition: "object-center",
      bullets: [
        "<b>Every seed has a good overworld and nether</b> &ndash; great for learning and fast-paced for pros",
        "<b>Standardized piglin trades, blaze drops, and more</b> even the playing field",
        "<b>Match replays and player statistics</b> let you learn from every game and track your progress",
      ],
    },
    {
      title: "Private Rooms",
      description:
        "Practice with friends, host tournaments, or try new categories in private rooms of up to 32 players!",
      image: "/couri-bastion.jpeg",
      imagePosition: "object-center",
      bullets: [
        "Play random, filtered, or set seeds",
        "Customize game rules and speedrun categories",
        "Perfect for community events or practice sessions",
      ],
    },
    {
      title: "Weekly Race",
      description:
        "With a separate leaderboard and a new seed handpicked every week, Weekly Race brings set seed speedrunning to MCSR Ranked.",
      image: "/dolphin-rp.jpeg",
      imagePosition: "object-center",
      bullets: [
        "Refine your route and push your time lower throughout the week",
        "Watch the fastest runners' replays or race their ghosts",
        "Uses the same RNG standardization as Ranked Mode",
      ],
    },
    {
      title: "MCSR Ranked Playoffs",
      description:
        "Watch the 16 best speedrunners in the world compete live for a $2,000+ prize pool!",
      image: "/dying-dragon.jpeg",
      imagePosition: "object-center",
      bullets: [
        "Twelve spots go to the highest-scoring players across the season, with four more up for grabs in the last-chance qualifier",
        "The tournament is a single-elimination best of 5 bracket, and best of 7 for Grand Finals",
      ],
    },
  ];
</script>

<svelte:window bind:scrollY bind:innerHeight={windowHeight} />

<div
  class="relative flex min-h-screen flex-col items-center justify-center px-4 pb-32 pt-16"
>
  <div class="absolute inset-0 -z-10 overflow-hidden">
    <img
      src="/bg-small.jpeg"
      alt=""
      class="h-full w-full object-cover will-change-transform"
      style={`transform: translateY(${scrollPercent * 4}px);`}
    />
  </div>
  <div
    class={cn(
      "absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-zinc-950 to-[100%]",
    )}
    style={`backdrop-filter: blur(${0.3 + (scrollPercent * 8) / 1000}vw)`}
  />
  <p
    class={cn(
      "font-bold text-white/50 transition-[transform,opacity,tracking] duration-[1.3s]",
      mounted
        ? "tracking-[0.3em] opacity-100"
        : "translate-y-4 tracking-[0.25em] opacity-0",
    )}
  >
    WELCOME TO
  </p>
  <div class="h-4" />
  <div
    class={cn(
      "flex gap-3 transition-[transform,opacity] delay-[0.25s] duration-[1.3s] *:h-36",
      mounted ? "opacity-100" : "translate-y-4 opacity-0",
    )}
  >
    <TitleSvg />
    <RankedSvg class="origin-top-left scale-[1.054]" />
    <div class="sr-only">Minecraft Speedrunning Ranked</div>
  </div>
  <div class="h-8" />
  <div
    class={cn(
      "flex gap-3 transition-all delay-[0.45s] duration-[1.3s]",
      mounted ? "opacity-100" : "translate-y-4 opacity-0",
    )}
  >
    <a href="/download" class="group relative block h-16 w-44">
      <div
        class="absolute bottom-1 left-0 right-1 top-0 bg-white transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
      ></div>
      <div class="absolute bottom-0 left-1 right-0 top-1 bg-white"></div>
      <div
        class="absolute bottom-2 left-1 right-2 top-1 bg-dark-green transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
      ></div>
      <div class="absolute bottom-1 left-2 right-1 top-2 bg-dark-green"></div>
      <div
        class="absolute bottom-3 left-2 right-3 top-2 flex items-center justify-center transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-light-green"
      >
        <span class="font-extrabold tracking-widest text-white">DOWNLOAD</span>
      </div>
    </a>
  </div>

  <div
    class={cn(
      "pointer-events-none absolute inset-0 bg-black transition-opacity duration-[1.3s]",
      mounted ? "opacity-20" : "opacity-100",
    )}
  />
  <div
    class={cn(
      "absolute inset-x-0 bottom-4 transition-[transform,opacity] delay-[0.8s] duration-[1.3s]",
      mounted ? "opacity-100" : "translate-y-4 opacity-0",
    )}
  >
    <button
      on:click={() =>
        window.scrollTo({ top: windowHeight, behavior: "smooth" })}
      class="group mx-auto flex flex-col items-center font-bold tracking-widest text-white/25 transition-colors duration-200 hover:text-white/30"
      style="opacity: {100 - scrollPercent * 2}%"
    >
      <p>LEARN MORE</p>
      <ChevronDownIcon
        class="size-8 transition-transform duration-200 group-hover:translate-y-px"
      />
    </button>
  </div>
</div>
<div class="-z-10 h-16 bg-[#070709]"></div>
<div class="relative min-h-screen-minus-header">
  <div>
    {#each cards as card, i}
      <article
        class={cn(
          "relative flex min-h-[300px] flex-col backdrop-blur-lg md:flex-row md:odd:flex-row-reverse",
        )}
      >
        <div class="relative h-64 w-full md:h-auto md:w-[calc(50%+1rem)]">
          <img
            src={card.image}
            alt=""
            class={cn(
              "absolute inset-0 size-full select-none object-cover opacity-50 blur-xl",
              card.imagePosition,
            )}
          />
          <img
            src={card.image}
            alt=""
            class={cn(
              "absolute inset-0 size-full select-none object-cover ",
              card.imagePosition,
            )}
          />
        </div>
        <div class="relative flex-1 p-4 pb-16 text-white/50 md:p-8">
          <div class="absolute inset-0 -z-10 overflow-hidden">
            <img
              src={card.image}
              alt=""
              class="size-[400%] select-none object-cover blur-xl"
            />
            <div class="absolute inset-0 bg-zinc-900/90" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white/80">{card.title}</h2>
            <p class="mt-1">{card.description}</p>
            <ul class="list-disc space-y-3 pl-4 pt-6">
              {#each card.bullets as bullet}
                <li class="marker:text-white/20 [&>b]:text-white/70">
                  {@html bullet}
                </li>
              {/each}
            </ul>
          </div>
        </div>
      </article>
    {/each}
  </div>

  <div class="flex justify-center gap-4 pt-8">
    <a
      href="/download"
      class="rounded-lg bg-dark-green px-6 py-3 font-bold text-white transition-colors hover:bg-light-green"
    >
      Play Now
    </a>
    <a
      href="/stats"
      class="rounded-lg bg-zinc-800 px-6 py-3 font-bold text-white transition-colors hover:bg-zinc-700"
    >
      View Leaderboards
    </a>
    <a
      href="https://discord.gg/mcsr"
      class="rounded-lg bg-zinc-800 px-6 py-3 font-bold text-white transition-colors hover:bg-zinc-700"
    >
      Join Discord
    </a>
  </div>
</div>

<style>
  img {
    @apply select-none;
  }
</style>
