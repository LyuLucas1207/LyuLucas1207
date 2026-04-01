import axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter'

const rawClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 8000,
})

export const httpClient = applyCaseMiddleware(rawClient, {
  ignoreHeaders: true,
})
