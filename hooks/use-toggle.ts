import { useState } from 'react'

export default function useToggle(): [boolean, () => void] {
  const [visible, setVisible] = useState(false)

  const toggle = () => {
    setVisible(!visible)
  }

  return [visible, toggle]
}
