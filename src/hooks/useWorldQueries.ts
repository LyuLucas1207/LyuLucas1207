import { useQuery } from '@tanstack/react-query'

import {
  fetchHighlights,
  fetchLifeRecords,
  fetchProfile,
  fetchProjects,
  fetchTimeline,
} from '../apis/worldApi'
import { useLocale } from './useLocale'
import {
  localizeHighlight,
  localizeLifeRecord,
  localizeProfile,
  localizeProject,
  localizeTimelineItem,
} from '../utils/localization'

export function useProfileQuery() {
  const locale = useLocale()

  return useQuery({
    queryKey: ['profile', locale],
    queryFn: fetchProfile,
    select: (data) => localizeProfile(data, locale),
  })
}

export function useProjectsQuery() {
  const locale = useLocale()

  return useQuery({
    queryKey: ['projects', locale],
    queryFn: fetchProjects,
    select: (data) => data.map((item) => localizeProject(item, locale)),
  })
}

export function useHighlightsQuery() {
  const locale = useLocale()

  return useQuery({
    queryKey: ['highlights', locale],
    queryFn: fetchHighlights,
    select: (data) => data.map((item) => localizeHighlight(item, locale)),
  })
}

export function useTimelineQuery() {
  const locale = useLocale()

  return useQuery({
    queryKey: ['timeline', locale],
    queryFn: fetchTimeline,
    select: (data) => data.map((item) => localizeTimelineItem(item, locale)),
  })
}

export function useLifeRecordsQuery() {
  const locale = useLocale()

  return useQuery({
    queryKey: ['life-records', locale],
    queryFn: fetchLifeRecords,
    select: (data) => data.map((item) => localizeLifeRecord(item, locale)),
  })
}
