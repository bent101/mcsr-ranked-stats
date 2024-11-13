<script lang="ts">
  import { cn, type TimeoutId } from "$lib/utils";

  export let options: [string, string];
  export let onFirst: boolean = true;
  export let throttling = 0;

  let disabled = false;
  let throttleTimeout: TimeoutId = -1;

  const onClick = () => {
    onFirst = !onFirst;
    disabled = true;
    clearTimeout(throttleTimeout);
    throttleTimeout = setTimeout(() => {
      disabled = false;
    }, throttling);
  };
</script>

<button
  {disabled}
  class="inline-flex cursor-pointer overflow-clip rounded-full border border-zinc-400 text-xs font-extrabold uppercase"
  on:mousedown={onClick}
  on:keydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      onClick();
    }
  }}
>
  {#each options as option, index}
    {@const selected = onFirst === (index === 0)}
    <div
      class={cn(
        "px-2.5 py-1",
        selected
          ? "bg-zinc-400 text-zinc-900"
          : "text-zinc-400 hover:bg-white/5",
      )}
    >
      {option}
    </div>
  {/each}
</button>
