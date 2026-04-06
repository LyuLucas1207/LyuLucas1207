export const PLANET_GLB_URLS: string[] = [
  '/textures/planets/blue/Aqualis.glb',
  '/textures/planets/blue/Azurion.glb',
  '/textures/planets/blue/Elyra.glb',
  '/textures/planets/blue/Nerulia.glb',
  '/textures/planets/blue/Thalora.glb',
  '/textures/planets/brown/Cindor.glb',
  '/textures/planets/brown/Dustara.glb',
  '/textures/planets/brown/Ochrion.glb',
  '/textures/planets/brown/Terranis.glb',
  '/textures/planets/green/Emerion.glb',
  '/textures/planets/green/Sylvara.glb',
  '/textures/planets/green/Verdara.glb',
  '/textures/planets/pink/Amethra.glb',
  '/textures/planets/pink/Nyxara.glb',
  '/textures/planets/pink/Rosellea.glb',
  '/textures/planets/red/Crimora.glb',
  '/textures/planets/red/Ignara.glb',
  '/textures/planets/red/Pyronis.glb',
  '/textures/planets/red/Ruberra.glb',
  '/textures/planets/red/Vulkara.glb',
  '/textures/planets/white/Frostra.glb',
  '/textures/planets/white/Ivoria.glb',
  '/textures/planets/white/Lumera.glb',
  '/textures/planets/white/Lunaris.glb',
  '/textures/planets/white/Nivalis.glb',
]

export const SATELLITES_GLB_URLS: string[] = [
  '/textures/satellites/Ashara.glb',
  '/textures/satellites/Crimvex.glb',
  '/textures/satellites/Duskar.glb',
  '/textures/satellites/Vermora.glb',
]

/** 星环径向条带 PNG（横向=半径、竖向=周向可 repeat） */
export const RING_RADIAL_STRIP_URLS: string[] = ['/textures/rings/ring1.png']

/** 各恒星系统随机恒星 GLB */
export const STELLAR_GLB_URLS: string[] = [
  '/textures/stellars/Astrax.glb',
  '/textures/stellars/Coruscant.glb',
  '/textures/stellars/Crimora.glb',
  '/textures/stellars/Solvrax.glb',
  '/textures/stellars/Vorthalis.glb',
]

/** 宇宙全景/天空背景图（2:1 equirectangular 最佳；`Scene.background`） */
export const UNIVERSE_BACKGROUND_URLS: string[] = [
  '/textures/universes/universe1.jpg',
  '/textures/universes/universe2.jpg',
]

export const UNIVERSE_SHADERS = {
  starfield: {
    vertex: '/shaders/starfield.vert.glsl',
    fragment: '/shaders/starfield.frag.glsl',
  },
  coreShell: {
    vertex: '/shaders/coreShell.vert.glsl',
    fragment: '/shaders/coreShell.frag.glsl',
  },
} as const
