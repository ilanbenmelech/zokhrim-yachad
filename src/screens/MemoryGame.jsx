import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Feedback, ProgressBar, speak } from '../components/UI'
import { useData } from '../context/DataContext'

const MEMORY_EMOJIS = ['🌸','🌻','🦋','🐠','🍎','🌈','🐶','🦁','🐸','🦊','🍓','⭐']

function buildCards(pairs) {
  const chosen = [...MEMORY_EMOJIS].sort(() => Math.random() - 0.5).slice(0, pairs)
  return [...chosen, ...chosen]
    .sort(() => Math.random() - 0.5)
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
}

function gridCols(pairs) {
  if (pairs <= 3) return 'grid-cols-3'
  return 'grid-cols-4'
}

export default function MemoryGame() {
  const nav = useNavigate()
  const { gameState, recordMemoryResult } = useData()
  const PAIRS = Math.max(2, gameState.memoryPairs || 4)

  const [cards, setCards]       = useState(() => buildCards(PAIRS))
  const [selected, setSelected] = useState([])
  const [locked, setLocked]     = useState(false)
  const [matchedCount, setMatchedCount] = useState(0)
  const [feedback, setFeedback] = useState('')

  // ref לספירה מדויקת — לא תלויה ב-state אסינכרוני
  const totalChoicesRef = useRef(0)
  const hintTimer = useRef(null)

  function resetHintTimer() {
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => speak('בואי ננסה. לחצי על קלף כלשהו'), 8000)
  }

  useEffect(() => {
    speak('בואי נתאים שתי תמונות זהות')
    resetHintTimer()
    totalChoicesRef.current = 0
    return () => clearTimeout(hintTimer.current)
  }, [])

  function flipCard(card) {
    if (locked || card.flipped || card.matched) return
    resetHintTimer()
    const newCards = cards.map(c => c.id === card.id ? { ...c, flipped: true } : c)
    setCards(newCards)
    totalChoicesRef.current += 1
    const newSelected = [...selected, card]
    setSelected(newSelected)
    if (newSelected.length === 2) {
      setLocked(true)
      setTimeout(() => checkMatch(newSelected, newCards), 900)
    }
  }

  function checkMatch([a, b], currentCards) {
    if (a.emoji === b.emoji) {
      const updated = currentCards.map(c => c.emoji === a.emoji ? { ...c, matched: true } : c)
      setCards(updated)
      const newCount = matchedCount + 1
      setMatchedCount(newCount)
      setFeedback('יפה מאוד! 🌟')
      speak('יפה מאוד')
      if (newCount === PAIRS) {
        // חישוב ממוצע מדויק מה-ref
        const avg = totalChoicesRef.current / PAIRS
        console.log('משחק הסתיים — סך בחירות:', totalChoicesRef.current, 'זוגות:', PAIRS, 'ממוצע:', avg.toFixed(2))
        recordMemoryResult(avg)
        setTimeout(() => nav('/success?from=memory'), 1200)
      }
    } else {
      setCards(currentCards.map(c =>
        c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c
      ))
      setFeedback('ננסה שוב 💪')
      speak('ננסה שוב')
      setTimeout(() => setFeedback(''), 1400)
    }
    setSelected([])
    setLocked(false)
  }

  function giveHint() {
    const unmatched = cards.filter(c => !c.matched && !c.flipped)
    if (!unmatched.length) return
    const card = unmatched[Math.floor(Math.random() * unmatched.length)]
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c))
    speak('הנה רמז')
    setTimeout(() => {
      setCards(prev => prev.map(c =>
        c.id === card.id && !c.matched ? { ...c, flipped: false } : c
      ))
    }, 1800)
  }

  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <div className="top-bar">
        <span className="app-logo">🃏 משחק זיכרון</span>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{PAIRS} זוגות</span>
          <button
            className="px-4 py-2 rounded-full border-2 border-accent text-accent font-semibold text-[15px] bg-white active:scale-95"
            onClick={giveHint}
          >
            💡 רמז
          </button>
        </div>
      </div>

      <p className="text-[20px] text-gray-600 mb-3 font-medium">התאימי שתי תמונות זהות</p>
      <ProgressBar value={matchedCount} max={PAIRS} />
      <Feedback msg={feedback} />

      <div className={`grid ${gridCols(PAIRS)} gap-3 w-full max-w-sm my-2`}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flipCard(card)}
            className={`
              aspect-square rounded-2xl border-3 text-[36px]
              flex items-center justify-center transition-all duration-200 select-none
              ${card.matched
                ? 'bg-success-light border-success cursor-default'
                : card.flipped
                  ? 'bg-white border-primary'
                  : 'bg-primary border-primary text-white active:scale-95'
              }
            `}
          >
            {(card.flipped || card.matched) ? card.emoji : '★'}
          </button>
        ))}
      </div>

      <button className="btn-back mt-6" onClick={() => nav('/activities')}>→ חזרה</button>
    </div>
  )
}
