import type { QueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { worldEventEmitter, worldEvents } from '@/events/world'

/**
 * World 数据查询失效（与 constants/queryKeys、hooks/useWorld 对应）
 * 使用 queryKey 前缀匹配所有 locale 变体
 */
export function useWorldCacheInvalidation(queryClient: QueryClient) {
  useEffect(() => {
    const handleInvalidateAll = () => {
      void queryClient.invalidateQueries({ queryKey: ['world'] })
    }

    const handleInvalidateProfile = () => {
      void queryClient.invalidateQueries({ queryKey: ['world', 'profile'] })
    }

    const handleInvalidateProjects = () => {
      void queryClient.invalidateQueries({ queryKey: ['world', 'projects'] })
    }

    const handleInvalidateHighlights = () => {
      void queryClient.invalidateQueries({ queryKey: ['world', 'highlights'] })
    }

    const handleInvalidateTimeline = () => {
      void queryClient.invalidateQueries({ queryKey: ['world', 'timeline'] })
    }

    const handleInvalidateLifeRecords = () => {
      void queryClient.invalidateQueries({ queryKey: ['world', 'life-records'] })
    }

    worldEventEmitter.on(worldEvents.INVALIDATE_ALL, handleInvalidateAll)
    worldEventEmitter.on(worldEvents.INVALIDATE_PROFILE, handleInvalidateProfile)
    worldEventEmitter.on(worldEvents.INVALIDATE_PROJECTS, handleInvalidateProjects)
    worldEventEmitter.on(worldEvents.INVALIDATE_HIGHLIGHTS, handleInvalidateHighlights)
    worldEventEmitter.on(worldEvents.INVALIDATE_TIMELINE, handleInvalidateTimeline)
    worldEventEmitter.on(worldEvents.INVALIDATE_LIFE_RECORDS, handleInvalidateLifeRecords)

    return () => {
      worldEventEmitter.off(worldEvents.INVALIDATE_ALL, handleInvalidateAll)
      worldEventEmitter.off(worldEvents.INVALIDATE_PROFILE, handleInvalidateProfile)
      worldEventEmitter.off(worldEvents.INVALIDATE_PROJECTS, handleInvalidateProjects)
      worldEventEmitter.off(worldEvents.INVALIDATE_HIGHLIGHTS, handleInvalidateHighlights)
      worldEventEmitter.off(worldEvents.INVALIDATE_TIMELINE, handleInvalidateTimeline)
      worldEventEmitter.off(worldEvents.INVALIDATE_LIFE_RECORDS, handleInvalidateLifeRecords)
    }
  }, [queryClient])
}
