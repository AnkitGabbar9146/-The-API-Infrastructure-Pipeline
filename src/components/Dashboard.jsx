import { useEffect, useRef, useState } from 'react'
const PAGE_SIZE = 20
function Dashboard({ rawData, onRefresh }) {
  const [filters, setFilters] = useState({ search: '', status: 'all', sortBy: 'id' })
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [stats, setStats] = useState(null)
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(0)
  const [busy, setBusy] = useState(true)
  const [workerError, setWorkerError] = useState('')
  const workerRef = useRef(null)
  const lastRequest = useRef(0)
  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/dataWorker.js', import.meta.url),
      { type: 'module' }
    )
    worker.onmessage = ({ data }) => {
      if (data.type === 'loaded') {
        setStats(data.stats)
        return
      }
      if (data.requestId !== lastRequest.current) return
      if (data.type === 'result') {
        setRows(data.rows)
        setTotal(data.total)
        setWorkerError('')
      } else {
        setWorkerError(data.message)
      }
      setBusy(false)
    }
    worker.onerror = () => {
      setWorkerError('The data processor encountered an error.')
      setBusy(false)
    }
    worker.postMessage({ type: 'load', payload: rawData })
    workerRef.current = worker
    return () => worker.terminate()
  }, [rawData])
  useEffect(() => {
    lastRequest.current += 1
    setBusy(true)
    workerRef.current.postMessage({
      type: 'query',
      requestId: lastRequest.current,
      payload: { ...filters, limit },
    })
  }, [rawData, filters, limit])
  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
    setLimit(PAGE_SIZE)
  }
  return (
    <>
      <section className="stats" aria-label="Summary">
        <div className="stat-card">
          <p className="stat-card__label">Total records</p>
          <p className="stat-card__value">{stats ? stats.total.toLocaleString() : '-'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Open</p>
          <p className="stat-card__value">{stats ? stats.open.toLocaleString() : '-'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Completed</p>
          <p className="stat-card__value">{stats ? `${stats.completionRate}%` : '-'}</p>
        </div>
        <div className="stat-card">
          <p className="stat-card__label">Users</p>
          <p className="stat-card__value">{stats ? stats.users : '-'}</p>
        </div>
      </section>
      <section className="panel" aria-labelledby="overview-title">
        <div className="panel__header">
          <div>
            <h2 className="panel__title" id="overview-title">Data overview</h2>
            <p className="panel__meta" aria-live="polite">
              {busy ? 'Processing...' : `${total.toLocaleString()} matching tasks`}
            </p>
          </div>
          <button type="button" className="button button--secondary" onClick={onRefresh}>
            Refresh
          </button>
        </div>
        <div className="filters">
          <div className="field field--grow">
            <label htmlFor="search">Search</label>
            <input
              id="search"
              type="search"
              placeholder="Search by title"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={filters.status}
              onChange={(event) => updateFilter('status', event.target.value)}
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort">Sort by</label>
            <select
              id="sort"
              value={filters.sortBy}
              onChange={(event) => updateFilter('sortBy', event.target.value)}
            >
              <option value="id">ID</option>
              <option value="title">Title</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
        {workerError && (
          <p className="notice" role="alert">{workerError}</p>
        )}
        {!busy && total === 0 ? (
          <p className="empty">No tasks match these filters.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Title</th>
                  <th scope="col">User</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((task) => (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td className="table__title">{task.title}</td>
                    <td>User {task.userId}</td>
                    <td>
                      <span className={`badge ${task.completed ? 'badge--done' : 'badge--open'}`}>
                        {task.completed ? 'Completed' : 'Open'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {limit < total && (
          <button
            type="button"
            className="button button--secondary button--full"
            onClick={() => setLimit((count) => count + PAGE_SIZE)}
          >
            Show {Math.min(PAGE_SIZE, total - limit)} more
          </button>
        )}
      </section>
    </>
  )
}
export default Dashboard
