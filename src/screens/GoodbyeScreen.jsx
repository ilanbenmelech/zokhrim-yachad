import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { speak } from '../components/UI'

export default function GoodbyeScreen() {
  const nav = useNavigate()
  const { settings } = useData()

  useEffect(() => {
    speak(`להתראות ${settings.userName}! יום נעים`)
  }, [])

  return (
    <div className="screen-enter flex flex-col items-center justify-center min-h-[85vh] text-center">
      <div className="text-[90px] mb-4">👋</div>
      <h1 className="text-[34px] font-extrabold text-primary mb-2">
        להתראות {settings.userName}!
      </h1>
      <p className="text-[20px] text-gray-500 mb-10">יום נעים ומהנה</p>

      <button
        onClick={() => nav('/')}
        className="btn-main"
        style={{ maxWidth: '320px' }}
      >
        <span className="text-[28px]">🏠</span>
        <span>חזרה לאפליקציה</span>
      </button>
    </div>
  )
}
