<script lang="ts">
	import { getPlayerURL, getSkinURL } from "$lib/urls";
	import PlayerProfile from "./PlayerProfile.svelte";
	import Popup from "./Popup.svelte";
	import type { DetailedPlayer } from "$lib/ranked-api";

	export let name = "";
	export let uuid = "";

	let anchor: Element | undefined;

	const load = async () => {
		return {
			playerData: fetch(getPlayerURL(name))
				.then((res) => res.json())
				.then((res) => res.data as DetailedPlayer),

			_: fetch(getSkinURL(uuid)),
		};
	};
</script>

<a
	bind:this={anchor}
	data-sveltekit-replacestate="off"
	data-sveltekit-noscroll="off"
	href="/{name}"
	class="relative hover:underline hover:underline-offset-4">
	{name}
</a>
<Popup {anchor} hoverable {load} let:data>
	<a
		href="/{name}"
		class="block overflow-clip rounded-3xl bg-zinc-800 p-2 shadow-lg shadow-black/50">
		<PlayerProfile playerData={data.playerData} />
	</a>
</Popup>
