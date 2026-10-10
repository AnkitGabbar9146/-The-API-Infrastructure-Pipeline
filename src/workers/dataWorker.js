let tasks = []
let loadError = ''
function getStats(list) {
  const completed = list.filter((task) => task.completed).length
  return {
    total: list.length,
    open: list.length - completed,
    completed,
    users: new Set(list.map((task) => task.userId)).size,
    completionRate: list.length ? Math.round((completed / list.length) * 100) : 0,
  }
}
function filterTasks(list, { search, status }) {
  const query = search.trim().toLowerCase()

  return list.filter((task) => {
    if (status === 'open' && task.completed) return false
    if (status === 'completed' && !task.completed) return false
    return !query || task.title.toLowerCase().includes(query)
  })
}
function sortTasks(list, sortBy) {
  const sorted = [...list]
  if (sortBy === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sortBy === 'user') {
    sorted.sort((a, b) => a.userId - b.userId || a.id - b.id)
  } else {
    sorted.sort((a, b) => a.id - b.id)
  }
  return sorted
}
self.onmessage = ({ data }) => {
  if (data.type === 'load') {
    try {
      const parsed = JSON.parse(data.payload)
      if (!Array.isArray(parsed)) throw new Error('Expected a list')
      tasks = parsed
      loadError = ''
      self.postMessage({ type: 'loaded', stats: getStats(parsed) })
    } catch {
      tasks = []
      loadError = 'The data service returned an invalid response.'
    }
    return
  }
  if (data.type === 'query') {
    if (loadError) {
      self.postMessage({ type: 'error', requestId: data.requestId, message: loadError })
      return
    }
    try {
      const { limit, ...filters } = data.payload
      const matches = sortTasks(filterTasks(tasks, filters), filters.sortBy)
      self.postMessage({
        type: 'result',
        requestId: data.requestId,
        rows: matches.slice(0, limit),
        total: matches.length,
      })
    } catch {
      self.postMessage({
        type: 'error',
        requestId: data.requestId,
        message: 'Unable to process data.',
      })
    }
  }
}
