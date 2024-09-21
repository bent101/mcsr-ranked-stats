<script lang="ts">
  import { cn } from "$lib/utils";

  export let options: string[] | readonly string[];
  export let selectedIdx = 0;
  export let label: string | null = null;
  export let throttling = 0;
  let disabled = false;
  let throttleTimeout = -1;

  const onClick = (i: number) => {
    selectedIdx = i;
    disabled = true;
    clearTimeout(throttleTimeout);
    throttleTimeout = setTimeout(() => {
      disabled = false;
    }, throttling);
  };
</script>

<div class="inline-flex w-max items-center font-extrabold">
  {#if label}
    <span class="mr-2 inline-block text-sm uppercase text-zinc-400"
      >{label}:</span
    >
  {/if}
  <div
    class="inline-flex overflow-clip rounded-full border border-zinc-400 text-xs"
  >
    {#each options as option, i}
      <button
        {disabled}
        on:mousedown={() => onClick(i)}
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            e.currentTarget.focus();
            // onClick(i);
          }
        }}
        class={cn(
          "cursor-pointer px-3 py-1 uppercase",
          i === selectedIdx
            ? "bg-zinc-400 text-zinc-900"
            : "text-zinc-400 hover:bg-white/5",
        )}
      >
        {option}
      </button>
    {/each}
  </div>
</div>
