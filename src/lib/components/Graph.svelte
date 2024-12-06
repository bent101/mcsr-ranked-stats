<script lang="ts">
  import { VisXYContainer, VisLine, VisAxis, VisArea } from "@unovis/svelte";
  import { Line } from "@unovis/ts";
  import { browser } from "$app/environment";
  import type { FormattedMatch } from "$lib/formatters";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  type DataRecord = { x: number; y: number };
  const x = (d: DataRecord) => d.x;
  const y = (d: DataRecord) => d.y;

  export let matches: FormattedMatch[];

  let duration = 0;

  onMount(() => {
    setTimeout(() => {
      duration = 300;
    }, 100);
  });

  $: data = matches
    // .toReversed()
    .filter((match) => match.eloBefore && match.eloBefore !== -1)
    .map((match, i) => ({
      x: i + 1,
      y: (match.eloBefore ?? 0) + match.eloChange,
    })) as DataRecord[];

  $: paddedArrayLength = Math.ceil(data.length / 500) * 500;

  $: paddedData = [
    ...data,
    ...Array(paddedArrayLength - data.length)
      .fill(null)
      .map((_, i) => ({ x: i + data.length + 1, y: data[data.length - 1].y })),
  ];

  $: yMin = Math.min(...data.map(({ y }) => y));
  $: yMax = Math.max(Math.max(...data.map(({ y }) => y)), 0);
  $: roundedMin = Math.floor(yMin / 50) * 50;
  $: roundedMax = Math.ceil(yMax / 50) * 50;
  $: yRange = roundedMax - roundedMin;
  $: yDomain = [roundedMax - Math.max(yRange, 250), roundedMax] as [
    number,
    number,
  ];

  $: xMax = Math.max(data.length, 5);
  $: xDomain = [xMax, 1] as [number, number];

  const triggers = {
    [Line.selectors.line]: (d: DataRecord) => `${d.x} ${d.y}`,
  };
</script>

<div class="container h-[40vh] lg:h-[60vh] *:h-full">
  {#if browser}
    <VisXYContainer width="100%" {xDomain} {yDomain} data={paddedData}>
      <VisArea {duration} color="#a1a1aa28" curveType="linear" {x} {y} />
      <VisLine
        {duration}
        lineWidth={"0.125rem"}
        color="#a1a1aa"
        curveType="linear"
        {x}
        {y}
      />

      <VisAxis
        {duration}
        labelFontSize={"1rem"}
        tickTextFontSize={"0.8rem"}
        type="x"
        numTicks={3}
        label="Matches ago"
      />
      <VisAxis
        {duration}
        labelFontSize={"1rem"}
        tickTextFontSize={"0.8rem"}
        type="y"
        numTicks={3}
        label="Elo"
      />
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
