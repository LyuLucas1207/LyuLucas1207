import type {
  HighlightApiItem,
  LifeRecordApiItem,
  ProfileApi,
  ProjectApiItem,
  TimelineApiItem,
} from '@/types'

import { httpClient } from './httpClient'

export async function GetProfile() {
  const { data } = await httpClient.get<ProfileApi>('/profile')
  return data
}

export async function GetProjects() {
  const { data } = await httpClient.get<ProjectApiItem[]>('/projects')
  return data
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
  const { data } = await httpClient.get<LifeRecordApiItem[]>('/life-records')
  return data
}
