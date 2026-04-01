import { httpClient } from './httpClient'
import type {
  HighlightApiItem,
  LifeRecordApiItem,
  ProfileApi,
  ProjectApiItem,
  TimelineApiItem,
} from '../types/site'

export async function fetchProfile() {
  const { data } = await httpClient.get<ProfileApi>('/profile')
  return data
}

export async function fetchProjects() {
  const { data } = await httpClient.get<ProjectApiItem[]>('/projects')
  return data
}

export async function fetchHighlights() {
  const { data } = await httpClient.get<HighlightApiItem[]>('/highlights')
  return data
}

export async function fetchTimeline() {
  const { data } = await httpClient.get<TimelineApiItem[]>('/timeline')
  return data
}

export async function fetchLifeRecords() {
  const { data } = await httpClient.get<LifeRecordApiItem[]>('/life-records')
  return data
}
