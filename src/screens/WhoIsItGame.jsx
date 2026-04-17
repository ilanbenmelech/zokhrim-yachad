import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Feedback, speak } from '../components/UI'
import { useData } from '../context/DataContext'

export default function WhoIsItGame() {
  const nav = useNavigate()
  const { family, gameState, recordWhoResult, getWhoQueue, getWrongNames } = useData()

  const [queue, setQueue]     = useState([])
  const [idx, setIdx]         = useState(0)
  const [choices, setChoices] = useState([])
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [chosen, setChosen]   = useState(null)
  const [currentPhoto, setCurrentPhoto] = useState(null)

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
    // בחר תמונה אקראית מהאדם
    const photos = person.photos || []
    const photo  = photos.length ? photos[Math.floor(Math.random() * photos.length)] : null
    setCurrentPhoto(photo)

    // 3 אפשרויות: השם הנכון + 2 שגויים מאותו מגדר
    const wrong = getWrongNames(person, 2)
    const opts  = [person.name, ...wrong].sort(() => Math.random() - 0.5)
    setChoices(opts)
    setAnswered(false); setFeedback(''); setChosen(null)
    speak('מי זה?')
  }

  if (!family.length) return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center gap-4">
      <p className="text-[20px] text-gray-500">אין בני משפחה מוגדרים עדיין</p>
      <button className="btn-main filled" onClick={() => nav('/caregiver/family')}>הוספת משפחה</button>
    </div>
  )

  const person = queue[idx % queue.length]
  if (!person) return null

  function answer(name) {
    if (answered) return
    setAnswered(true); setChosen(name)
    const correct = name === person.name
    recordWhoResult(correct)
    const msg = correct
      ? `נכון! ${person.gender==='male'?'זה':'זו'} ${person.name}, ${person.relation} שלָך 🌟`
      : `${person.gender==='male'?'זה':'זו'} ${person.name}, ${person.relation} שלָך ❤️`
    setFeedback(msg.replace('שלָך','שלך'))
    speak(msg.replace('🌟','').replace('❤️',''))
  }

  function next() {
    if (idx + 1 >= queue.length) {
      nav('/success')
    } else {
      const ni = idx + 1
      setIdx(ni)
      loadQuestion(queue, ni)
    }
  }

  const levelLabel = `רמה ${gameState.whoLevel}`

  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <div className="top-bar">
        <span className="app-logo">👨‍👩‍👧 מי זה?</span>
        <span className="text-[14px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{levelLabel}</span>
      </div>

      <h1 className="screen-title">מי זה?</h1>

      {/* תמונה */}
      <div className="w-52 h-52 rounded-3xl bg-primary-light border-4 border-primary flex items-center justify-center text-[80px] mb-5 overflow-hidden shadow-md">
        {currentPhoto
          ? <img src={currentPhoto.url} alt={person.name} className="w-full h-full object-cover" />
          : <span>{person.emoji}</span>
        }
      </div>

      {/* 3 אפשרויות */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {choices.map(name => {
          let style = 'bg-white border-gray-300 text-gray-800'
          if (answered && name === person.name) style = 'bg-success-light border-success text-success'
          else if (answered && name === chosen && name !== person.name) style = 'bg-red-50 border-red-400 text-red-700'
          return (
            <button key={name} disabled={answered} onClick={() => answer(name)}
              className={`w-full h-[72px] rounded-2xl border-2 text-[22px] font-bold transition-all active:scale-95 ${style}`}>
              {name}
            </button>
          )
        })}
      </div>

      <Feedback msg={feedback} />

      <button className="mt-2 text-primary underline text-[17px]"
        onClick={() => speak(person.voice || 'מי זה?')}>
        🔊 השמעה חוזרת
      </button>

      <div className="flex gap-4 mt-6">
        {answered && (
          <button onClick={next}
            className="px-8 py-3 rounded-full bg-primary text-white text-[18px] font-bold active:scale-95">
            {idx + 1 < queue.length ? 'הבא ←' : 'סיום 🌟'}
          </button>
        )}
        <button className="btn-back" onClick={() => nav('/activities')}>→ חזרה</button>
      </div>
    </div>
  )
}
