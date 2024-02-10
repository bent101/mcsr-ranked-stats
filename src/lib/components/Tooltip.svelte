<script lang="ts">
	import Popup from "./Popup.svelte";
	import type { Direction } from "$lib/globals";
	export let anchor: Element | undefined;
	export let hoverable = false;
	export let directionPreference: Direction[] = ["right", "top", "bottom", "left"];
</script>

<Popup {hoverable} {anchor} delay={0} padding={4} {directionPreference}>
	<div
		class="rounded-lg bg-zinc-400 px-3 py-1.5 text-center text-sm font-semibold text-zinc-800 shadow-md shadow-black/50">
		<slot />
	</div>
</Popup>
