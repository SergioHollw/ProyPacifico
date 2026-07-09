export default function EmptyState({ icon, title, message, children }) {
  return (
    <div className="empty-state">
      {icon && (
        typeof icon === "string" ? (
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d={icon} />
          </svg>
        ) : (
          icon
        )
      )}
      {title && <h3>{title}</h3>}
      {message && <p>{message}</p>}
      {children}
    </div>
  );
}
