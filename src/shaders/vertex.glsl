uniform float uSize;
uniform float uTime;
uniform float uVelocity;
uniform float uIndex;
uniform float uIsStarted;
uniform float uIsPaused;

attribute vec3 aCubeOrigPosition;
attribute vec3 aCubeDestPosition;
attribute vec3 aCubeFinalPosition;
attribute float aCountryIndex;
attribute float aDay;

// Store current position
varying vec4 vCurrentPosition;

void main() {
  /**
  * Position
  */
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  if(uIsStarted == 1.0 && uIndex == 5.0)
    modelPosition = modelMatrix * vec4(aCubeOrigPosition, 1.0);
  if(uIndex == 6.0)
    modelPosition = modelMatrix * vec4(aCubeDestPosition, 1.0);
  if(uIndex >= 7.0)
    modelPosition = modelMatrix * vec4(aCubeFinalPosition, 1.0);

  // Get difference from destination and current position
  vec4 diffPos = vCurrentPosition;
  if (uIsStarted == 0.0 && uIndex == 5.0)
    diffPos = vec4(aCubeOrigPosition, 1.0) - vCurrentPosition;
  else if (uIsStarted == 1.0 && uIndex == 5.0)
    diffPos = vec4(aCubeDestPosition, 1.0) - vCurrentPosition;

  // Move
  if (uIsStarted == 0.0 && uIndex == 5.0 && uTime > 1.0)
    modelPosition += diffPos * (uTime - 1.0) * uVelocity;
  else if (uIsStarted == 1.0 && aDay < uTime && uIsPaused == 0.0)
    modelPosition += diffPos * (uTime - aDay);
    // modelPosition.x += uTime * 0.01;
  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;
  vCurrentPosition = projectedPosition;

  /**
  * Size
  */
  float size = uSize;
  // if (uIndex >= 5.0 && aCountryIndex != 0.0)
  //   size = uSize * 3.0;
  gl_PointSize = size;
}