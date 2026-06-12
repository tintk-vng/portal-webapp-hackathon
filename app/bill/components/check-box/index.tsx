import classNames from 'classnames'

export default function CheckBoxIcon({ isSelected }: { isSelected: boolean }) {
  return (
    <span
      className={classNames({
        "pointer-events-none relative isolate z-0 block h-[24px] w-[24px] after:absolute after:z-10 after:rounded-full after:ring-2 after:content-[''] ":
          true,
        'after:inset-[7px] after:bg-blue-500 after:ring-blue-500 after:ring-offset-[3px] after:transition after:duration-300 ':
          isSelected,
        'after:inset-1 after:ring-dark-200 after:transition-none ': !isSelected,
      })}
    />
  )
}
