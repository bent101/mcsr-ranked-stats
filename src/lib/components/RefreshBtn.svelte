<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	let isRefreshing = false;
	let justRefreshed = false;
	let timeoutIdx = -1;

	export let dark = false;

	const refresh = async () => {
		isRefreshing = true;
		await invalidateAll();
		isRefreshing = false;

		justRefreshed = true;
		clearTimeout(timeoutIdx);
		timeoutIdx = setTimeout(() => {
			justRefreshed = false;
		}, 2000);
	};
</script>

<button
	disabled={isRefreshing}
	class="mx-auto block w-max rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide {dark
		? 'text-zinc-700 hover:bg-zinc-900 hover:text-zinc-500'
		: 'text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-400'}"
	on:click={refresh}>
	{isRefreshing ? "Loading..." : justRefreshed ? "Refreshed!" : "Refresh"}
</button>
