import { ComponentType } from 'react'

export interface HeaderProps {
  currentPath?: string
  onNavigate?: (path: string) => void
}

export const Header: ComponentType<HeaderProps>
export const Footer: ComponentType
