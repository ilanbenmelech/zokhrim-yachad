import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Feedback, ProgressBar, speak } from '../components/UI'
import { useData } from '../context/DataContext'
import { useScreenSize } from '../hooks/useScreenSize'

const MEMORY_EMOJIS = ['🌸','🌻','🦋','🐠','🍎','🌈','🐶','🦁','🐸','🦊','🍓','⭐']

function buildCards(pairs) {
  const chosen = [...MEMORY_EMOJIS].sort(() => Math.random() - 0.5).slice(0, pairs)
  return [...chosen, ...chosen]
    .sort(() => Math.random() - 0.5)
    .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
}

export default function MemoryGame() {
  const nav = useNavigate()
  const { gameState, recordMemoryResult } = useData()
  const { isSmall, isMedium } = useScreenSize()
  const PAIRS = Math.max(2, gameState.memoryPairs || 4)

  const [cards, setCards]       = useState(() => buildCards(PAIRS))
  const [selected, setSelected] = useState([])
  const [locked, setLocked]     = useState(false)
  const [matchedCount, setMatchedCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  const totalChoicesRef = useRef(0)
  const hintTimer = useRef(null)

  // גדלים דינמיים לפי המסך
  const cardTextSize = isSmall ? '28px' : isMedium ? '32px' : '38px'
  const btnH = isSmall ? '44px' : '52px'
  const titleSize = isSmall ? '16px' : '20px'

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
    totalChoicesRef.current += 1  // סופר כל לחיצה בודדת
    const newCards = cards.map(c => c.id === card.id ? { ...c, flipped: true } : c)
    setCards(newCards)
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
        const avg = totalChoicesRef.current / (PAIRS * 2)  // לחיצות / סך קלפים
        console.log(`סיום: ${totalChoicesRef.current} לחיצות / ${PAIRS*2} קלפים = ${avg.toFixed(2)}`)
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

  const cols = PAIRS <= 3 ? 3 : 4

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
      {/* כותרת */}
      <div className="top-bar" style={{ marginBottom: isSmall ? '6px' : '10px' }}>
        <span className="app-logo" style={{ fontSize: isSmall ? '16px' : '20px' }}>🃏 משחק זיכרון</span>
        <div className="flex items-center gap-2">
          <span style={{ fontSize:'12px', color:'#888', background:'#f3f4f6', padding:'4px 10px', borderRadius:'99px' }}>{PAIRS} זוגות</span>
          <button
            style={{ padding:'6px 14px', borderRadius:'99px', border:'2px solid #E67E2E', color:'#E67E2E', fontSize:'14px', fontWeight:700, background:'white' }}
            onClick={giveHint}
          >
            💡 רמז
          </button>
        </div>
      </div>

      <p style={{ fontSize: titleSize, color:'#4B5563', marginBottom: isSmall ? '4px' : '8px', textAlign:'center', fontWeight:500 }}>
        התאימי שתי תמונות זהות
      </p>

      <ProgressBar value={matchedCount} max={PAIRS} />

      <div style={{ minHeight:'28px', textAlign:'center', fontSize:'18px', fontWeight:700, color:'#3A7D44', margin: isSmall ? '2px 0' : '4px 0' }}>
        {feedback || '\u00A0'}
      </div>

      {/* לוח קלפים — ממלא את השטח הזמין */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: isSmall ? '8px' : '12px',
        flex: 1,
        alignContent: 'center',
      }}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flipCard(card)}
            style={{
              aspectRatio: '1',
              borderRadius: '14px',
              border: card.matched ? '3px solid #3A7D44'
                    : card.flipped  ? '3px solid #2E7D8C'
                    : '3px solid #2E7D8C',
              background: card.matched ? '#EAF5EC'
                         : card.flipped  ? 'white'
                         : '#2E7D8C',
              fontSize: cardTextSize,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: card.matched ? 'default' : 'pointer',
              transition: 'all 0.15s',
              color: (!card.flipped && !card.matched) ? 'white' : 'inherit',
            }}
          >
            {(card.flipped || card.matched) ? card.emoji : '★'}
          </button>
        ))}
      </div>

      {/* כפתור חזרה */}
      <button
        onClick={() => nav('/activities')}
        style={{ marginTop: isSmall ? '8px' : '12px', padding:`8px 24px`, borderRadius:'99px', border:'2px solid #D1D5DB', color:'#6B7280', fontSize:'15px', background:'white', alignSelf:'center' }}
      >
        → חזרה
      </button>
    </div>
  )
}
