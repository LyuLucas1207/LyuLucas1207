import type {
  HighlightApiItem,
  LifeRecordApiItem,
  LifeTimelineApiItem,
  ProfileApi,
  ProjectApiItem,
  TimelineApiItem,
} from '@/types'

import { RESUME_PROJECTS } from '@/constants/resumeProjects'

import { httpClient } from './httpClient'

export async function GetProfile() {
  const { data } = await httpClient.get<ProfileApi>('/profile')
  return data
}

/** Curated list aligned with `Resume_Master/main.tex` (§ Projects). */
export async function GetProjects(): Promise<ProjectApiItem[]> {
  return RESUME_PROJECTS
}

export async function GetHighlights() {
  const { data } = await httpClient.get<HighlightApiItem[]>('/highlights')
  return data
}

export async function GetTimeline() {
  const { data } = await httpClient.get<TimelineApiItem[]>('/timeline')
  return data
}

export async function GetLifeRecords() {
  const { data } = await httpClient.get<LifeRecordApiItem[]>('/lifeRecords')
  return data
}

export async function GetLifeTimeline() {
  const { data } = await httpClient.get<LifeTimelineApiItem[]>('/lifeTimeline')
  return data
}
