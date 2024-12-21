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
      name: "Ranked Mode",
      title: "Put your elo on the line",
      description:
        "Race an opponent head-to-head in a Minecraft speedrun in separate worlds but on the same seed!",
      image: "/ranked-mode.jpeg",
      imagePosition: "object-center",
      background: "/ender-eye.png",
      bullets: [
        "<b>Every seed has a good overworld and nether</b>, making it fast-paced and great for learning",
        "<b>Standardized piglin trades, blaze drops, and more</b> even the playing field",
        "<b>Keep pace with your opponent</b> with live advancements and an overlay showing their split",
        "<b>Match replays and player statistics</b> let you learn from every game and track your progress",
      ],
    },
    {
      name: "Private Rooms",
      title: "Craft your gameplay",
      description:
        "Try new categories, host tournaments, or practice with friends in private rooms of up to 33 players!",
      image: "/private-rooms.png",
      imagePosition: "object-bottom",
      background: "/crafting-table.png",
      bullets: [
        "Play random, filtered, or set seeds",
        "Customize game rules and speedrun categories",
        "View live advancements, splits, and chat messages of all players",
      ],
    },
    {
      name: "Weekly Race",
      title: "A new seed every week",
      description:
        "With a separate leaderboard and a new seed handpicked every week, Weekly Race brings set seed speedrunning to MCSR Ranked.",
      image: "/dolphin-rp.jpeg",
      imagePosition: "object-center",
      background: "/map-item.png",
      backgroundClass: "[image-rendering:pixelated] opacity-[0.03]",
      bullets: [
        "Refine your route and push your time lower throughout the week",
        "Learn from the best – watch the fastest runners' replays or race their ghosts",
        "Get the same flint drops, piglin trades, and blaze rates every run thanks to the same seed-based RNG as Ranked Mode",
      ],
    },
    {
      name: "MCSR Ranked Playoffs",
      title: "$5,000 prize pool. 16 runners. 1 champion.",
      description:
        "Watch the best runners in the world compete live for a $5,000 prize pool in our seasonal championship!",
      image: "/dying-dragon.jpeg",
      imagePosition: "object-center",
      background: "/playoffs-trophy.png",
      backgroundClass: "[image-rendering:pixelated] w-56 -bottom-16",
      bullets: [
        "Twelve spots go to the highest-scoring players across the season, with four more up for grabs in the last-chance qualifier",
        "The tournament is a single-elimination Bo5 bracket, culminating in a Bo7 Grand Finals",
      ],
    },
  ];
</script>

<svelte:window bind:scrollY bind:innerHeight={windowHeight} />

<div
  class="relative flex min-h-[calc(100svh+8rem)] flex-col items-center justify-center px-4 pb-32 pt-16"
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
  <div
    class={cn(
      "flex w-full max-w-2xl items-start gap-2 transition-[transform,opacity] delay-[0.25s] duration-[1.3s]",
      mounted ? "opacity-100" : "translate-y-4 opacity-0",
    )}
  >
    <TitleSvg class="flex-[462]" />
    <RankedSvg class="flex-[157] origin-top-left" />
    <div class="sr-only">Minecraft Speedrunning Ranked</div>
  </div>
  <div class="h-8" />
  <div
    class={cn(
      "flex gap-3 transition-[transform,opacity] delay-[0.45s] duration-[1.3s]",
      mounted ? "opacity-100" : "translate-y-4 opacity-0",
    )}
  >
    <a href="/download" class="group relative block h-16 w-44">
      <div
        class="absolute inset-0 bg-white transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
      ></div>
      <div class="absolute inset-0 bg-white"></div>
      <div
        class="absolute inset-1 bg-dark-green transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
      ></div>
      <div class="absolute inset-1 bg-dark-green"></div>
      <div
        class="absolute inset-2 flex items-center justify-center transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:bg-light-green"
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
      "absolute inset-x-0 bottom-36 transition-[transform,opacity] delay-[0.8s] duration-[1.3s]",
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
  <div
    class="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#161618]"
  ></div>
</div>
<div class="relative bg-[#161618]">
  <div class="mx-auto max-w-screen-3xl px-4 lg:px-8">
    <div class="relative mx-auto max-w-7xl py-32">
      <div
        class="absolute inset-0 opacity-10"
        style="background-image: linear-gradient(#6BA62A 1px, transparent 1px), linear-gradient(90deg, #6BA62A 1px, transparent 1px); background-size: 32px 32px;"
      />
      <div
        class="absolute inset-0 bg-gradient-radial from-transparent to-[#161618] to-60%"
      ></div>
      <p
        class="relative text-balance text-center font-minecraft text-xl text-white/80 sm:text-2xl"
      >
        MCSR Ranked is the best way to learn and play Minecraft Speedrunning.
        Practice with friends, compete for elo, and climb the ranks –
        <span class="text-light-green">First to beat the game wins.</span>
      </p>
    </div>
    <div class="space-y-16">
      {#each cards as card, i}
        <article
          class={cn(
            "relative flex min-h-[300px] flex-col lg:flex-row lg:gap-6 lg:odd:flex-row-reverse",
          )}
        >
          <div class="relative h-64 w-full lg:h-auto lg:w-[calc(50%+1rem)]">
            <img
              src={card.image}
              alt=""
              class={cn(
                "absolute inset-0 size-full select-none rounded-2xl object-cover opacity-90 blur-xl",
                card.imagePosition,
              )}
            />
            <img
              src={card.image}
              alt=""
              class={cn(
                "absolute inset-0 size-full select-none rounded-2xl object-cover",
                card.imagePosition,
              )}
            />
            {#if i === 0}
              <div
                class="absolute left-4 top-4 font-minecraft text-xl leading-6"
                style="text-shadow: 0.1em 0.1em 0px #333;"
              >
                <p class="font-bold text-[#F7FC62]">Current Match</p>
                <p class="text-white">Ranked Mode</p>
                <div class="h-[0.5lh]"></div>
                <div class="flex gap-[0.25em]">
                  <img
                    src="/alex-head.png"
                    alt=""
                    class="size-[1em] shrink-0 [image-rendering:pixelated]"
                  />
                  <p class="text-white">Alex</p>
                </div>
                <div class="flex gap-[0.25em]">
                  <img
                    src="/nether-icon.png"
                    alt=""
                    class="size-[1em] shrink-0 [image-rendering:pixelated]"
                  />
                  <p class="italic text-zinc-300/80">Entered Nether</p>
                </div>
              </div>
              <div
                class="absolute bottom-4 right-4 flex flex-col items-end font-minecraft text-xl leading-none"
                style="text-shadow: 0.1em 0.1em 0px #333;"
              >
                <p class="font-bold text-[#F7FC62]">Current Match</p>
                <p class="text-white">Ranked Mode</p>
                <div class="h-[0.5lh]"></div>
                <div class="flex gap-[0.25em]">
                  <img
                    src="/steve-head.png"
                    alt=""
                    class="size-[1em] shrink-0 [image-rendering:pixelated]"
                  />
                  <p class="text-white">Steve</p>
                </div>
                <div class="flex gap-[0.25em]">
                  <img
                    src="/bastion-icon.png"
                    alt=""
                    class="size-[1em] shrink-0 [image-rendering:pixelated]"
                  />
                  <p class="italic text-zinc-300/80">Entered Bastion</p>
                </div>
              </div>
              <div class="absolute inset-0 overflow-hidden">
                <div
                  class="absolute inset-0 left-1/2 top-1/2 h-[200%] w-1 -translate-y-1/2 rotate-[14deg] bg-[#D9D7D0]"
                ></div>
              </div>
            {/if}
          </div>
          <div class="relative flex-1 py-4 text-white/50">
            {#if card.background}
              <img
                src={card.background}
                alt=""
                class={cn(
                  "absolute -bottom-36 right-16 w-80 select-none opacity-5 blur-[2.5px] grayscale",
                  card.backgroundClass,
                )}
              />
            {/if}
            <div class="relative">
              <p
                class="font-minecraft text-xl font-extrabold uppercase tracking-widest text-light-green"
              >
                {card.name}
              </p>
              <h2 class="font-minecraft text-3xl text-white/80">
                {card.title}
              </h2>
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
  </div>

  <div class="relative">
    <div class="absolute bottom-0 h-1/2 w-full bg-zinc-950"></div>
    <div class="relative p-4 sm:p-8">
      <div
        class="relative mx-auto flex max-w-screen-2xl flex-col items-end gap-4 overflow-hidden rounded-2xl bg-[#599916] p-6 sm:rounded-3xl sm:p-8 lg:flex-row lg:items-center"
      >
        <div
          class="absolute bottom-12 right-0 size-12 bg-dark-green opacity-20"
        />
        <div
          class="absolute bottom-0 right-12 size-12 bg-dark-green opacity-20"
        />
        <div
          class="absolute bottom-0 right-48 size-12 bg-dark-green opacity-20"
        />
        <div
          class="absolute right-[27rem] top-0 size-12 bg-dark-green opacity-20"
        />
        <div
          class="absolute right-[24rem] top-12 size-12 bg-dark-green opacity-20"
        />

        <p
          class="text-xl font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]"
        >
          MCSR Ranked is the best way to learn and play Minecraft Speedrunning.
          Join our community of 9,000+ players and start your speedrunning
          journey today!
        </p>
        <div class="flex-1" />
        <div class="flex gap-2">
          <a
            href="https://mcsrranked.com/discord"
            target="_blank"
            rel="noopener noreferrer"
            class=" relative flex h-16 w-44 shrink-0 items-center justify-center font-extrabold tracking-widest text-dark-green decoration-[3px] underline-offset-4 hover:underline"
          >
            JOIN DISCORD
          </a>
          <a href="/download" class="group relative block h-16 w-44 shrink-0">
            <div
              class="absolute inset-0 bg-white transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
            ></div>
            <div class="absolute inset-0 bg-white"></div>
            <div
              class="absolute inset-1 bg-dark-green transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
            ></div>
            <div class="absolute inset-1 bg-dark-green"></div>
            <div
              class="absolute inset-2 flex items-center justify-center transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:bg-light-green"
            >
              <span class="font-extrabold tracking-widest text-white"
                >DOWNLOAD</span
              >
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  img {
    @apply select-none;
  }
</style>
