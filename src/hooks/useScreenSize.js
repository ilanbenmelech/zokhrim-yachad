import { useState, useEffect } from 'react'

export function useScreenSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isSmall:  window.innerHeight < 700,
    isMedium: window.innerHeight < 850,
    isLarge:  window.innerHeight >= 850,
  })

  useEffect(() => {
    function update() {
      const h = window.innerHeight
      const w = window.innerWidth
      setSize({ width: w, height: h,
        isSmall: h < 700, isMedium: h < 850, isLarge: h >= 850 })
    }
    window.addEventListener('resize', update)
    // עדכון גם כשנפתחת/נסגרת מקלדת
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return size
}
