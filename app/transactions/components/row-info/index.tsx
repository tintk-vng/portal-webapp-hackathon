import classNames from 'classnames'

interface IRowInfo {
  title?: string
  value?: string
  className?: string
  children?: React.ReactNode
}

const RowInfo = ({ title = '', value = '', className = '', children }: IRowInfo) => {
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
            <label className="w-full text-dark-300">{title}</label>

            <label className="w-full text-right">{value}</label>
          </>
        )}
      </div>
    </>
  )
}
export default RowInfo
