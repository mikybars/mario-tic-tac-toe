import clsx from "clsx";

export function Square({ children, play, index, isSelected }) {
  return (
    <div
      className={clsx("square", isSelected && "is-selected")}
      onClick={() => play(index)}
    >
      {children}
    </div>
  );
}
