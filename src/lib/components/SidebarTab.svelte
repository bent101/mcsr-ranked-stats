<script lang="ts">
  import { preloadData } from "$app/navigation";
  import { cn } from "$lib/utils";

  export let href = "/";
  export let selected = false;
  export let arrowSelected = false;

  $: if (arrowSelected) {
    setTimeout(() => {
      if (arrowSelected) preloadData(href);
    }, 200);
  }
</script>

<a
  {href}
  class={cn(
    "group flex items-center rounded-l-full border-[0.125rem] border-r-0 py-1 transition-transform duration-300",
    selected
      ? [
          "sticky bottom-24 top-28 z-10 translate-x-1 bg-zinc-900 sm:bottom-12 sm:top-20",
          arrowSelected ? "border-blue-500" : "border-zinc-700",
        ]
      : arrowSelected
        ? "border-blue-500 bg-zinc-900"
        : "border-transparent hover:bg-zinc-900",
  )}
>
  <slot />
</a>
