<script lang="ts">
	import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisTooltip } from "@unovis/svelte";
	import { Line } from "@unovis/ts";
	import { browser } from "$app/environment";
	import type { FormattedMatch } from "$lib/utils";

	type DataRecord = { x: number; y: number };

	export let matches: FormattedMatch[];

	$: data = matches
		.map((match, i) => ({
			x: i + 1,
			y: match.eloAfter,
		}))
		.filter(({ y }) => y && y !== -1) as DataRecord[];

	$: yDomain = [
		Math.floor(Math.min(...data.map(({ y }) => y)) / 150) * 150,
		Math.ceil(Math.max(Math.max(...data.map(({ y }) => y)), 0) / 150) * 150,
	];

	$: xDomain = [data.length, 1];

	const triggers = {
		[Line.selectors.line]: (d: DataRecord) => `${d.x} ${d.y}`,
	};
</script>

{#if browser}
	<VisXYContainer {xDomain} {yDomain} width="100%" height="50vh" {data}>
		<VisLine
			highlightOnHover
			color="#ddd"
			curveType="linear"
			lineWidth={5}
			{data}
			x={(d) => d.x}
			y={(d) => d.y} />
		<VisAxis type="x" label="Matches ago" />
		<VisAxis type="y" label="Elo" />
		<!-- <VisTooltip {triggers} /> -->
	</VisXYContainer>
{/if}
