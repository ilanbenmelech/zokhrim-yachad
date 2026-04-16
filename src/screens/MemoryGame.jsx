import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Feedback, ProgressBar, speak } from '../components/UI'
import { useData } from '../context/DataContext'
import { MEMORY_EMOJIS } from '../data/family'

function buildCards(pairs) {
  const chosen = [...MEMORY_EMOJIS].sort(() => Math.random() - 0.5).slice(0, pairs)
  return [...chosen, ...chosen]
    .sort(() => Math.random() - 0.5)
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
}

export default function MemoryGame() {
  const nav = useNavigate()
  const { settings } = useData()
  const PAIRS = settings.memoryPairs || 4

  const [cards, setCards] = useState(() => buildCards(PAIRS))
  const [selected, setSelected] = useState([])
  const [locked, setLocked] = useState(false)
  const [matchedCount, setMatchedCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const hintTimer = useRef(null)

  function resetHintTimer() {
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => speak('בואי ננסה. לחצי על קלף כלשהו'), 8000)
  }

  useEffect(() => {
    speak('בואי נתאים שתי תמונות זהות')
    resetHintTimer()
    return () => clearTimeout(hintTimer.current)
  }, [])

  function flipCard(card) {
    if (locked || card.flipped || card.matched) return
    resetHintTimer()
    const newCards = cards.map(c => c.id === card.id ? { ...c, flipped: true } : c)
    setCards(newCards)
    const newSelected = [...selected, card]
    setSelected(newSelected)
    if (newSelected.length === 2) { setLocked(true); setTimeout(() => checkMatch(newSelected, newCards), 900) }
  }

  function checkMatch([a, b], currentCards) {
    if (a.emoji === b.emoji) {
      const updated = currentCards.map(c => c.emoji === a.emoji ? { ...c, matched: true } : c)
      setCards(updated)
      const newCount = matchedCount + 1
      setMatchedCount(newCount)
      setFeedback('יופי מאוד! 🌟'); speak('יופי מאוד')
      if (newCount === PAIRS) setTimeout(() => nav('/success'), 1200)
    } else {
      setCards(currentCards.map(c => c.id === a.id || c.id === b.id ? { ...c, flipped: false } : c))
      setFeedback('ננסה שוב 💪'); speak('ננסה שוב')
      setTimeout(() => setFeedback(''), 1400)
    }
    setSelected([]); setLocked(false)
  }

  function giveHint() {
    const unmatched = cards.filter(c => !c.matched && !c.flipped)
    if (!unmatched.length) return
    const card = unmatched[Math.floor(Math.random() * unmatched.length)]
    setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c))
    speak('הנה רמז')
    setTimeout(() => setCards(prev => prev.map(c => c.id === card.id && !c.matched ? { ...c, flipped: false } : c)), 1800)
  }

  const cols = PAIRS <= 3 ? 'grid-cols-3' : 'grid-cols-4'

  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <div className="top-bar">
        <span className="app-logo">🃏 משחק זיכרון</span>
        <button className="px-5 py-2 rounded-full border-2 border-accent text-accent font-semibold text-[16px] bg-white active:scale-95" onClick={giveHint}>
          💡 רמז
        </button>
      </div>
      <p className="text-[20px] text-gray-600 mb-3 font-medium">התאימי שתי תמונות זהות</p>
      <ProgressBar value={matchedCount} max={PAIRS} />
      <Feedback msg={feedback} />
      <div className={`grid ${cols} gap-3 w-full max-w-sm my-2`}>
        {cards.map(card => (
          <button
            key={card.id} onClick={() => flipCard(card)}
            className={`aspect-square rounded-2xl border-3 text-[38px] flex items-center justify-center transition-all duration-200 select-none
              ${card.matched ? 'bg-success-light border-success cursor-default'
                : card.flipped ? 'bg-white border-primary'
                : 'bg-primary border-primary text-white active:scale-95'}`}
          >
            {(card.flipped || card.matched) ? card.emoji : '★'}
          </button>
        ))}
      </div>
      <button className="btn-back mt-6" onClick={() => nav('/activities')}>→ חזרה</button>
    </div>
  )
}
