export interface StarshipChaseCamConfig {
  fov: number
  near: number
  far: number
  localX: number
  localY: number
  localZ: number
  /** 跟船拖拽 pitch 夹紧（弧度），与 `CameraRig` 一致 */
  orbitPitchLimit: number
}

export interface StarshipGlowConfig {
  emissiveHex: number
  emissiveIntensity: number
  pointColor: number
  pointIntensity: number
  pointDistance: number
  pointDecay: number
}

export interface StarshipPoseConfig {
  /** 机头对准弦线方向的趋近速率；越大越跟手，越小换目标时越柔顺（指数 lerp） */
  headingSlerp: number
  bankSlerp: number
  maxBank: number
  bankGain: number
  /** `Matrix4.lookAt` 世界 up */
  worldUp: readonly [number, number, number]
  modelYawCorrection: number
  modelPitchCorrection: number
  modelRollCorrection: number
}

export interface StarshipConfig {
  glbUrl: string
  modelRadius: number
  /** 世界单位/秒，每帧朝终点方向推进 */
  cruiseSpeed: number
  /** 世界单位/秒²；每段初速 `cruiseSpeed`，飞行中每帧沿航线 `+= alongAcceleration * delta`，不设上限 */
  alongAcceleration: number
  /** 世界单位/秒²；进入到达范围后的休息阶段沿航线 `alongSpeed` 每帧扣减，最低为 0 */
  alongDeceleration: number
  chaseCam: StarshipChaseCamConfig
  glow: StarshipGlowConfig
  pose: StarshipPoseConfig
}
