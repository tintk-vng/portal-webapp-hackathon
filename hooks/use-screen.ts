'use-client'

import tailwindConfig from '@/tailwind.config.js'
import { useLayoutEffect, useState } from 'react'
import resolveConfig from 'tailwindcss/resolveConfig'

const fullConfig = resolveConfig(tailwindConfig as any)

export enum ScreenSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
}

interface Screen {
  size: ScreenSize
  width: number
  height: number
}

const getScreenSize = (width: number): ScreenSize => {
  if (width >= fullConfig.theme.screens.lg.replace(/px/g, '')) {
    return ScreenSize.LARGE
  }
  if (width >= fullConfig.theme.screens.md.replace(/px/g, '')) {
    return ScreenSize.MEDIUM
  }
  return ScreenSize.SMALL
}

export default function useScreen(): Screen {
  const [screen, setScreen] = useState<Screen>(
    typeof window !== 'undefined'
      ? {
          size: getScreenSize(window.innerWidth),
          width: window.innerWidth,
          height: window.innerHeight,
        }
      : {
          size: ScreenSize.SMALL,
          width: 0,
          height: 0,
        }
  )

  const updateScreen = () => {
    setScreen({
      size: getScreenSize(window.innerWidth),
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useLayoutEffect(() => {
    window.addEventListener('resize', updateScreen)
    updateScreen()

    return () => {
      window.removeEventListener('resize', updateScreen)
    }
  }, [])

  return screen
}
