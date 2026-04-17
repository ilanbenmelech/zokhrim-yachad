import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PASSWORD = '9463'
const HINT = 'יום הולדת אילן'

export default function CaregiverLoginScreen() {
  const nav = useNavigate()
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [showHint, setShowHint] = useState(false)

  function handleSubmit() {
    if (input === PASSWORD) {
      nav('/caregiver')
    } else {
      setError('סיסמה שגויה, נסו שוב')
      setInput('')
      setTimeout(() => setError(''), 2500)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="screen-enter flex flex-col items-center justify-center min-h-[85vh]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-[56px] mb-3">🔑</div>
          <h1 className="text-[26px] font-bold text-gray-800">אזור ניהול</h1>
          <p className="text-[16px] text-gray-500 mt-1">הכניסו סיסמה להמשך</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4">
          <input
            type="password"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="סיסמה"
            maxLength={10}
            autoFocus
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-[24px] text-center tracking-widest focus:border-primary focus:outline-none"
          />

          {error && (
            <p className="text-center text-red-500 text-[16px] font-medium">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full h-14 rounded-xl bg-primary text-white text-[19px] font-bold active:scale-95 transition-all"
          >
            כניסה →
          </button>

          {/* רמז */}
          <div className="text-center">
            <button
              onClick={() => setShowHint(h => !h)}
              className="text-gray-400 text-[14px] underline"
            >
              {showHint ? 'הסתר רמז' : '? שכחתי את הסיסמה'}
            </button>
            {showHint && (
              <p className="mt-2 text-[15px] text-primary font-medium bg-primary-light rounded-xl px-4 py-2">
                💡 רמז: {HINT}
              </p>
            )}
          </div>
        </div>

        <button
          className="mt-6 w-full text-center text-gray-400 text-[15px]"
          onClick={() => nav('/')}
        >
          → חזרה לבית
        </button>
      </div>
    </div>
  )
}
