<script lang="ts">
  import { cn, type TimeoutId } from "$lib/utils";

  export let options: string[] | readonly string[];
  export let selectedIdx = 0;
  export let label: string | null = null;
  export let throttling = 0;
  let disabled = false;
  let throttleTimeout: TimeoutId = -1;

  const onClick = (i: number) => {
    selectedIdx = i;
    disabled = true;
    clearTimeout(throttleTimeout);
    throttleTimeout = setTimeout(() => {
      disabled = false;
    }, throttling);
  };
</script>

<div class="inline-flex w-max items-center font-semibold">
  {#if label}
    <span class="mr-1 inline-block text-sm text-zinc-500">{label}:</span>
  {/if}
  <div class="inline-flex text-xs">
    {#each options as option, i}
      <button
        {disabled}
        on:mousedown={() => onClick(i)}
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(i);
          }
        }}
        class={cn(
          "min-w-8  cursor-pointer border px-2 py-1.5 first:rounded-l-full first:pl-3 last:rounded-r-full last:pr-3 ",
          i === selectedIdx
            ? "border-white/5 bg-white/[0.12] text-white/70"
            : "border-transparent bg-white/5 text-white/50 hover:bg-white/[0.07]",
        )}
      >
        {option}
      </button>
    {/each}
  </div>
</div>
