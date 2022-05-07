<script>
  import { formatNumber, getCubeWidth, getDateFromDay } from './helper'
  import { spring } from 'svelte/motion';

  export let width;
  export let height;
  export let day;
  export let index;
  export let eventsD;
  export let totalRefugeesD;
  export let isStarted;

  let position, cubeWidth, isCardVisible;
  let eventDescription = 'On April 12, Putin said Russia "had no other choice" but to launch what he called a "special military operation" in Ukraine.';
  const days = [0, 4, 6, 12, 15, 20, 28, 37, 47];
  $: opacity = index == 6 || isStarted ? 1 : 0;

  let totalRefugees = spring({ value: 0 },
    {
      stiffness: 0.1,
      damping: 0.9
    }
  );

  let barWidth = spring({ value: 0 }, {
    stiffness: 0.1,
    damping: 0.9
  })

  $: if(isStarted || index == 6) {
    totalRefugees.set({ value: totalRefugeesD[day].total_refugees })
    barWidth.set({ value: day / 48 * 100 })
  }

  $: {
    let shorterSide = width > height ? height : width;
    cubeWidth = getCubeWidth(width, height);
    position = {
      x: width / 2 - cubeWidth / 2,
      y: height / 2 - shorterSide * 0.3 - cubeWidth / 2,
    }
  }

  $: if(days.includes(day)) {
    eventDescription = eventsD.filter(d => d.day == day)
    eventDescription = eventDescription[0].description;
  }
</script>

<style>
  div.wrapper {
    position: fixed;
    text-align: center;
    font-family: "Fira Sans", sans-serif;
  }
  h2 {
    margin: 0;
  }
  div.outer {
    width: 100%;
    height: 5px;
    background: rgb(40, 40, 40);
    margin: 10px 0;
    border-radius: 3.5px;
  }
  div.inner {
    transform: translateY(-1px);
    height: 7px;
    border-radius: 3.5px;
    background: var(--accent-blue);
  }
  div.card {
    margin-top: 10px;
    border-radius: 3.5px;
    background: rgba(40, 40, 40, 0.8);
    padding: 1em 0.8em;
    position: relative;
    font-size: 0.8rem;
  }
  div.hidden {
    opacity: 0;
    pointer-events: none;
  }
  div.card-text {
    line-height: 1.2;
  }
</style>

<div class="wrapper" style="width: {cubeWidth}px; height: {cubeWidth}px; left: {position.x}px; top: {position.y}px; opacity: {opacity}">
  <h2>{getDateFromDay(day)}</h2>
  <div class="outer">
    <div class="inner" style="width: {$barWidth.value}%"></div>
  </div>
  Total refugees
  <h2>{formatNumber(Math.round($totalRefugees.value / 150) * 150)}</h2>
  <div class="card {isCardVisible}">
    <div class="card-text">
      {eventDescription}
    </div>
  </div>
</div>