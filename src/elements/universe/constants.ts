export const UNIVERSE_CAMERA_POSITION = {
  x: 0,
  y: 54,
  z: 210,
}

export const UNIVERSE_LOOK_AT = {
  x: 0,
  y: 0,
  z: 0,
}

export const UNIVERSE_FOG = {
  light: 0.00024,
  dark: 0.00095,
}

export const UNIVERSE_ROTATION_SPEED = {
  coreLight: 0.00055,
  coreDark: 0.0008,
  driftLight: 0,
  driftDark: 0,
}

export const UNIVERSE_CAMERA_DRIFT = {
  xAmplitude: 0,
  yAmplitude: 0,
}

export const UNIVERSE_MOTION = {
  yawLerp: 0.08,
  pitchLerp: 0.08,
  wheelForce: 0.85,
  wheelClamp: 7.5,
  thrustDecay: 0.84,
  velocityDecay: 0.92,
  keyAcceleration: 0.1,
  keyVerticalAcceleration: 0.068,
  keyMaxSpeed: 2.8,
}

export const UNIVERSE_CAMERA_LIMITS = {
  x: 260,
  yMin: -50,
  yMax: 100,
  z: 320,
}


export const UNIVERSE_SYSTEM_LAYOUT = {
  radius: 112,
  startAngle: -Math.PI / 2,
}

export const UNIVERSE_SYSTEM_FOCUS = {
  heightOffset: 19,
  distanceOffset: 26,
  lerp: 0.08,
}
