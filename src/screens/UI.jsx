import React from 'react'
import { useNavigate } from 'react-router-dom'

/* ─── TopBar ─────────────────────────────────────────── */
export function TopBar({ title, showHelp = true }) {
  const nav = useNavigate()
  return (
    <div className="top-bar">
      <span className="app-logo">🧠 {title}</span>
      {showHelp && (
        <button className="help-btn" onClick={() => nav('/help')}>
          ? עזרה
        </button>
      )}
    </div>
  )
}

/* ─── BigButton ──────────────────────────────────────── */
export function BigButton({ children, onClick, filled = false, className = '' }) {
  return (
    <button
      className={`btn-main ${filled ? 'filled' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

/* ─── BackButton ─────────────────────────────────────── */
export function BackButton({ to }) {
  const nav = useNavigate()
  return (
    <button className="btn-back mt-auto pt-4" onClick={() => nav(to)}>
      → חזרה
    </button>
  )
}

/* ─── Feedback ───────────────────────────────────────── */
export function Feedback({ msg, type = 'success' }) {
  return (
    <div className={`feedback ${type} my-3`}>
      {msg || '\u00A0'}
    </div>
  )
}

/* ─── ProgressBar ────────────────────────────────────── */
export function ProgressBar({ value, max }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="w-full max-w-md h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* ─── speak (Web Speech API) — נקבה ─────────────────── */
export function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'he-IL'
  utt.rate = 0.85
  utt.pitch = 1.05

  // ננסה לבחור קול נקבה אם קיים
  const voices = window.speechSynthesis.getVoices()
  const heVoices = voices.filter(v => v.lang === 'he-IL' || v.lang === 'he')
  if (heVoices.length) {
    // העדיפו קול נקבה
    const femaleVoice = heVoices.find(v =>
      v.name.toLowerCase().includes('female') ||
      v.name.includes('Carmit') ||
      v.name.includes('Tami') ||
      v.name.includes('נקבה')
    )
    utt.voice = femaleVoice || heVoices[0]
  }

  window.speechSynthesis.speak(utt)
}

/* טוען קולות ומנסה שוב אם הרשימה ריקה */
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices()
  }
}
