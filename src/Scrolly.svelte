<script>
  import Scroller from "@sveltejs/svelte-scroller";

  import MapContainer from './MapContainer.svelte';
  import Footer from './Footer.svelte';

  export let data;
  export let width;

  let index = 0;
  let offset;
  let day = 0;
  let isStarted = false;
  let isPaused = false;
  let lastSectionClass = "";
  let timer;

  function startAnimation() {
    isStarted = true;
    isPaused = false;
    lastSectionClass = "invisible";

    timer = setInterval(changeDate, 1000);
  }

  function changeDate() {
    if(!isPaused) {
      if (day < data[7].length) {
        day += 1;
      } else {
        clearInterval(timer);
      }
    }
  }

  $: if (index == 5) {
    day = 0;
  }

  $: if (index >= 6) {
    clearInterval(timer);
    day = data[7].length;
  }

  $: if (index >= 7) {
    isStarted = false;
  }
</script>
<style>
.background {
  width: 100%;
  height: 100vh;
  transition: all 0.4s ease-in-out;
  background-repeat: no-repeat;
  background-size: cover;
}
.foreground {
  width: 90%;
  max-width: 600px;
  margin: 0 auto;
}
section {
  height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 20vh 0 30vh 0;
}
.section {
  background: rgba(26, 26, 26, 0.85);
  backdrop-filter: blur(5px);
  padding: 0.5rem 2.5rem;
  border-radius: 3.5px;
}
section:nth-of-type(6) {
  padding-bottom: 50vh;
}
.invisible {
  opacity: 0;
  pointer-events: none;
}
.visible {
  opacity: 1;
  pointer-events: default;
}
.caption, .table {
  font-family: "Fira Sans", sans-serif;
  font-size: 0.8rem;
}
img {
  margin: 1.5rem 0 0 0;
}
h2 {
  margin: 1.5rem auto;
}
.table-bar {
  padding: 0.3em 0.5em;
  background: rgb(200, 200, 200, 0.5);
  margin: 0.3em 0;
  line-height: 1;
}
.table-accent {
  background: rgb(128, 187, 255, 0.5);
}
.caption {
  font-size: 0.6rem;
  font-style: italic;
  margin: 0;
  color: var(--font-gray);
}
button {
  cursor: pointer;
}

</style>

<Scroller top="{0}" bottom="{1}" bind:index bind:offset>
<div class="background" slot="background">
  <MapContainer {data} {width} {index} bind:day={day} bind:isStarted={isStarted} bind:isPaused={isPaused} />
</div>
<div class="foreground" slot="foreground">
  <section>
    <div class="section" data-section-id="1">
      <p>
        On February 24, Russia launched its invasion of Ukraine.
      </p>
      <p>
        Ukrainians immediately started fleeing the country. As of April 20, more than five million refugees have left for neighboring countries, according to the <a href="https://data2.unhcr.org/en/situations/ukraine" target="_blank">United Nations refugee agency</a>.
      </p>
    </div>
  </section>
  <section>
    <div class="section" data-section-id="2">
      <img src="./photos/0.jpeg" alt="A man carries a baby as people struggle on stairways after a last minute change of the departure platform for a Lviv bound train in Kyiv, Ukraine, Feb. 28, 2022. (AP/Vadim Ghirda)" width="100%">
      <p class="caption">
        Photo: A man carries a baby as people struggle on stairways after a last minute change of the departure platform for a Lviv bound train in Kyiv, Ukraine, Feb. 28, 2022. (AP Photo/Vadim Ghirda)
      </p>
      <h2>
        Ukrainian refugee crisis
      </h2>
      <p>
        By Yuriko Schumacher
      </p>
    </div>
  </section>
  <section>
    <div class="section" data-section-id="3">
      <p>
        Seven countries share borders with Ukraine: Poland, Moldova, Hungary, Slovakia, Belarus, Romania, and Russia.
      </p>
    </div>
  </section>
  <section>
    <div class="section" data-section-id="4">
      <p>
        There are a total of 67 border crossing points.
      </p>
      <p>
        Russia has the most border crossings: 19 points along about 1,230 miles of its border with Ukraine. 
      </p>
    </div>
  </section>
  <section>
    <div class="section" data-section-id="5">
      <p>
        Before the war, there were 44 million people in the country. 
      </p>
      <p>
        Each particle represent 150 people in 2020.
      </p>
    </div>
  </section>
  <section class="{lastSectionClass}">
    <div class="section" data-section-id="6">
      <p>
        See how the Ukrainians fled the country after Russian invasion.
      </p>
      <p>
        <button on:click="{startAnimation}">Start animation</button>
      </p>
    </div>
  </section>
  <section>
    <div class="section" data-section-id="7">
      <p>
        As of April 13, more than 2.6 million refugees fled to Poland. That's over 50% of all refugees fleed from Ukrain. Belarus attracted only 0.4%, just above 20,000 refugees.
      </p>
    </div>
  </section>
  <section>
    <div class="section" data-section-id="8">
      <p>
        In total, the number of refugees fled Ukraine tops five million. That's over 11% of the whole population of Ukraine.
      </p>
    </div>
  </section>
  <section>
    <div class="section" data-section-id="9">
      <p>
        Five million people -- that's larger than the population of the second biggest U.S. city.
      </p>
      <div class="table">
        <strong>Five largest U.S. cities</strong>
        <div class="table-bar"><div class="table-text">1. New York<br>(8,804,190)</div></div>
        <div class="table-bar table-accent" style="width: {5034439 / 8804190 * 100}%"><div class="table-text">Total Ukrainian refugees<br>(5,034,439)</div></div>
        <div class="table-bar" style="width: {3898747 / 8804190 * 100}%"><div class="table-text">2. Los Angeles<br>(3,898,747)</div></div>
        <div class="table-bar" style="width: {2746388 / 8804190 * 100}%"><div class="table-text">3. Chicago<br>(2,746,388)</div></div>
        <div class="table-bar" style="width: {2304580 / 8804190 * 100}%"><div class="table-text">4. Houston<br>(2,304,580)</div></div>
        <div class="table-bar" style="width: {1608139 / 8804190 * 100}%"><div class="table-text">5. Phoenix<br>(1,608,139)</div></div>
      </div>
      <p class="caption">Source: <a href="https://www.census.gov/quickfacts/fact/table/US/PST045221" target="_blank">2020 U.S Census</a></p>
    </div>
  </section>
  <section>
    <div class="section" data-section-id="10">
      <p>
        On top of that, the United Nations Refugee Agency <a href="https://www.unrefugees.org/emergencies/ukraine/#:~:text=About%20the%20Crisis%20in%20Ukraine,inside%20the%20country%20so%20far." target="_blank">reports</a> that 7.1 million people have been displaced because of the war.
      </p>
      <p>
        By May 4, the United Nations' civilian death toll in Ukraine related to Russian invasion <a href="https://www.ohchr.org/en/news/2022/05/ukraine-civilian-casualty-update-5-may-2022" target="_blank">recorded</a> 3,280 fatalities and 3,451 injuries.
      </p>
    </div>
  </section>
</div>
</Scroller>
<Footer />