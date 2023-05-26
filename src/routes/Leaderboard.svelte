<script lang="ts">
	import { flip } from "svelte/animate";

	export let lb = [];
	export let animating = true;
</script>

{#if animating}
	<ol class="pb-16 pl-2">
		{#each lb as { name, elo, rank, uuid, href, selected, arrowSelected } (uuid)}
			<li class={selected ? "sticky bottom-12 top-20 z-10" : ""} animate:flip={{ duration: 400 }}>
				<a
					{href}
					class="group flex h-8 items-center rounded-l-full border-2 border-r-0 transition-transform duration-300
                {selected
						? `translate-x-1 ${arrowSelected ? 'border-blue-500' : 'border-zinc-700'} bg-zinc-900`
						: `${
								arrowSelected
									? 'border-blue-500 bg-zinc-900/90'
									: 'border-transparent hover:bg-zinc-900/50'
						  } `}">
					<div
						class=" w-12 px-2 text-right font-extrabold {selected
							? 'text-zinc-400'
							: 'text-zinc-700 group-hover:text-zinc-400'}">
						{rank ?? "??"}
					</div>
					<div
						class="flex-1 px-2 text-center {selected
							? ' text-zinc-300'
							: 'text-zinc-400 group-hover:text-zinc-300'}">
						{name}
					</div>
					<div
						class=" w-16 px-2 font-semibold {selected
							? 'text-zinc-500'
							: ' text-zinc-600  group-hover:text-zinc-500'}">
						{elo ?? "????"}
					</div>
				</a>
			</li>
		{/each}
	</ol>
{:else}
	<ol class="pb-16 pl-2">
		{#each lb as { name, elo, rank, uuid, href, selected, arrowSelected } (uuid)}
			<li class={selected ? "sticky bottom-12 top-20 z-10" : ""}>
				<a
					{href}
					class="group flex h-8 items-center rounded-l-full border-2 border-r-0 transition-transform duration-300
                {selected
						? `translate-x-1 ${arrowSelected ? 'border-blue-500' : 'border-zinc-700'} bg-zinc-900`
						: `${
								arrowSelected
									? 'border-blue-500 bg-zinc-900/90'
									: 'border-transparent hover:bg-zinc-900/50'
						  } `}">
					<div
						class=" w-12 px-2 text-right font-extrabold {selected
							? 'text-zinc-400'
							: 'text-zinc-700 group-hover:text-zinc-400'}">
						{rank ?? "??"}
					</div>
					<div
						class="flex-1 px-2 text-center {selected
							? ' text-zinc-300'
							: 'text-zinc-400 group-hover:text-zinc-300'}">
						{name}
					</div>
					<div
						class=" w-16 px-2 font-semibold {selected
							? 'text-zinc-500'
							: ' text-zinc-600  group-hover:text-zinc-500'}">
						{elo ?? "????"}
					</div>
				</a>
			</li>
		{/each}
	</ol>
{/if}
