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

/* ─── speak (Web Speech API) ─────────────────────────── */
export function speak(text) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'he-IL'
  utt.rate = 0.85
  utt.pitch = 1
  window.speechSynthesis.speak(utt)
}
