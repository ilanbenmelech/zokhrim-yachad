import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { speak } from '../components/UI'
import { useData } from '../context/DataContext'
import { useScreenSize } from '../hooks/useScreenSize'

const DAYS = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']
const todayName = DAYS[new Date().getDay()]

export default function DailyScreen() {
  const nav = useNavigate()
  const { questions } = useData()
  const { isSmall } = useScreenSize()

  const [idx, setIdx]         = useState(0)
  const [choices, setChoices] = useState([])
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [chosen, setChosen]   = useState(null)

  const q = questions[idx]

  useEffect(() => {
    if (!q) return
    if (q.isDay) {
      const others = DAYS.filter(d => d !== todayName).sort(() => Math.random() - 0.5).slice(0,2)
      setChoices([todayName, ...others].sort(() => Math.random() - 0.5))
    } else {
      setChoices([...(q.choices||[])].sort(() => Math.random() - 0.5))
    }
    speak(q.question)
    setAnswered(false); setFeedback(''); setChosen(null)
  }, [idx, questions])

  if (!questions.length) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flex:1, textAlign:'center', gap:'16px' }}>
      <p style={{ fontSize:'20px', color:'#6B7280' }}>אין שאלות יומיות מוגדרות</p>
      <button className="btn-main filled" onClick={() => nav('/caregiver/questions')}>הוספת שאלות</button>
    </div>
  )

  const correct = q.isDay ? todayName : q.correct
  const btnH = isSmall ? '60px' : '72px'
  const btnFont = isSmall ? '19px' : '22px'

  function answer(choice) {
    if (answered) return
    setAnswered(true); setChosen(choice)
    if (choice === correct) { setFeedback('מצוין! ממש נכון 🌟'); speak('מצוין! ממש נכון') }
    else { setFeedback(`התשובה הנכונה היא: ${correct} ❤️`); speak(`התשובה הנכונה היא ${correct}`) }
  }

  function next() {
    if (idx + 1 >= questions.length) nav('/success')
    else setIdx(i => i + 1)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden', alignItems:'center' }}>
      <div className="top-bar" style={{ width:'100%', marginBottom: isSmall ? '6px' : '12px' }}>
        <span className="app-logo" style={{ fontSize: isSmall ? '16px' : '20px' }}>☀️ תרגול יומי</span>
        <button onClick={() => nav('/')} style={{ padding:'6px 16px', borderRadius:'99px', border:'2px solid #D1D5DB', color:'#6B7280', fontSize:'14px', background:'white' }}>
          → בית
        </button>
      </div>

      {/* שאלה */}
      <div style={{
        width:'100%', maxWidth:'440px',
        background:'white', borderRadius:'20px',
        border:'2px solid #E8F4F6',
        padding: isSmall ? '16px' : '24px',
        textAlign:'center', marginBottom: isSmall ? '12px' : '20px',
      }}>
        <p style={{ fontSize: isSmall ? '22px' : '26px', fontWeight:700, color:'#1F2937' }}>{q.question}</p>
        <button onClick={() => speak(q.question)} style={{ marginTop:'8px', fontSize:'15px', color:'#2E7D8C', textDecoration:'underline', background:'none', border:'none' }}>
          🔊 השמיעי שוב
        </button>
      </div>

      {/* תשובות */}
      <div style={{ display:'flex', flexDirection:'column', gap: isSmall ? '8px' : '12px', width:'100%', maxWidth:'440px', flex:1 }}>
        {choices.map(c => {
          let bg = 'white', border = '#D1D5DB', color = '#1F2937'
          if (answered && c === correct) { bg='#EAF5EC'; border='#3A7D44'; color='#3A7D44' }
          else if (answered && c === chosen && c !== correct) { bg='#FCEBEB'; border='#E24B4A'; color='#A32D2D' }
          return (
            <button key={c} disabled={answered} onClick={() => answer(c)}
              style={{ width:'100%', height:btnH, borderRadius:'16px', border:`2px solid ${border}`,
                background:bg, color, fontSize:btnFont, fontWeight:700, transition:'all 0.15s' }}>
              {c}
            </button>
          )
        })}
      </div>

      <div style={{ fontSize:'18px', fontWeight:700, color:'#3A7D44', minHeight:'28px', marginTop:'8px', textAlign:'center' }}>
        {feedback || '\u00A0'}
      </div>

      <div style={{ display:'flex', gap:'12px', marginTop: isSmall ? '8px' : '12px' }}>
        {answered && (
          <button onClick={next}
            style={{ padding:'10px 28px', borderRadius:'99px', background:'#2E7D8C', color:'white', fontSize:'17px', fontWeight:700 }}>
            {idx + 1 < questions.length ? 'שאלה הבאה ←' : 'סיום 🌟'}
          </button>
        )}
        <button onClick={() => nav('/')}
          style={{ padding:'10px 20px', borderRadius:'99px', border:'2px solid #D1D5DB', color:'#6B7280', fontSize:'15px', background:'white' }}>
          → חזרה לבית
        </button>
      </div>
    </div>
  )
}
