<script lang="ts">
	export let href = "/";
	export let selected = false;
	export let arrowSelected = false;
</script>

<a
	{href}
	class="group block rounded-l-full border-2 border-r-0 py-1 transition-transform duration-300 {selected
		? `sticky bottom-12 top-20 z-10 translate-x-1 bg-zinc-900 ${
				arrowSelected ? 'border-blue-500' : 'border-zinc-700'
		  }`
		: `${
				arrowSelected ? 'border-blue-500 bg-zinc-900/90' : 'border-transparent hover:bg-zinc-900/60'
		  }`}">
	<slot />
</a>
