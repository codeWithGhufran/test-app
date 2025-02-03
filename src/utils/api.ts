import axios, { type AxiosRequestConfig } from "axios"

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export const apiClient = axios.create({
  baseURL: "https://frontend-take-home-service.fetch.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
})

export async function makeRequest<T>(config: AxiosRequestConfig, retries = 0): Promise<T> {
  try {
    const response = await apiClient(config)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.code !== "ECONNABORTED" && retries < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      return makeRequest<T>(config, retries + 1)
    }
    throw error
  }
}

