import { useEffect } from 'react'

export default function useOutsideClick(ref: any, cb: any) {
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        cb()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [cb, ref])
}
