import React from 'react'
import { useNavigate } from 'react-router-dom'
import { speak } from '../components/UI'

export default function HelpScreen() {
  const nav = useNavigate()

  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-[22px] font-bold text-primary">? עזרה</h1>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          onClick={() => { speak('חוזרות לדף הבית'); nav('/') }}
          className="btn-main filled"
        >
          <span className="text-[28px]">🏠</span>
          <span>חזרה לדף הבית</span>
        </button>

        <button
          onClick={() => { speak('ננסה שוב'); nav(-1) }}
          className="btn-main"
        >
          <span className="text-[28px]">🔄</span>
          <span>ננסה שוב</span>
        </button>

        <button
          onClick={() => speak('קראי לבן משפחה שיעזור לך')}
          className="btn-main"
        >
          <span className="text-[28px]">📞</span>
          <span>קראי לבן משפחה</span>
        </button>
      </div>

      <div className="mt-8 w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6">
        <p className="text-[18px] font-bold text-gray-700 mb-3">איך משתמשים?</p>
        <ul className="flex flex-col gap-3 text-[17px] text-gray-600">
          <li>✅ לוחצים על הכפתורים הגדולים</li>
          <li>✅ כפתור "חזרה" מחזיר למסך הקודם</li>
          <li>✅ כפתור 🔊 מקריא את הטקסט בקול</li>
          <li>✅ אין ציונים — רק כיף ותרגול</li>
        </ul>
      </div>
    </div>
  )
}
