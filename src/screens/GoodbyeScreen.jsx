import React, { useEffect } from 'react'
import { useData } from '../context/DataContext'
import { speak } from '../components/UI'

export default function GoodbyeScreen() {
  const { settings } = useData()

  useEffect(() => {
    speak(`להתראות ${settings.userName}! יום נעים ומהנה`)
  }, [])

  // מסך פשוט — לא כפתור חזרה, לא ניווט
  // האישה תיראה את המסך ותניח את הטאבלט
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center">
      <div className="text-[100px] mb-6">👋</div>
      <h1 className="text-[38px] font-extrabold text-primary mb-3">
        להתראות {settings.userName}!
      </h1>
      <p className="text-[22px] text-gray-500">יום נעים ומהנה 💙</p>
    </div>
  )
}
