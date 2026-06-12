import classNames from 'classnames'

interface TabProps {
  title: string
  onClick: () => void
  className?: string
  isActive?: boolean
}
export default function Tab({ title, className = '', onClick, isActive }: TabProps) {
  const handleClick = () => {
    !isActive && onClick()
  }

  return (
    <button
      className={classNames({
        'flex items-center pt-2 ': true,
        'border-b border-dark-50 pb-[7px] text-label-md text-dark-300 ': !isActive,
        'border-b-2 border-blue-500 pb-[6px] text-label-lg text-blue-500 ': isActive,
        [className]: !!className,
      })}
      onClick={handleClick}
    >
      <span>{title}</span>
    </button>
  )
}
