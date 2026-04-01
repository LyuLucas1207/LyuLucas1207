export const starfieldFragmentShader = `
  varying vec3 vColor;
  varying float vPulse;
  uniform float uOpacity;

  void main() {
    vec2 centered = gl_PointCoord - vec2(0.5);
    float dist = length(centered);
    float glow = smoothstep(0.55, 0.04, dist);
    float core = smoothstep(0.16, 0.0, dist);
    float alpha = (glow * 0.58 + core) * uOpacity * vPulse;
    if (alpha < 0.014) discard;
    gl_FragColor = vec4(vColor + vec3(core * 0.22), alpha);
  }
`
