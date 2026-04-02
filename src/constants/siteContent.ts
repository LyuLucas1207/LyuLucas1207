import {
  Aperture,
  BookHeart,
  Box,
  Mail,
  Orbit,
  Radar,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { ROUTES } from '../navigations/routes'
import type { NavigationItem } from '@/types'

export const navigationItems: NavigationItem[] = [
  { labelKey: 'navigation.world', path: ROUTES.HOME },
  { labelKey: 'navigation.intro', path: ROUTES.INTRO },
  { labelKey: 'navigation.projects', path: ROUTES.PROJECTS },
  { labelKey: 'navigation.life', path: ROUTES.LIFE },
  { labelKey: 'navigation.highlights', path: ROUTES.HIGHLIGHTS },
  { labelKey: 'navigation.contact', path: ROUTES.CONTACT },
]

export const socialLinks = [
  { labelKey: 'social.github', href: 'https://github.com/lyulucas1207' },
  { labelKey: 'social.linkedin', href: 'https://linkedin.com/in/lyulucas' },
  { labelKey: 'social.mail', href: 'mailto:hello@lyulucas.dev' },
]

export const worldPillars: Array<{
  id: 'identity' | 'work' | 'records' | 'experience' | 'contact'
  path: string
  icon: LucideIcon
}> = [
  {
    id: 'identity',
    path: ROUTES.INTRO,
    icon: BookHeart,
  },
  {
    id: 'work',
    path: ROUTES.PROJECTS,
    icon: Box,
  },
  {
    id: 'records',
    path: ROUTES.LIFE,
    icon: Aperture,
  },
  {
    id: 'experience',
    path: ROUTES.HIGHLIGHTS,
    icon: Radar,
  },
  {
    id: 'contact',
    path: ROUTES.CONTACT,
    icon: Mail,
  },
]

export const highlightIconMap: Record<string, LucideIcon> = {
  Orbit,
  Sparkles,
  Radar,
}

export const accentClassMap = {
  amber: 'amber',
  cosmic: 'cosmic',
  forest: 'forest',
  rose: 'rose',
} as const

export const lifeTypes = ['all', 'note', 'moment', 'snapshot', 'ritual'] as const

export const projectGroups = ['all', 'featured', 'systems', 'experimental'] as const

export const worldSignals = [
  {
    id: 'premium',
  },
  {
    id: 'editorial',
  },
  {
    id: 'layered',
  },
] as const
