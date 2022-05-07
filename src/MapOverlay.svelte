<script>
  import { projectPoint, getCubeWidth, getCubePosition, formatCountry, formatNumber } from './helper'
  import { spring } from 'svelte/motion';

  export let data;
  export let width;
  export let height;
  export let map;
  export let index;
  export let day;
  export let isStarted;

  const centroidsD = data[0];
  const borderCrossingsD = data[1];
  const groupedD = data[2];
  const countryNamesSize = 20;
  let countryNames, newCountryNames;

  let cubeWidth = getCubeWidth(width, height);
  let radius = width / 300;

  $: {
    centroidsD.features.map((d, i) => {
      let country = d.properties.country;
      let geoPoint = projectPoint(map, d.geometry.coordinates[0], d.geometry.coordinates[1]);
      let gridPoint = getCubePosition(width, height, d.properties.country);
      let totalPerCountry = [];
      groupedD.forEach((d, i) => {
        let totalPerDay = d[1].filter(data => data.country.toLowerCase() == country);
        if(totalPerDay.length > 0) {
          totalPerDay = totalPerDay[0].total;
          totalPerCountry.push(totalPerDay);
        }
      })

      d.properties.x = +geoPoint.x;
      d.properties.y = +geoPoint.y;
      d.properties.gx = +gridPoint.x;
      d.properties.gy = +gridPoint.y;
      d.properties.id = i;
      d.properties.total = totalPerCountry;
    })

    borderCrossingsD.features.map((d, i) => {
      let point = projectPoint(map, d.geometry.coordinates[0], d.geometry.coordinates[1]);
      d.properties.x = +point.x;
      d.properties.y = +point.y;
      d.properties.id = i;
    })

    countryNames = spring(centroidsD.features.map(d => ({
      x: 0,
      y: 0,
      opacity: 0,
      total: 0,
      id: d.properties.id
    })),
    {
      stiffness: 0.1,
      damping: 0.9
    }
    )
  }
  $: circleOpacity = index == 3 ? 1 : 0;
  $: countryNamesTotalOpacity = index == 5 || index == 6 ? 1 : 0;
  $: summaryTextOpacity = index == 7 ? 1 : 0;

  $: {
    if (index <= 1) {
      newCountryNames = centroidsD.features.map(d => ({
        x: d.properties.x,
        y: d.properties.y,
        opacity: 0,
        total: day >= 48 ? d.properties.total[47] : d.properties.total[day],
        id: d.properties.id
      }))
    } else if (index <= 4) {
      newCountryNames = centroidsD.features.map(d => ({
        x: d.properties.x,
        y: d.properties.y,
        opacity: 1,
        total: day >= 48 ? d.properties.total[47] : d.properties.total[day],
        id: d.properties.id
      }))
    } else if (index <= 6) {
      newCountryNames = centroidsD.features.map(d => ({
        x: d.properties.gx,
        y: d.properties.gy,
        opacity: 1,
        total: day >= 48 ? d.properties.total[47] : d.properties.total[day],
        id: d.properties.id
      }))
    } else if (index >=7 ) {
      newCountryNames = centroidsD.features.map(d => ({
        x: d.properties.gx,
        y: d.properties.gy,
        opacity: 0,
        total: day >= 48 ? d.properties.total[47] : d.properties.total[day],
        id: d.properties.id
      }))
    }
    countryNames.set(newCountryNames);
  }
</script>

<style>
  g {
    transition: all 0.4s ease;
  }
  .country-names {
    text-anchor: middle;
    fill: var(--font-white);
    font-weight: 100;
    text-shadow: -2px 0 5px black, 0 2px 5px black, 2px 0 5px black, 0 -2px 5px black;
  }
  .country-names-name {
    text-transform: uppercase;
  }
  .summary-text text {
    fill: var(--font-white);
    text-shadow: -2px 0 5px black, 0 2px 5px black, 2px 0 5px black, 0 -2px 5px black;
  }
</style>

<svg {width} {height} >
  <g class="country-names">
    {#each $countryNames as {x, y, total, id, opacity}}
      <text
        x={x}
        y={y + countryNamesSize * 0.5}
        class="country-names-name"
        fill-opacity={opacity}
        style="font-size: {countryNamesSize}px"
        id="country-names-{id}"
      >{formatCountry(id)}</text>
      {#if id !== 0}
        <text
          x={x}
          y={y + countryNamesSize * 1.5}
          class="country-names-total"
          fill-opacity={countryNamesTotalOpacity}
          style="font-size: {countryNamesSize * 0.8}px"
        >{formatNumber(Math.round(total / 150) * 150)} refugees</text>
      {/if}
    {/each}
  </g>
  {#if index == 7}
    <g class="summary-text" style="opacity: {summaryTextOpacity}">
      <text
        x={width / 2 - cubeWidth / 2}
        y={height / 2 + countryNamesSize * 0.5}
        text-anchor="end"
        style="font-size: {countryNamesSize}px"
      >
        Total refugees: 5 million
      </text>
      <text
        x={width / 2 + cubeWidth / 2}
        y={height / 2 + countryNamesSize * 0.5}
        style="font-size: {countryNamesSize}px"
      >
        Ukraine population: 44 million
      </text>
    </g>
  {/if}
  <g class="circles" style="opacity: {circleOpacity};">
    {#each borderCrossingsD.features as d}
      <circle
        cx={d.properties.x}
        cy={d.properties.y}
        r={radius}
        id="border-crossing-{d.properties.id}"
        fill="#eeeeee"
        fill-opacity=0.5
        stroke="#eeeeee"
        stroke-width=1
      ></circle>
    {/each}
  </g>
</svg>