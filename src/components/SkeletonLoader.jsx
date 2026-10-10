function SkeletonLoader() {
  return (
    <div className="skeleton" role="status" aria-label="Loading dashboard data">
      <div className="stats">
        {[1, 2, 3, 4].map((item) => (
          <div className="stat-card" key={item}>
            <span className="skeleton__line skeleton__line--short" aria-hidden="true" />
            <span className="skeleton__line skeleton__line--number" aria-hidden="true" />
          </div>
        ))}
      </div>
      <div className="panel" aria-hidden="true">
        <span className="skeleton__line skeleton__line--heading" />
        {[1, 2, 3, 4, 5, 6].map((row) => (
          <span className="skeleton__line skeleton__line--row" key={row} />
        ))}
      </div>
    </div>
  )
}
export default SkeletonLoader
