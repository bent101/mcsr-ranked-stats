<script lang="ts">
  import { cn } from "$lib/utils";

  export let options: [string, string];
  export let onFirst: boolean = true;

  const onClick = () => {
    onFirst = !onFirst;
  };
</script>

<button
  class="inline-flex cursor-pointer text-xs font-semibold"
  on:mousedown={onClick}
  on:keydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  }}
>
  {#each options as option, index}
    {@const selected = onFirst === (index === 0)}
    <div
      class={cn(
        "cursor-pointer border px-2 py-1.5 ",
        index === 0 ? "rounded-l-full pl-3" : "rounded-r-full pr-3",
        selected
          ? "border-white/5 bg-white/[0.12] text-white/70"
          : "border-transparent bg-white/5 text-white/50 hover:bg-white/[0.07]",
      )}
    >
      {option}
    </div>
  {/each}
</button>
