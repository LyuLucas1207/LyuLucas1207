import type { EventNamesOf } from 'nfx-ui/events'
import { defineEvents, EventEmitter } from 'nfx-ui/events'
import { singleton } from 'nfx-ui/utils'

/** 与 `constants/queryKeys` 中的 world 查询一一对应，供任意模块触发缓存失效 */
export const worldEvents = defineEvents({
  INVALIDATE_ALL: 'WORLD:INVALIDATE_ALL',
  INVALIDATE_PROFILE: 'WORLD:INVALIDATE_PROFILE',
  INVALIDATE_PROJECTS: 'WORLD:INVALIDATE_PROJECTS',
  INVALIDATE_HIGHLIGHTS: 'WORLD:INVALIDATE_HIGHLIGHTS',
  INVALIDATE_TIMELINE: 'WORLD:INVALIDATE_TIMELINE',
  INVALIDATE_LIFE_RECORDS: 'WORLD:INVALIDATE_LIFE_RECORDS',
})

type WorldEvent = EventNamesOf<typeof worldEvents>

class WorldEventEmitter extends EventEmitter<WorldEvent> {
  constructor() {
    super(worldEvents)
  }

  invalidateAll() {
    this.emit(worldEvents.INVALIDATE_ALL)
  }

  invalidateProfile() {
    this.emit(worldEvents.INVALIDATE_PROFILE)
  }

  invalidateProjects() {
    this.emit(worldEvents.INVALIDATE_PROJECTS)
  }

  invalidateHighlights() {
    this.emit(worldEvents.INVALIDATE_HIGHLIGHTS)
  }

  invalidateTimeline() {
    this.emit(worldEvents.INVALIDATE_TIMELINE)
  }

  invalidateLifeRecords() {
    this.emit(worldEvents.INVALIDATE_LIFE_RECORDS)
  }
}

export const worldEventEmitter = new (singleton(WorldEventEmitter))()
