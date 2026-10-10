function ErrorState({ title, message, onRetry }) {
  return (
    <section className="panel error-state" role="alert" aria-labelledby="error-title">
      <h2 id="error-title" className="error-state__title">{title}</h2>
      <p className="error-state__text">{message}</p>
      <p className="error-state__text">Please check your connection and try again.</p>
      <button type="button" className="button" onClick={onRetry}>
        Retry
      </button>
    </section>
  )
}
export default ErrorState
