import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchDashboardData } from './services/api.js'
import Dashboard from './components/Dashboard.jsx'
import SkeletonLoader from './components/SkeletonLoader.jsx'
import ErrorState from './components/ErrorState.jsx'
import './App.css'
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])
  return isOnline
}
function App() {
  const [status, setStatus] = useState('loading')
  const [rawData, setRawData] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const requestRef = useRef(null)
  const isOnline = useOnlineStatus()
  const loadData = useCallback(async () => {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    setStatus('loading')
    setErrorMessage('')
    try {
      const text = await fetchDashboardData(controller.signal)
      if (requestRef.current !== controller) return
      setRawData(text)
      setStatus('success')
    } catch (error) {
      if (requestRef.current !== controller) return
      setErrorMessage(error.message)
      setStatus(error.kind === 'timeout' ? 'timeout' : 'error')
    }
  }, [])
  useEffect(() => {
    loadData()
    return () => {
      requestRef.current?.abort()
      requestRef.current = null
    }
  }, [loadData])
  return (
    <div className="page">
      <header className="topbar">
        <div className="container topbar__inner">
          <div>
            <p className="topbar__eyebrow">Prodesk IT</p>
            <h1 className="topbar__title">API Operations</h1>
          </div>
          <span
            className={`status-pill ${isOnline ? 'status-pill--online' : 'status-pill--offline'}`}
            role="status"
          >
            <span className="status-pill__dot" aria-hidden="true" />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </header>
      <main className="container main" aria-busy={status === 'loading'}>
        {status === 'loading' && <SkeletonLoader />}
        {status === 'success' && <Dashboard rawData={rawData} onRefresh={loadData} />}
        {(status === 'error' || status === 'timeout') && (
          <ErrorState
            title={status === 'timeout' ? 'Request timed out' : 'Service Unavailable'}
            message={errorMessage}
            onRetry={loadData}
          />
        )}
      </main>
      <footer className="container footer">
        Data from JSONPlaceholder. Requests are cancelled after 5 seconds.
      </footer>
    </div>
  )
}
export default App
