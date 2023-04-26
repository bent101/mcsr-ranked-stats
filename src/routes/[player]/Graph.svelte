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

	$: yMin = Math.min(...data.map(({ y }) => y));
	$: yMax = Math.max(Math.max(...data.map(({ y }) => y)), 0);
	$: roundedMin = Math.floor(yMin / 50) * 50;
	$: roundedMax = Math.ceil(yMax / 50) * 50;
	$: yDomain = [roundedMin, roundedMax];

	$: xDomain = [data.length, 1];

	const triggers = {
		[Line.selectors.line]: (d: DataRecord) => `${d.x} ${d.y}`,
	};
</script>

{#if browser}
	<VisXYContainer {xDomain} {yDomain} width="100%" height="50vh" {data}>
		<VisLine
			highlightOnHover
			color="#000"
			curveType="linear"
			lineWidth={5}
			{data}
			x={(d) => d.x + 0.15}
			y={(d) => d.y + 0.2} />
		<VisLine
			highlightOnHover
			color="#ddd"
			curveType="linear"
			lineWidth={5}
			{data}
			x={(d) => d.x}
			y={(d) => d.y} />
		<VisAxis type="x" numTicks={5} label="Matches ago" />
		<VisAxis type="y" numTicks={3} label="Elo" />
		<!-- <VisTooltip {triggers} /> -->
	</VisXYContainer>
{/if}
