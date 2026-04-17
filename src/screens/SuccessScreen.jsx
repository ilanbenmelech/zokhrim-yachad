import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { speak } from '../components/UI'

export default function SuccessScreen() {
  const nav = useNavigate()

  useEffect(() => {
    speak('כל הכבוד! עשית עבודה נהדרת היום')
  }, [])

  return (
    <div className="screen-enter flex flex-col items-center justify-center min-h-[85vh] text-center">
      <div className="text-[90px] mb-4">🌟</div>

      <h1 className="text-[34px] font-extrabold text-success mb-2">כל הכבוד!</h1>
      <p className="text-[20px] text-gray-500 mb-8">עשית עבודה נהדרת היום</p>

      <div className="flex flex-col items-center gap-4 w-full max-w-sm">
        <button
          onClick={() => nav('/activities')}
          className="btn-main filled"
        >
          <span className="text-[28px]">🎮</span>
          <span>עוד פעילות</span>
        </button>

        <button
          onClick={() => nav('/')}
          className="btn-main"
        >
          <span className="text-[28px]">🏠</span>
          <span>סיימנו להיום</span>
        </button>
      </div>
    </div>
  )
}
