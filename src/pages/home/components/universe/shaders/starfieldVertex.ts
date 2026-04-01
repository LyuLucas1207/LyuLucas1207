export const starfieldVertexShader = `
  attribute float aSize;
  attribute float aPhase;
  attribute float aDepth;
  varying vec3 vColor;
  varying float vPulse;
  uniform float uTime;
  uniform float uBaseSize;
  uniform float uPixelRatio;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float pulse = 0.76 + (sin(uTime * aPhase) + 1.0) * 0.2;
    float attenuation = uBaseSize * aSize * aDepth * uPixelRatio / max(0.12, -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = attenuation * pulse;
    vPulse = pulse;
    vColor = color;
  }
`
