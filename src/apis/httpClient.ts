import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'

function apiBaseURL(): string {
  const v = import.meta.env.VITE_API_URL
  if (v !== undefined && v !== '') {
    return v
  }
  return '/api'
}

const rawClient = axios.create({
  baseURL: apiBaseURL(),
  timeout: 8000,
})

export const httpClient = applyCaseMiddleware(rawClient, {
  ignoreHeaders: true,
})
