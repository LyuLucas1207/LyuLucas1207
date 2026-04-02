import { ThemeEnum, type ColorVariables } from 'nfx-ui/themes'

import type { UniversePalette } from './types'

export function buildUniversePalette(themeEnum: ThemeEnum, vars: ColorVariables): UniversePalette {
  switch (themeEnum) {
    case ThemeEnum.DEFAULT: {
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart3, vars.chart4, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.chart2]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.chart1, vars.chart2, vars.primaryLight, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart2, vars.primaryLight, vars.chart5]
      const nebulaColorPool = [vars.primaryLight, vars.chart3, vars.chart5]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: true,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: true,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: true,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: true,
        ring: { bandColorPool: ringColorPool },
        isRingLight: true,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: true,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: true,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: true,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: true,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: true,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.chart5,
      }
    }
    case ThemeEnum.LIGHT: {
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart3, vars.chart4, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.chart2]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.chart1, vars.chart2, vars.primaryLight, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart2, vars.primaryLight, vars.chart5]
      const nebulaColorPool = [vars.primaryLight, vars.chart3, vars.chart5]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: true,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: true,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: true,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: true,
        ring: { bandColorPool: ringColorPool },
        isRingLight: true,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: true,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: true,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: true,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: true,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: true,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.chart5,
      }
    }
    case ThemeEnum.CORPORATE: {
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart3, vars.chart4, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.chart2]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.chart1, vars.chart2, vars.primaryLight, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart2, vars.primaryLight, vars.chart5]
      const nebulaColorPool = [vars.primaryLight, vars.chart3, vars.chart5]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: true,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: true,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: true,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: true,
        ring: { bandColorPool: ringColorPool },
        isRingLight: true,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: true,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: true,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: true,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: true,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: true,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.chart5,
      }
    }
    case ThemeEnum.FOREST: {
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart3, vars.chart4, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.chart2]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.chart1, vars.chart2, vars.primaryLight, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart2, vars.primaryLight, vars.chart5]
      const nebulaColorPool = [vars.primaryLight, vars.chart3, vars.chart5]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: true,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: true,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: true,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: true,
        ring: { bandColorPool: ringColorPool },
        isRingLight: true,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: true,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: true,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: true,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: true,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: true,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.chart5,
      }
    }
    case ThemeEnum.WHEAT: {
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart3, vars.chart4, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.chart2]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.chart1, vars.chart2, vars.primaryLight, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart2, vars.primaryLight, vars.chart5]
      const nebulaColorPool = [vars.primaryLight, vars.chart3, vars.chart5]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: true,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: true,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: true,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: true,
        ring: { bandColorPool: ringColorPool },
        isRingLight: true,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: true,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: true,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: true,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: true,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: true,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.chart5,
      }
    }

    case ThemeEnum.DARK: {
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart4, vars.primaryLight, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.primaryLight]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.primaryLight, vars.chart1, vars.chart2, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart5, vars.primaryLight, vars.chart2]
      const nebulaColorPool = [vars.fgHighlight, vars.primaryLight, vars.chart5, vars.chart3]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: false,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: false,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: false,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: false,
        ring: { bandColorPool: ringColorPool },
        isRingLight: false,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: false,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: false,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: false,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: false,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: false,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.fgHighlight,
      }
    }
    case ThemeEnum.COSMIC: {
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart4, vars.primaryLight, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.primaryLight]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.primaryLight, vars.chart1, vars.chart2, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart5, vars.primaryLight, vars.chart2]
      const nebulaColorPool = [vars.fgHighlight, vars.primaryLight, vars.chart5, vars.chart3]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: false,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: false,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: false,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: false,
        ring: { bandColorPool: ringColorPool },
        isRingLight: false,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: false,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: false,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: false,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: false,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: false,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.fgHighlight,
      }
    }
    case ThemeEnum.COFFEE: {
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart4, vars.primaryLight, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.primaryLight]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.primaryLight, vars.chart1, vars.chart2, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart5, vars.primaryLight, vars.chart2]
      const nebulaColorPool = [vars.fgHighlight, vars.primaryLight, vars.chart5, vars.chart3]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: false,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: false,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: false,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: false,
        ring: { bandColorPool: ringColorPool },
        isRingLight: false,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: false,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: false,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: false,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: false,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: false,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.fgHighlight,
      }
    }
    case ThemeEnum.WINE: {
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart4, vars.primaryLight, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.primaryLight]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.primaryLight, vars.chart1, vars.chart2, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart5, vars.primaryLight, vars.chart2]
      const nebulaColorPool = [vars.fgHighlight, vars.primaryLight, vars.chart5, vars.chart3]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: false,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: false,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: false,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: false,
        ring: { bandColorPool: ringColorPool },
        isRingLight: false,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: false,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: false,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: false,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: false,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: false,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.fgHighlight,
      }
    }
    default: {
      // Fallback: behave like default theme
      const planetColorPool = [vars.chart1, vars.chart2, vars.chart3, vars.chart4, vars.chart5]
      const ringColorPool = [vars.chart4, vars.chart5, vars.chart2]
      const satelliteColorPool = [vars.chart2, vars.chart3, vars.chart5]
      const streamColorPool = [vars.chart1, vars.chart2, vars.primaryLight, vars.chart5]
      const vortexColorPool = [vars.chart4, vars.chart2, vars.primaryLight, vars.chart5]
      const nebulaColorPool = [vars.primaryLight, vars.chart3, vars.chart5]
      const orbitColorPool = [vars.primaryLight, vars.chart2, vars.chart4]

      return {
        label: { color: vars.fgHighlight },
        isLabelLight: true,
        nebula: { colorPool: nebulaColorPool },
        isNebulaLight: true,
        orbit: { colorPool: orbitColorPool },
        isOrbitLight: true,
        planet: { surfaceColorPool: planetColorPool },
        isPlanetLight: true,
        ring: { bandColorPool: ringColorPool },
        isRingLight: true,
        satellite: { surfaceColorPool: satelliteColorPool },
        isSatelliteLight: true,
        stellar: {
          coreColor: vars.primary,
          shellColor: vars.primaryLight,
          shellFallbackColor: vars.fgHighlight,
          haloColor: vars.primaryLight,
          keyLightColor: vars.fgHighlight,
          rimLightColor: vars.primaryLight,
        },
        isStellarLight: true,
        stream: { particleColorPool: streamColorPool },
        isStreamLight: true,
        vortex: { particleColorPool: vortexColorPool },
        isVortexLight: true,
        sceneBg: vars.bg,
        sceneFogColor: vars.bg3,
        sceneIsLight: true,
        sceneGlowPrimaryColor: vars.primaryLight,
        sceneGlowAccentColor: vars.chart5,
      }
    }
  }
}
