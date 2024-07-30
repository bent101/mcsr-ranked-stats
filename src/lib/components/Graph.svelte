<script lang="ts">
	import { VisXYContainer, VisLine, VisAxis, VisArea } from "@unovis/svelte";
	import { Line } from "@unovis/ts";
	import { browser } from "$app/environment";
	import type { FormattedMatch } from "$lib/formatters";
	import { reversed } from "$lib/utils";

	type DataRecord = { x: number; y: number };
	const x = (d: DataRecord) => d.x;
	const y = (d: DataRecord) => d.y;

	export let matches: FormattedMatch[];

	$: data = reversed(matches)
		.filter((match) => match.eloBefore && match.eloBefore !== -1)
		.map((match, i) => ({
			x: i + 1,
			y: (match.eloBefore ?? 0) + match.eloChange,
		})) as DataRecord[];

	$: yMin = Math.min(...data.map(({ y }) => y));
	$: yMax = Math.max(Math.max(...data.map(({ y }) => y)), 0);
	$: roundedMin = Math.floor(yMin / 50) * 50;
	$: roundedMax = Math.ceil(yMax / 50) * 50;
	$: yRange = roundedMax - roundedMin;
	$: yDomain = [roundedMax - Math.max(yRange, 250), roundedMax];

	$: xMax = Math.max(data.length, 5);
	$: xDomain = [1, xMax];

	const triggers = {
		[Line.selectors.line]: (d: DataRecord) => `${d.x} ${d.y}`,
	};
</script>

<div class="container h-[40vh] lg:h-[60vh] [&>*]:h-full">
	{#if browser}
		<VisXYContainer width="100%" {xDomain} {yDomain} {data}>
			<VisArea color="#a1a1aa28" curveType="linear" {x} {y} duration={0} />
			<VisLine lineWidth={"0.125rem"} color="#a1a1aa" curveType="linear" {x} {y} duration={0} />

			<VisAxis
				duration={0}
				labelFontSize={"1rem"}
				tickTextFontSize={"0.8rem"}
				tickFormat={(tick) => `${xMax - tick}`}
				type="x"
				numTicks={3}
				label="Matches ago" />
			<VisAxis
				duration={0}
				labelFontSize={"1rem"}
				tickTextFontSize={"0.8rem"}
				type="y"
				numTicks={3}
				label="Elo" />
		</VisXYContainer>
	{/if}
</div>

<style lang="postcss">
	.container {
		--vis-axis-grid-color: #27272a;
		--vis-axis-tick-color: #27272a;
		--vis-axis-label-color: #71717a;
		--vis-axis-tick-label-color: #71717a80;
	}
</style>
