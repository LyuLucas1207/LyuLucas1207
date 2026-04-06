import type { LanguageEnum } from 'nfx-ui/languages'
import { makeStore } from 'nfx-ui/stores'
import type { ThemeEnum } from 'nfx-ui/themes'
import type { Nullable } from 'nfx-ui/types'
import { safeNullable } from 'nfx-ui/utils'

import { ROUTES } from '@/navigations/routes'

export type TransitionType = 'theme' | 'page' | 'language'

type PageKey = string

type ThemeTransitionRequest = {
  type: 'theme'
  theme: ThemeEnum
  title?: string
  subtitle?: string
  id: number
}

type PageTransitionRequest = {
  type: 'page'
  page: PageKey
  title?: string
  subtitle?: string
  id: number
}

type LanguageTransitionRequest = {
  type: 'language'
  language: LanguageEnum
  title?: string
  subtitle?: string
  id: number
}

export type TransitionRequest = ThemeTransitionRequest | PageTransitionRequest | LanguageTransitionRequest

type BaseTransitionOptions = {
  title?: string
  subtitle?: string
  action?: () => void
}

export type PlayWorldTransitionOptions =
  | (BaseTransitionOptions & {
      type: 'theme'
      theme: ThemeEnum
    })
  | (BaseTransitionOptions & {
      type: 'page'
      page: PageKey
    })
  | (BaseTransitionOptions & {
      type: 'language'
      language: LanguageEnum
    })

type TransitionState = {
  request: Nullable<TransitionRequest>
  /** 「重新飞入」：`EndingTransition` 与 `PageTransitionOverlay` 同源入场，无收口，播完即 reload */
  endingRefly: boolean
}

type TransitionActions = {
  playWorldTransition: (options: PlayWorldTransitionOptions) => void
  handleMidpoint: () => void
  handleComplete: () => void
  startEndingRefly: () => void
  clearEndingRefly: () => void
}

let runningRef = false
let pendingActionRef: Nullable<() => void> = null

/** 页面过场导航到 World 结束时置位，供 EnteringTransition 吞掉「过场结束后误当作冷启动」的一帧 */
let worldEntryHandledByPageTransition = false

export function consumeWorldEntryHandledByPageTransition(): boolean {
  const v = worldEntryHandledByPageTransition
  worldEntryHandledByPageTransition = false
  return v
}

const { store: TransitionStore, useStore: useTransitionStore } = makeStore<TransitionState, TransitionActions>(
  {
    request: null,
    endingRefly: false,
  },
  (set) => ({
    startEndingRefly: () => {
      if (runningRef || TransitionStore.getState().request != null) return
      set({ endingRefly: true })
    },

    clearEndingRefly: () => set({ endingRefly: false }),

    playWorldTransition: (options) => {
      if (runningRef) return

      runningRef = true
      pendingActionRef = safeNullable(options.action)

      const id = Date.now()

      if (options.type === 'theme') {
        set({
          request: {
            id,
            type: 'theme',
            theme: options.theme,
            title: options.title,
            subtitle: options.subtitle,
          },
        })
        return
      }

      if (options.type === 'language') {
        set({
          request: {
            id,
            type: 'language',
            language: options.language,
            title: options.title,
            subtitle: options.subtitle,
          },
        })
        return
      }

      set({
        request: {
          id,
          type: 'page',
          page: options.page,
          title: options.title,
          subtitle: options.subtitle,
        },
      })
    },

    handleMidpoint: () => {
      pendingActionRef?.()
      pendingActionRef = null
    },

    handleComplete: () => {
      const req = TransitionStore.getState().request
      const wasPageWorld = req?.type === 'page' && req.page === ROUTES.WORLD
      if (wasPageWorld) {
        worldEntryHandledByPageTransition = true
      }
      runningRef = false
      pendingActionRef = null
      set({ request: null })
    },
  }),
)

export { TransitionStore, useTransitionStore }

export const playWorldTransition = (options: PlayWorldTransitionOptions) =>
  TransitionStore.getState().playWorldTransition(options)

export const startEndingRefly = () => TransitionStore.getState().startEndingRefly()