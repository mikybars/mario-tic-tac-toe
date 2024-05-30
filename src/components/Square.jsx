import clsx from 'clsx'

export function Square({ children, take, index, isGreyed, isWinner }) {
  const play = () => {
    const isNotTaken = children === null
    if (isNotTaken) take(index)
  }

  return (
    <div
      className={clsx(
        'square',
        isGreyed && 'is-greyed',
        isWinner && 'is-winner'
      )}
      onClick={play}
    >
      {children}
    </div>
  )
}
