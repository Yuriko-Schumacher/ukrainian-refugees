<script>
  import { group } from 'd3';
  import { afterUpdate } from 'svelte';

  import { projectPoint, random, drawDot, getCubeWidth, getCubePosition, lerpGeo } from './helper'
  import { Point } from './Point'

  export let width;
  export let height;
  export let index;
  export let map;
  export let data;

  let refugeesD = data[1];
  let groupedD = group(refugeesD, d => d.day);
  groupedD = Array.from(groupedD);
  let totalRefugeesD = data[5];
  let populationD = data[6];

  let cubeWidth = getCubeWidth(width, height)
  console.log(groupedD);
  console.log(populationD.features)

  populationD.features.map((d, i) => {
    let geoPoint = projectPoint(map, d.geometry.coordinates[0], d.geometry.coordinates[1]);
    d.properties.currentPos = {}
    d.properties.currentPos.x = +geoPoint.x;
    d.properties.currentPos.y = +geoPoint.y;
    d.properties.id = i;
    d.properties.origCube = {};
    d.properties.origCube.x = random(width / 2 - cubeWidth / 2, width / 2 + cubeWidth / 2);
    d.properties.origCube.y = random(height / 2 - cubeWidth / 2, height / 2 + cubeWidth / 2);
    d.properties.country = "";
    d.properties.day = 0;
    d.properties.destCube = {};
    d.properties.destCube.x = 0;
    d.properties.destCube.y = 0;
    d.properties.diff = {};
    d.properties.velocity = random(0.1, 0.5);
  })

  let totalParseCount = 0;
  groupedD.forEach((byDate) => {
    byDate[1].forEach(d => {
      let country = d.country;
      let day = d.day;
      let count = d.value;
      if(count > 0) {
        for(let i = 0; i < count; i++) {
          let j = totalParseCount + i;
          populationD.features[j].properties.country = country.toLowerCase();
          populationD.features[j].properties.day = day;
          populationD.features[j].properties.destCube = getCubePosition(width, height, country);
        }
        totalParseCount = totalParseCount + count;
      }
    })
  })
  console.log(populationD.features)

  $: afterUpdate(() => {
    const canvas = document.querySelector("canvas.chart");
    const context = canvas.getContext("2d");

    populationD.features.forEach(d => {
      drawDot(context, d.properties.currentPos, 0.04, "rgba(128, 187, 255,1)")
    })

    let time;
    const loop = () => {
      // clear canvas each frame
      context.fillStyle = "rgba(0, 0, 0, 0.3)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Time
      // const currentTime = performance.now();
      // const deltaTime = currentTime - time;
      // movePerSecond = 1000 / deltaTime;
      // time = currentTime;

      // draw animated dots
      populationD.features.forEach((d) => {
        lerpGeo(d);
        drawDot(context, d.properties.currentPos, 1, "rgba(128, 187, 255,1)");
      });
      requestAnimationFrame(loop); // complete this task before the next repaint
    };
    // loop();
  })
</script>

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>

<canvas class="chart" {width} {height}></canvas>

