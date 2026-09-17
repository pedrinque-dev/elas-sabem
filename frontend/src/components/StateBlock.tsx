export function Loading({ label = "Carregando" }: { label?: string }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <p className="loading-dots">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="state-block">
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="state-block" role="alert">
      <p style={{ color: "var(--danger)" }}>{message}</p>
    </div>
  );
}
