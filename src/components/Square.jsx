import clsx from 'clsx'

export function Square({ children, play, index, isSelected, isWinner }) {
  return (
    <div
      className={clsx(
        'square',
        isSelected && 'is-selected',
        isWinner && 'is-winner'
      )}
      onClick={() => play(index)}
    >
      {children}
    </div>
  )
}
