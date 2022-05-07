<script>
  import { json, csv, group } from 'd3';
  import { parseTime, parseCountryName, getCountryIndex } from './helper';

  import Scrolly from './Scrolly.svelte';

  export let datasets = [];

  let width;
  let promise = getData();
  async function getData() {
    let countriesD = await json("data/countries-centroids.json");
    let refugeesD = await csv("data/refugees.csv");
    let conflictD = await csv("data/conflict.csv");
    let borderCrossingsD = await json("data/border_crossings.geojson");
    let eventsD = await csv("data/events.csv");
    let totalRefugeesD = await csv("data/refugees_total.csv");
    let populationD = await json("data/population.geojson")
    let groupedD = group(refugeesD, d => d.day);
    groupedD = Array.from(groupedD);
    datasets = [countriesD, refugeesD, conflictD, borderCrossingsD, eventsD, totalRefugeesD, populationD, groupedD];
    parseData(datasets);
    console.log(datasets)
  }

  function parseData(datasets) {
    // parse countriesD
    datasets[1].map(d => {
      d.total = +d.total;
      d.origValue = +d.value;
      d.value = Math.round(+d.value / 1000);
      d.day = +d.day;
    })
    
    // parse conflictD
    datasets[2].map(d => {
      d.fatalities = +d.fatalities;
      d.date_parsed = parseTime(d.event_date);
    })

    // parse borderCrossingsD
    datasets[3].features.map(d => {
      d.properties.country = parseCountryName(d.properties.Country);
    })

    // parse eventsD
    datasets[4].map(d => {
      d.day = +d.day;
    })

    // parse totalRefugeesD
    datasets[5].map(d => {
      d.date_parsed = parseTime(d.date);
      d.total_refugees = +d.total_refugees;
    })

    // parse populationD
    datasets[6].features.map(d => {
      d.properties = {};
      d.properties.country = "ukraine";
      d.properties.countryIndex = 0;
      d.properties.day = 0;
    })

    // merge populationD and groupedD
    let totalParseCount = 0;
    datasets[7].forEach((byDate) => {
      byDate[1].forEach(d => {
        let country = d.country;
        let day = d.day;
        let count = d.value;
        if(count > 0) {
          for(let i = 0; i < count; i++) {
            let j = totalParseCount + i;
            datasets[6].features[j].properties.country = country.toLowerCase();
            datasets[6].features[j].properties.countryIndex = getCountryIndex(country.toLowerCase());
            datasets[6].features[j].properties.day = day;
          }
          totalParseCount = totalParseCount + count;
        }
      })
    })
  }

</script>

<main bind:clientWidth={width} >
  {#if width !== undefined}
    {#await promise then data}
      <Scrolly data={datasets} {width}/>
    {/await}
  {/if}
</main>

<style>

</style>