<script lang="ts">
  import { browser } from "$app/environment";
  import type { FormattedMatch } from "$lib/formatters";
  import { reversed } from "$lib/utils";
  import { VisArea, VisAxis, VisLine, VisXYContainer } from "@unovis/svelte";

  type DataRecord = { x: number; y: number };

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
  $: yDomain = [roundedMax - Math.max(yRange, 250), roundedMax] as [
    number,
    number,
  ];

  $: xMax = Math.max(data.length, 5);
  $: xDomain = [1, xMax] as [number, number];
</script>

{#if browser}
  <div class="h-full">
    <VisXYContainer
      {xDomain}
      {yDomain}
      width="100%"
      height="calc(max(24rem, 60vh))"
      {data}
    >
      <VisArea
        color="#a1a1aa28"
        curveType="linear"
        {data}
        x={(d) => d.x}
        y={(d) => d.y}
      />
      <VisLine
        color="#a1a1aa"
        curveType="linear"
        {data}
        x={(d) => d.x}
        y={(d) => d.y}
      />

      <!-- @ts-expect-error bad typedefs -->
      <VisAxis
        tickFormat={(tick) => `${xMax - tick}`}
        type="x"
        numTicks={3}
        label="Matches ago"
      />
      <VisAxis type="y" numTicks={3} label="Elo" />
    </VisXYContainer>
  </div>
{/if}

<style>
  .h-full {
    --vis-axis-grid-color: #27272a;
    --vis-axis-tick-color: #27272a;
    --vis-axis-label-color: #71717a;
    --vis-axis-tick-label-color: #71717a80;
  }
</style>
