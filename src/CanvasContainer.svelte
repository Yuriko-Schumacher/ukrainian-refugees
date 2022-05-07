<script>
  import Canvas from './Canvas.svelte';

  export let width;
  export let height;
  export let index;
  export let map;
  export let data;
  export let isStarted;
  export let isPaused;
</script>

<style>
</style>

<div class="three-canvas">
  <Canvas {width} {height} {index} {data} {map} {isStarted} {isPaused} />
</div>
