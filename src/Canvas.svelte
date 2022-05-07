<script>
  import { afterUpdate } from 'svelte';
  import * as THREE from "three";

  import vertexShader from "./shaders/vertex.glsl";
  import fragmentShader from "./shaders/fragment.glsl";

  import { projectPointNormalized, getCubeWidth, getCubePosition, getCountryDestPos, getFinalPos } from './helper'

  export let width;
  export let height;
  export let index;
  export let map;
  export let data;
  export let isStarted;
  export let isPaused;

  let refugeesD = data[1];
  let totalRefugeesD = data[5];
  let populationD = data[6];

  let cubeWidth = getCubeWidth(width, height)

  $: console.log(index);
  $: isStartedValue = isStarted ? 1 : 0;
  $: isPausedValue = isPaused ? 1 : 0;

  afterUpdate(() => {
    /**
     * Base
     */    
    // Canvas
    const canvas = document.querySelector("canvas.webgl");

    // Scene
    const scene = new THREE.Scene();

    /**
     * Particles
     */
    const parameters = {};
    parameters.count = populationD.features.length;
    parameters.size = 0.65;
    parameters.cubeOrigSize = 0.25;

    let geometry = null;
    let material = null;
    let points = null;

    const generateParticles = () => {
      /**
       * Geometry
       */
      geometry = new THREE.BufferGeometry();

      const geoPosition = new Float32Array(parameters.count * 3);
      const cubeOrigPosition = new Float32Array(parameters.count * 3);
      const cubeDestPosition = new Float32Array(parameters.count * 3);
      const cubeFinalPosition = new Float32Array(parameters.count * 3);
      const countryIndex = new Float32Array(parameters.count);
      const day = new Float32Array(parameters.count);

      populationD.features.forEach((d, i) => {
        const i3 = i * 3;

        // Geo position
        geoPosition[i3 + 0] = projectPointNormalized(map, d.geometry.coordinates[0], d.geometry.coordinates[1], width, height).x;
        geoPosition[i3 + 1] = projectPointNormalized(map, d.geometry.coordinates[0], d.geometry.coordinates[1], width, height).y;
        geoPosition[i3 + 2] = 0;

        // Original cube position
        cubeOrigPosition[i3 + 0] = (Math.random() - 0.5) * parameters.cubeOrigSize;
        cubeOrigPosition[i3 + 1] = (Math.random() - 0.5) * parameters.cubeOrigSize;
        cubeOrigPosition[i3 + 2] = 0;

        // Destination cube position
        const destPos = getCountryDestPos(d.properties.countryIndex);

        cubeDestPosition[i3 + 0] = ((Math.random() - 0.5) + destPos.x * 1.2) * parameters.cubeOrigSize;
        cubeDestPosition[i3 + 1] = ((Math.random() - 0.5) + destPos.y * 1.2) * parameters.cubeOrigSize;
        cubeDestPosition[i3 + 2] = 0;

        // Final position
        const finalPos = getFinalPos(d.properties.countryIndex);

        cubeFinalPosition[i3 + 0] = ((Math.random() - 0.5) + finalPos.x) * parameters.cubeOrigSize;
        cubeFinalPosition[i3 + 1] = ((Math.random() - 0.5) + finalPos.y) * parameters.cubeOrigSize;
        cubeFinalPosition[i3 + 2] = 0;

        // Country Index
        countryIndex[i] = d.properties.countryIndex;

        // Day
        day[i] = d.properties.day;
      })

      geometry.setAttribute("position", new THREE.BufferAttribute(geoPosition, 3));
      geometry.setAttribute("aCubeOrigPosition", new THREE.BufferAttribute(cubeOrigPosition, 3));
      geometry.setAttribute("aCubeDestPosition", new THREE.BufferAttribute(cubeDestPosition, 3));
      geometry.setAttribute("aCubeFinalPosition", new THREE.BufferAttribute(cubeFinalPosition, 3));
      geometry.setAttribute("aCountryIndex", new THREE.BufferAttribute(countryIndex, 1));
      geometry.setAttribute("aDay", new THREE.BufferAttribute(day, 1));

      /**
       * Material
       */
      material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        vertexShader,
        fragmentShader,
        uniforms: {
          uSize: { value: parameters.size * renderer.getPixelRatio() },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("rgb(128, 187, 255)") },
          uVelocity: { value: 10 },
          uIndex: { value: index },
          uIsStarted: { value: isStartedValue },
          uIsPaused: { value: isPausedValue}
        },
      });

      /**
       * Points
       */
      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      100
    );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0.6;
    scene.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * Generate particles
     */
    generateParticles();

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let tickCount = 0;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update material
      material.uniforms.uTime.value = elapsedTime;

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      if(!isPaused) {
        window.requestAnimationFrame(tick);
      }
    };
    tick();
  })
</script>

<style>
  canvas.webgl {
    transition: all 0.4s ease;
  }
</style>

<canvas class="webgl"></canvas>

