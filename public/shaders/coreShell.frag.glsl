varying vec3 vNormal;
varying vec3 vView;
uniform vec3 uColor;
uniform float uOpacity;

void main() {
  float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.4);
  gl_FragColor = vec4(uColor, fresnel * uOpacity);
}
