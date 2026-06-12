import dynamic from 'next/dynamic'
import { CSSProperties } from 'react'

const LabelBadge = dynamic(() => import('./label-badge'))
const RibbonBadge1 = dynamic(() => import('./ribbon-badge-1'))
const RibbonBadge2 = dynamic(() => import('./ribbon-badge-2'))

export enum BadgeType {
  Label = 'label',
  Ribbon1 = 'ribbon-1',
  Ribbon2 = 'ribbon-2',
}

export enum BadgeVariant {
  Positive = 'positive',
  Informative = 'informative',
  Negative = 'negative',
  Neutral = 'neutral',
}

interface BadgeProps {
  children: string
  type?: BadgeType
  variant?: BadgeVariant
  position?: 'static' | 'absolute'
}

export default function Badge({
  children,
  type = BadgeType.Label,
  variant = BadgeVariant.Positive,
  position = 'absolute',
}: BadgeProps) {
  switch (type) {
    case BadgeType.Label:
      return <LabelBadge variant={variant}>{children}</LabelBadge>
    case BadgeType.Ribbon1:
      return (
        <RibbonBadge1 variant={variant} position={position}>
          {children}
        </RibbonBadge1>
      )
    case BadgeType.Ribbon2:
      return (
        <RibbonBadge2 variant={variant} position={position}>
          {children}
        </RibbonBadge2>
      )
    default:
      return null
  }
}
