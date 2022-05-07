<script>
    import { Map, controls } from '@beyonk/svelte-mapbox';
    import { onMount } from 'svelte';

    import MapOverlay from './MapOverlay.svelte';
    import CanvasContainer from './CanvasContainer.svelte';
    import OverlaySummary from './OverlaySummary.svelte';

    export let data;
    export let width;
    export let index;
    export let day;
    export let isStarted;
    export let isPaused;
    let height;

    let centroidsD = data[0];
    let refugeesD = data[1];
    let conflictsD = data[2];
    let borderCrossingsD = data[3];
    let eventsD = data[4];
    let totalRefugeesD = data[5];
    let populationD = data[6];
    let groupedD = data[7];

    $: overlayClass = index <= 4 ? "" : "clear"

    const { GeolocateControl, NavigationControl, ScaleControl } = controls;
    let mapComponent;
    const coordinates = [31.268015, 49.007897];
    const bounds = [
      [-25.856836931768644, 14.595005661547093],
      [90.62592261775329, 65.00740824298519]
    ]
    
    onMount(async () => {
      mapComponent.setZoom(4.5);
    })
</script>

<style>
  div {
    height: 100%;
  }
  .map-container {
    transition: all 0.4s ease;
  }
  .overlay-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    background: radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 90%, rgba(0,0,0,1) 100%);
    z-index: 3;
    transition: all 0.4s ease;
    /* pointer-events: none; */
  }
  .clear {
    background: rgba(0, 0, 0, 0);
  }
  .canvas-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  }
</style>

<div class="map-container" bind:clientHeight={height}>
  <Map
    accessToken="pk.eyJ1IjoieXVyaWtvLXNjaHVtYWNoZXIiLCJhIjoiY2ttNDVoemgyMDFjcDJxdXM5cWx5d3FzdiJ9.Ajc4ZM1IbKLbRPSkrBJNrA"
    bind:this={ mapComponent }
    style="mapbox://styles/yuriko-schumacher/cl1z3gr3v000c15p53ciow8w2"
    options={{ scrollZoom: false, maxBounds: bounds, minZoom: 3, center: coordinates }}
  >
    {#if index >= 4}
      <div class="canvas-container">
        <CanvasContainer {width} {height} {index} map={mapComponent} {data} {isStarted} {isPaused} />
      </div>
    {/if}
    <div class="overlay-container {overlayClass}">
      <MapOverlay data={[centroidsD, borderCrossingsD, groupedD]} map={mapComponent} {width} {height} {index} {isStarted} {day} />
      {#if isStarted || index == 6}
        <OverlaySummary {width} {height} {index} {day} {totalRefugeesD} {isStarted} {eventsD} />
      {/if}
    </div>
  </Map>
</div>