export function Square({ children, play, index, isSelected }) {
  const className = `square ${isSelected ? "is-selected" : ""}`;
  return (
    <div className={className} onClick={() => play(index)}>
      {children}
    </div>
  );
}
