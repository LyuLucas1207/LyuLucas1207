import { makeStore } from 'nfx-ui/stores'
import type { ThemeEnum } from 'nfx-ui/themes'

export type TransitionType = 'theme' | 'page'

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

export type TransitionRequest = ThemeTransitionRequest | PageTransitionRequest

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

type TransitionState = {
  request: TransitionRequest | null
}

type TransitionActions = {
  playWorldTransition: (options: PlayWorldTransitionOptions) => void
  handleMidpoint: () => void
  handleComplete: () => void
}

let runningRef = false
let pendingActionRef: (() => void) | null = null

const { store: TransitionStore, useStore: useTransitionStore } = makeStore<TransitionState, TransitionActions>(
  {
    request: null,
  },
  (set) => ({
    playWorldTransition: (options) => {
      if (runningRef) return

      runningRef = true
      pendingActionRef = options.action ?? null

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
      runningRef = false
      pendingActionRef = null
      set({ request: null })
    },
  }),
)

export { TransitionStore, useTransitionStore }

export const playWorldTransition = (options: PlayWorldTransitionOptions) =>
  TransitionStore.getState().playWorldTransition(options)