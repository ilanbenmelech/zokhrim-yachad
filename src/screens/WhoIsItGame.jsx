import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Feedback, speak } from '../components/UI'
import { useData } from '../context/DataContext'

function buildQuestion(person) {
  const wrong = (person.wrong || []).filter(Boolean).slice(0, 1)
  const choices = [person.name, ...wrong].sort(() => Math.random() - 0.5)
  return { person, choices }
}

export default function WhoIsItGame() {
  const nav = useNavigate()
  const { family } = useData()
  const [queue] = useState(() => [...family].sort(() => Math.random() - 0.5))
  const [idx, setIdx] = useState(0)
  const [question, setQuestion] = useState(() => family.length ? buildQuestion(family[0]) : null)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [chosen, setChosen] = useState(null)

  useEffect(() => { speak('מי זה?') }, [idx])

  if (!family.length) return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center gap-4">
      <p className="text-[20px] text-gray-500">אין בני משפחה מוגדרים עדיין</p>
      <button className="btn-main filled" onClick={() => nav('/caregiver/family')}>הוספת משפחה</button>
    </div>
  )

  function answer(name) {
    if (answered) return
    setAnswered(true); setChosen(name)
    const correct = name === question.person.name
    const msg = correct
      ? `נכון! זה ${question.person.name}, ${question.person.relation} שלך 🌟`
      : `זה ${question.person.name}, ${question.person.relation} שלך ❤️`
    setFeedback(msg)
    speak(msg.replace('🌟','').replace('❤️',''))
  }

  function next() {
    if (idx + 1 >= queue.length) { nav('/success'); return }
    const ni = idx + 1
    setIdx(ni); setQuestion(buildQuestion(queue[ni]))
    setAnswered(false); setFeedback(''); setChosen(null)
  }

  const { person, choices } = question

  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <TopBar title="מי זה?" />
      <h1 className="screen-title">מי זה?</h1>
      <div className="w-48 h-48 rounded-full bg-primary-light border-4 border-primary flex items-center justify-center text-[80px] mb-5 overflow-hidden">
        {person.photo ? <img src={person.photo} alt={person.name} className="w-full h-full object-cover" /> : person.emoji}
      </div>
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
      <button className="mt-2 text-primary underline text-[17px]" onClick={() => speak(person.voice || 'מי זה?')}>
        🔊 השמעה חוזרת
      </button>
      <div className="flex gap-4 mt-6">
        {answered && (
          <button onClick={next} className="px-8 py-3 rounded-full bg-primary text-white text-[18px] font-bold active:scale-95">
            {idx + 1 < queue.length ? 'הבא ←' : 'סיום 🌟'}
          </button>
        )}
        <button className="btn-back" onClick={() => nav('/activities')}>→ חזרה</button>
      </div>
    </div>
  )
}
