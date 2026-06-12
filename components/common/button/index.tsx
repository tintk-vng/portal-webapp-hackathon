import classNames from 'classnames'
import { ReactElement } from 'react'
import './styles.scss'

export enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

export enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  NEGATIVE = 'negative',
  TEXT_LINK = 'text-link',
}

interface ButtonProps {
  children: ReactElement | string
  id?: string
  size?: ButtonSize
  type?: ButtonType
  bold?: boolean
  width?: string
  height?: string
  isDisabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export default function Button({
  children,
  id,
  size = ButtonSize.MEDIUM,
  type = ButtonType.PRIMARY,
  bold = true,
  width,
  height,
  isDisabled,
  onClick,
}: ButtonProps) {
  const isPrimaryType = type === ButtonType.PRIMARY
  const isSecondaryType = type === ButtonType.SECONDARY
  const isNegativeType = type === ButtonType.NEGATIVE
  const isTextLinkType = type === ButtonType.TEXT_LINK

  const handleTextLinkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      return
    }
    onClick?.(e)
  }

  if (isTextLinkType) {
    return (
      <button
        id={id}
        className={classNames({
          'flex items-center justify-center': true,
          [`${width}`]: !!width,
        })}
        onClick={handleTextLinkClick}
      >
        <label
          className={classNames({
            [`text-label-${size} cursor-pointer text-left text-blue-500`]: true,
            'font-bold': bold,
            'cursor-default text-dark-200': isDisabled,
          })}
        >
          {children}
        </label>
      </button>
    )
  }

  // const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   const button = e.currentTarget
  //   const circle = document.createElement('span')
  //   const diameter = Math.max(button.clientWidth, button.clientHeight)
  //   const radius = diameter / 2

  //   circle.style.width = circle.style.height = `${diameter}px`
  //   circle.style.left = `${e.clientX - button.offsetLeft - radius}px`
  //   circle.style.top = `${e.clientY * 1.1 - button.offsetTop - radius}px`
  //   circle.classList.add('ripple')
  //   if (isSecondaryType) {
  //     circle.classList.add('ripple--secondary')
  //   }
  //   const ripple = button.getElementsByClassName('ripple')[0]

  //   if (ripple) {
  //     ripple.remove()
  //   }

  //   button.appendChild(circle)
  // }

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      return
    }
    // createRipple(e)
    onClick?.(e)
  }

  return (
    <button
      id={id}
      className={classNames({
        'relative flex items-center justify-center overflow-hidden rounded-lg border focus:outline-none':
          true,
        'bg-blue-500': isPrimaryType,
        'bg-white-500': isSecondaryType || isNegativeType,
        'h-[30px] rounded-md px-3': size === ButtonSize.SMALL,
        'h-10 px-4': size === ButtonSize.MEDIUM,
        'h-12 px-5': size === ButtonSize.LARGE,
        [`${width}`]: !!width,
        [`${height}`]: !!height,
        // 'md:transition-transform md:duration-300 md:focus:scale-95': !isDisabled,
        'border-blue-500': (isPrimaryType || isSecondaryType) && !isDisabled,
        'border-red-500': isNegativeType && !isDisabled,
        'border-dark-25 bg-dark-25': isPrimaryType && isDisabled,
        'border-dark-100 bg-white-500': (isSecondaryType || isNegativeType) && isDisabled,
      })}
      disabled={isDisabled}
      onClick={handleButtonClick}
    >
      <label
        className={classNames({
          [`text-label-${size}`]: true,
          'cursor-pointer': !isDisabled,
          'font-bold': bold,
          'text-white-500': isPrimaryType && !isDisabled,
          'text-blue-500': isSecondaryType && !isDisabled,
          'text-red-500': isNegativeType && !isDisabled,
          'cursor-default text-dark-200': isDisabled,
        })}
      >
        {children}
      </label>
    </button>
  )
}
