import clsx from 'clsx'

export function Square({ children, take, index, isSelected, isWinner }) {
  const play = () => {
    const isNotTaken = children === null
    if (isNotTaken) take(index)
  }

  return (
    <div
      className={clsx(
        'square',
        isSelected && 'is-selected',
        isWinner && 'is-winner'
      )}
      onClick={play}
    >
      {children}
    </div>
  )
}
