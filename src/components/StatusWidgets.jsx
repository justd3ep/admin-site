export function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
    </div>
  );
}

export function ErrorMsg({ message }) {
  return (
    <div className="error-banner">
      ⚠️ {message || 'Something went wrong. Please try again.'}
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <p>{message || 'No data available.'}</p>
    </div>
  );
}
