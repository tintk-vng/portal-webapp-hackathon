import classNames from 'classnames'
import { forwardRef, ReactElement, useState } from 'react'
import StaticImage from '../static-image'

const formatValue = (value: string, fomatter?: (value: string) => string): string => {
  try {
    if (!fomatter) {
      return value
    }
    const formattedValue = fomatter(value)
    return formattedValue
  } catch (error) {
    console.log('Failed to format value: ', error)
    return value
  }
}

export enum InputStatus {
  DEFAULT = 'DEFAULT',
  ERROR = 'ERROR',
}

interface InputProps {
  className?: string
  type?: string
  name?: string
  label?: string
  value?: string
  placeholder?: string
  status?: InputStatus
  message?: string | ReactElement
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  maxLength?: number
  addOn?: ReactElement
  height?: string
  styleColor?: string
  onChange?: (value: string) => void
  onClear?: () => void
  onFocus?: () => void
  onBlur?: () => void
  formatter?: (value: string) => string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      type = 'text',
      name,
      label,
      value = '',
      placeholder = '',
      status = InputStatus.DEFAULT,
      message,
      required,
      disabled,
      autoFocus,
      maxLength,
      addOn,
      height,
      styleColor = 'blue-500',
      onChange,
      onClear,
      onFocus,
      onBlur,
      formatter,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(autoFocus)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatValue(e.target.value, formatter)
      onChange?.(formattedValue)
    }

    const handleClear = () => {
      onChange?.('')
      onClear?.()
    }

    const handleFocus = () => {
      setIsFocused(true)
      onFocus?.()
    }

    const handleBlur = () => {
      setIsFocused(false)
      onBlur?.()
    }
    return (
      <div className={className}>
        {label && (
          <label htmlFor="input" className="mb-3 block text-base font-bold text-dark-500 md:mb-4">
            {label}
          </label>
        )}
        <div
          className={classNames({
            'relative flex flex rounded-lg border': true,
            'border-dark-100': !isFocused,
            [`border-${styleColor}`]: isFocused,
            'border-red-500': status === InputStatus.ERROR && message,
            'bg-dark-25': disabled,
          })}
        >
          <div
            className={classNames({
              'flex w-full items-center justify-between': true,
              'grow border-r border-dark-100': addOn,
            })}
          >
            <input
              ref={ref}
              className={classNames({
                'w-full rounded-lg bg-transparent p-4 text-base leading-none outline-0 focus:outline-none':
                  true,
                [height || 'h-[52px]']: true,
                'text-dark-500': !disabled,
                'text-dark-300': disabled,
              })}
              type={type}
              name={name}
              placeholder={placeholder}
              value={value}
              required={required}
              autoFocus={autoFocus}
              maxLength={maxLength}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
            />

            {value && !disabled && (
              // <span
              //   className={classNames({
              //     'mr-4': true,
              //     [styles.clearIcon]: true,
              //   })}
              //   onClick={handleClear}
              // />

              <StaticImage
                className="mr-4 cursor-pointer"
                src="https://scdn.zalopay.com.vn/zst/zpi/images/design-system/icons/Second/general_closecircle_line.svg"
                width={24}
                height={24}
                alt="clear-icon"
                onClick={handleClear}
              />
            )}
          </div>

          {addOn && (
            <div
              className={classNames({
                'flex items-center': true,
                [height || 'h-[52px]']: true,
              })}
            >
              {addOn}
            </div>
          )}
        </div>

        {message && (
          <label
            className={classNames({
              'mt-1 text-label-md text-dark-300': true,
              'text-red-500': status === InputStatus.ERROR,
            })}
          >
            {message}
          </label>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
