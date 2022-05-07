uniform vec3 uColor;

void main() {
  // Disc
  // float strength = distance(gl_PointCoord, vec2(0.5));
  // strength *= 2.0;
  // strength = 1.0 - strength;

  // Final color
  // vec3 color = mix(vec3(0.0), uColor, strength);
  gl_FragColor = vec4(uColor, 1);
}