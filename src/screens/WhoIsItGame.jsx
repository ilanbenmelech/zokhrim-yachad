import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { speak } from '../components/UI'
import { useData } from '../context/DataContext'
import { useScreenSize } from '../hooks/useScreenSize'

export default function WhoIsItGame() {
  const nav = useNavigate()
  const { family, gameState, recordWhoResult, getWhoQueue, getWrongNames } = useData()
  const { isSmall, isMedium } = useScreenSize()

  const [queue, setQueue]       = useState([])
  const [idx, setIdx]           = useState(0)
  const [choices, setChoices]   = useState([])
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [chosen, setChosen]     = useState(null)
  const [currentPhoto, setCurrentPhoto] = useState(null)
  const [hintShown, setHintShown] = useState(false)

  useEffect(() => {
    if (family.length) {
      const q = getWhoQueue()
      setQueue(q)
      loadQuestion(q, 0)
    }
  }, [family])

  function loadQuestion(q, i) {
    if (!q.length) return
    const person = q[i % q.length]
    const photos = person.photos || []
    const photo  = photos.length ? photos[Math.floor(Math.random() * photos.length)] : null
    setCurrentPhoto(photo)
    const wrong = getWrongNames(person, 2)
    const opts  = [person.name, ...wrong].sort(() => Math.random() - 0.5)
    setChoices(opts)
    setAnswered(false); setFeedback(''); setChosen(null); setHintShown(false)
    speak('מי זה?')
  }

  if (!family.length) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, textAlign:'center', gap:'16px' }}>
      <p style={{ fontSize:'20px', color:'#6B7280' }}>אין בני משפחה מוגדרים עדיין</p>
      <button className="btn-main filled" onClick={() => nav('/caregiver/family')}>הוספת משפחה</button>
    </div>
  )

  const person = queue[idx % queue.length]
  if (!person) return null

  function getHint(p) {
    const voice = p.voice || ''
    const commaIdx = voice.indexOf(',')
    return commaIdx === -1 ? p.relation : voice.slice(commaIdx + 1).trim()
  }

  function showHint() {
    const hint = getHint(person)
    setHintShown(true)
    speak(hint)
    setFeedback(`💡 ${hint}`)
  }

  function answer(name) {
    if (answered) return
    setAnswered(true); setChosen(name)
    const correct = name === person.name
    recordWhoResult(correct)
    const hint = getHint(person)
    const prefix = person.gender === 'male' ? 'זה' : 'זו'
    const msg = correct ? `נכון! ${prefix} ${person.name}, ${hint}` : `${prefix} ${person.name}, ${hint}`
    setFeedback((correct ? '✓ ' : '') + msg)
    speak(msg)
  }

  function next() {
    if (idx + 1 >= queue.length) nav('/success?from=who')
    else { const ni = idx + 1; setIdx(ni); loadQuestion(queue, ni) }
  }

  // גדלים לפי מסך
  const photoSize = isSmall ? '140px' : isMedium ? '170px' : '200px'
  const btnHeight = isSmall ? '58px' : '68px'
  const btnFontSize = isSmall ? '19px' : '22px'
  const nameFontSize = isSmall ? '14px' : '16px'

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden', alignItems:'center' }}>
      {/* כותרת */}
      <div className="top-bar" style={{ width:'100%', marginBottom: isSmall ? '4px' : '8px' }}>
        <span className="app-logo" style={{ fontSize: isSmall ? '16px' : '20px' }}>👨‍👩‍👧 מי זה?</span>
        <span style={{ fontSize:'13px', color:'#9CA3AF', background:'#F3F4F6', padding:'4px 12px', borderRadius:'99px' }}>
          רמה {gameState.whoLevel}
        </span>
      </div>

      <p style={{ fontSize: isSmall ? '20px' : '24px', fontWeight:700, color:'#1F2937', marginBottom: isSmall ? '6px' : '10px' }}>
        מי זה?
      </p>

      {/* תמונה */}
      <div style={{
        width: photoSize, height: photoSize,
        borderRadius: '50%',
        background: '#E8F4F6',
        border: '4px solid #2E7D8C',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isSmall ? '60px' : '75px',
        overflow: 'hidden',
        flexShrink: 0,
        marginBottom: isSmall ? '8px' : '12px',
      }}>
        {currentPhoto
          ? <img src={currentPhoto.url} alt={person.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <span>{person.emoji}</span>
        }
      </div>

      {/* 3 כפתורי תשובה */}
      <div style={{ display:'flex', flexDirection:'column', gap: isSmall ? '7px' : '10px', width:'100%', maxWidth:'360px' }}>
        {choices.map(name => {
          let bg = 'white', borderColor = '#D1D5DB', color = '#1F2937'
          if (answered && name === person.name) { bg = '#EAF5EC'; borderColor = '#3A7D44'; color = '#3A7D44' }
          else if (answered && name === chosen && name !== person.name) { bg = '#FCEBEB'; borderColor = '#E24B4A'; color = '#A32D2D' }
          return (
            <button key={name} disabled={answered} onClick={() => answer(name)}
              style={{ width:'100%', height: btnHeight, borderRadius:'16px', border:`2px solid ${borderColor}`,
                background: bg, color, fontSize: btnFontSize, fontWeight:700, transition:'all 0.15s' }}>
              {name}
            </button>
          )
        })}
      </div>

      {/* פידבק */}
      <div style={{ fontSize: nameFontSize, fontWeight:600, color:'#2E7D8C', minHeight:'24px', marginTop:'6px', textAlign:'center' }}>
        {feedback || '\u00A0'}
      </div>

      {/* כפתורי עזרה ומעבר */}
      <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', justifyContent:'center', marginTop: isSmall ? '6px' : '10px' }}>
        {!answered && !hintShown && (
          <button onClick={showHint}
            style={{ padding:'8px 18px', borderRadius:'99px', border:'2px solid #E67E2E', color:'#E67E2E', fontWeight:700, fontSize:'15px', background:'white' }}>
            💡 רמז
          </button>
        )}
        <button onClick={() => speak(person.voice || 'מי זה?')}
          style={{ fontSize:'15px', color:'#2E7D8C', textDecoration:'underline', background:'none', border:'none' }}>
          🔊 השמעה חוזרת
        </button>
        {answered && (
          <button onClick={next}
            style={{ padding:'10px 28px', borderRadius:'99px', background:'#2E7D8C', color:'white', fontSize:'17px', fontWeight:700 }}>
            {idx + 1 < queue.length ? 'הבא ←' : 'סיום 🌟'}
          </button>
        )}
      </div>

      <button onClick={() => nav('/activities')}
        style={{ marginTop:'auto', padding:'8px 24px', borderRadius:'99px', border:'2px solid #D1D5DB', color:'#6B7280', fontSize:'14px', background:'white' }}>
        → חזרה
      </button>
    </div>
  )
}
