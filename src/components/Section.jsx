export function Section({ title, children, empty }) {
  const hasContent = Array.isArray(children) ? children.some(Boolean) : Boolean(children);
  return (
    <section className="section-block">
      <h2>{title}</h2>
      {hasContent ? children : <div className="empty-state">{empty || 'Nada por aqui agora.'}</div>}
    </section>
  );
}
