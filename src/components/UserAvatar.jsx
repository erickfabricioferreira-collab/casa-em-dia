export function UserAvatar({ person, size = 28 }) {
  return (
    <span className="user-avatar" style={{ background: person?.color || '#70d6b7', width: size, height: size }}>
      {person?.avatar || person?.name?.[0]?.toUpperCase() || 'U'}
    </span>
  );
}
