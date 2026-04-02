import type { EventNamesOf } from 'nfx-ui/events'
import { defineEvents, EventEmitter } from 'nfx-ui/events'
import { singleton } from 'nfx-ui/utils'

export const routerEvents = defineEvents({
  NAVIGATE: 'ROUTER:NAVIGATE',
  NAVIGATE_REPLACE: 'ROUTER:NAVIGATE_REPLACE',
  NAVIGATE_BACK: 'ROUTER:NAVIGATE_BACK',
  NAVIGATE_TO_HOME: 'ROUTER:NAVIGATE_TO_HOME',
  NAVIGATE_TO_INTRO: 'ROUTER:NAVIGATE_TO_INTRO',
  NAVIGATE_TO_PROJECTS: 'ROUTER:NAVIGATE_TO_PROJECTS',
  NAVIGATE_TO_LIFE: 'ROUTER:NAVIGATE_TO_LIFE',
  NAVIGATE_TO_HIGHLIGHTS: 'ROUTER:NAVIGATE_TO_HIGHLIGHTS',
  NAVIGATE_TO_CONTACT: 'ROUTER:NAVIGATE_TO_CONTACT',
})

type RouterEvent = EventNamesOf<typeof routerEvents>

export interface NavigatePayload {
  to: string
  replace?: boolean
  state?: unknown
}

class RouterEventEmitter extends EventEmitter<RouterEvent> {
  constructor() {
    super(routerEvents)
  }

  navigate(payload: NavigatePayload) {
    this.emit(routerEvents.NAVIGATE, payload)
  }

  navigateReplace(to: string, state?: unknown) {
    this.emit(routerEvents.NAVIGATE_REPLACE, { to, state })
  }

  navigateBack() {
    this.emit(routerEvents.NAVIGATE_BACK)
  }

  navigateToHome() {
    this.emit(routerEvents.NAVIGATE_TO_HOME)
  }

  navigateToIntro() {
    this.emit(routerEvents.NAVIGATE_TO_INTRO)
  }

  navigateToProjects() {
    this.emit(routerEvents.NAVIGATE_TO_PROJECTS)
  }

  navigateToLife() {
    this.emit(routerEvents.NAVIGATE_TO_LIFE)
  }

  navigateToHighlights() {
    this.emit(routerEvents.NAVIGATE_TO_HIGHLIGHTS)
  }

  navigateToContact() {
    this.emit(routerEvents.NAVIGATE_TO_CONTACT)
  }
}

export const routerEventEmitter = new (singleton(RouterEventEmitter))()
