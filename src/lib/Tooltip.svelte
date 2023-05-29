<script lang="ts">
	import Popup from "./Popup.svelte";
	import type { Direction } from "./utils";

	export let directionPreference: Direction[] = ["right", "top", "bottom", "left"];
</script>

<Popup delay={0} padding={4} {directionPreference}>
	<div slot="anchor">
		<slot name="anchor" />
	</div>

	<div class="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-semibold text-zinc-300 shadow-lg">
		<slot />
	</div>
</Popup>
