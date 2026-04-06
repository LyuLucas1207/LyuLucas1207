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

/** 宇宙全景绕 **世界 Y（竖直）** 转动，弧度/秒；用 `Scene.backgroundRotation`（等距图会先烘成 cubemap，改 texture.offset 无效） */
export const UNIVERSE_BACKGROUND_Y_RADIANS_PER_SEC = 0.055

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
  radius: 130,
  startAngle: -Math.PI / 2,
}

/** 跟焦整个星系（`group` 锚点 / 恒星） */
export const UNIVERSE_SYSTEM_FOCUS = {
  heightOffset: 16,
  distanceOffset: 26,
  lerp: 0.08,
}

/** 跟焦单颗行星（`follow` 为行星 body）；与星系参数分开调 */
export const UNIVERSE_PLANET_FOCUS = {
  heightOffset: 26,
  lerp: 0.08,
  /** 行星局部 +Z 视距 = planetRadius × 该系数（原先用 1.5 过近） */
  radiusToCameraFactor: 3.45,
}
