import classNames from 'classnames'

interface IRowInfo {
  title?: string
  value?: string
  titleClassName?: string
  className?: string
  children?: any
  underline?: boolean
  boldValue?: boolean
}
const RowInfo = ({
  title = '',
  value = '',
  titleClassName = '',
  className = '',
  children,
  underline = false,
  boldValue = false,
}: IRowInfo) => {
  return (
    <>
      <div
        className={classNames({
          'flex gap-x-2.5': true,
          'py-3 md:py-[18px]': !className,
          [className]: !!className,
        })}
      >
        {children ? (
          children
        ) : (
          <>
            <label
              className={classNames({
                'w-full text-dark-300': true,
                [titleClassName]: !!titleClassName,
              })}
            >
              {title}
            </label>
            <label className={classNames({ 'w-full text-right': true, 'font-bold': boldValue })}>
              {value}
            </label>
          </>
        )}
      </div>
      {underline && <div className="h-px w-full bg-[#E6E9EC]" />}
    </>
  )
}
export default RowInfo
