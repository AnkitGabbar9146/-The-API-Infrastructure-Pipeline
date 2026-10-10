const API_URL = 'https://jsonplaceholder.typicode.com/todos'
const TIMEOUT_MS = 5000
export class ApiError extends Error {
  constructor(message, kind) {
    super(message)
    this.name = 'ApiError'
    this.kind = kind
  }
}
export async function fetchDashboardData(outerSignal) {
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, TIMEOUT_MS)
  const cancel = () => controller.abort()
  if (outerSignal?.aborted) {
    cancel()
  } else {
    outerSignal?.addEventListener('abort', cancel)
  }
  try {
    const response = await fetch(API_URL, { signal: controller.signal })
    if (!response.ok) {
      throw new ApiError(`The data service returned HTTP ${response.status}.`, 'http')
    }
    return await response.text()
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error.name === 'AbortError') {
      if (timedOut) {
        throw new ApiError('The data service took longer than 5 seconds to respond.', 'timeout')
      }
      throw new ApiError('Request cancelled.', 'cancelled')
    }
    throw new ApiError("We couldn't connect to the data service.", 'network')
  } finally {
    clearTimeout(timer)
    outerSignal?.removeEventListener('abort', cancel)
  }
}
