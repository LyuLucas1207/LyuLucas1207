import * as THREE from 'three'

export function buildStarMaterial(
  baseSize: number,
  opacity: number,
  isLight: boolean,
  vertexShader: string,
  fragmentShader: string,
) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    // `isLight` now means `glowOn`: glow uses additive blending.
    blending: isLight ? THREE.AdditiveBlending : THREE.NormalBlending,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uBaseSize: { value: baseSize },
      uOpacity: { value: opacity },
    },
    vertexShader,
    fragmentShader,
  })
}
