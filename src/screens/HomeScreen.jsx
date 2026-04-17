import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, BigButton, speak } from '../components/UI'
import { useData } from '../context/DataContext'

export default function HomeScreen() {
  const nav = useNavigate()
  const { settings } = useData()

  useEffect(() => {
    if (settings.autoSpeak) speak(`שלום ${settings.userName}! מה נרצה לעשות היום?`)
  }, [])

  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <TopBar title="זוכרים יחד" />

      <h1 className="screen-title mt-4">שלום {settings.userName} 👋</h1>
      <p className="screen-sub">מה נרצה לעשות היום?</p>

      <div className="flex flex-col items-center gap-4 w-full">
        <BigButton filled onClick={() => nav('/activities')}>
          <span className="text-[32px]">🎮</span>
          <span>פעילויות ומשחקים</span>
        </BigButton>
        <BigButton onClick={() => nav('/photos')}>
          <span className="text-[32px]">📷</span>
          <span>תמונות משפחה</span>
        </BigButton>
        <BigButton onClick={() => nav('/daily')}>
          <span className="text-[32px]">☀️</span>
          <span>תרגול יומי</span>
        </BigButton>
      </div>

      <div className="mt-auto pt-8 w-full border-t border-gray-200 flex justify-between items-center">
        <button
          className="text-gray-400 text-[15px] underline underline-offset-2"
          onClick={() => nav('/caregiver-login')}
        >
          🔑 ניהול למשפחה
        </button>
        <button
          className="text-gray-400 text-[15px] underline underline-offset-2"
          onClick={() => { if(window.confirm('לצאת מהאפליקציה?')) window.close() }}
        >
          יציאה ✕
        </button>
      </div>
    </div>
  )
}
