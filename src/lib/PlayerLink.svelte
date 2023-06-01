<script lang="ts">
	import PlayerProfile from "./PlayerProfile.svelte";
	import Popup from "./Popup.svelte";
	import type { DetailedPlayer } from "./ranked-api";
	import { getPlayerURL, getSkin } from "./utils";

	export let name = "";
	export let uuid = "";

	const load = async () => {
		return {
			playerData: fetch(getPlayerURL(name))
				.then((res) => res.json())
				.then((res) => res.data as DetailedPlayer),

			_: fetch(getSkin(uuid)),
		};
	};
</script>

<Popup hoverable {load} let:data>
	<a
		slot="anchor"
		data-sveltekit-replacestate="off"
		data-sveltekit-noscroll="off"
		href="/{name}"
		class="relative hover:underline hover:underline-offset-4">
		{name}
	</a>
	<a
		href="/{name}"
		class="block overflow-clip rounded-3xl bg-zinc-800 p-2 shadow-lg shadow-black/30">
		<PlayerProfile playerData={data.playerData} />
	</a>
</Popup>
