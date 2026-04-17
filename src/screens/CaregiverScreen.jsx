import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function CaregiverScreen() {
  const nav = useNavigate()
  const { family, questions, settings } = useData()

  const cards = [
    {
      icon: '👨‍👩‍👧',
      title: 'בני משפחה',
      desc: `${family.length} אנשים מוגדרים`,
      color: 'border-blue-200 bg-blue-50',
      path: '/caregiver/family',
    },
    {
      icon: '☀️',
      title: 'שאלות יומיות',
      desc: `${questions.length} שאלות פעילות`,
      color: 'border-amber-200 bg-amber-50',
      path: '/caregiver/questions',
    },
    {
      icon: '⚙️',
      title: 'הגדרות',
      desc: `שם: ${settings.userName}`,
      color: 'border-green-200 bg-green-50',
      path: '/caregiver/settings',
    },
  ]

  return (
    <div className="screen-enter flex flex-col min-h-[85vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[24px] font-bold text-primary">🔑 אזור ניהול</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-full border-2 border-primary bg-primary-light text-primary text-[14px] font-semibold active:scale-95"
            onClick={() => nav('/help')}
          >
            ? עזרה
          </button>
          <button
            className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-500 text-[14px] active:scale-95"
            onClick={() => nav('/')}
          >
            → בית
          </button>
        </div>
      </div>

      <p className="text-[17px] text-gray-500 mb-6">
        כאן תוכלו לערוך את כל הנתונים האישיים — בלי לגעת בקוד.
      </p>

      <div className="flex flex-col gap-4">
        {cards.map(c => (
          <button
            key={c.path}
            onClick={() => nav(c.path)}
            className={`w-full rounded-2xl border-2 p-5 text-right transition-all active:scale-95 ${c.color}`}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[28px]">{c.icon}</span>
              <span className="text-[20px] font-bold text-gray-800">{c.title}</span>
              <span className="mr-auto text-[22px] text-gray-400">←</span>
            </div>
            <p className="text-[15px] text-gray-500 pr-11">{c.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
