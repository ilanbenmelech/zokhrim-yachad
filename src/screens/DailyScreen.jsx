import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, Feedback, speak } from '../components/UI'
import { useData } from '../context/DataContext'

const DAYS = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']
const todayName = DAYS[new Date().getDay()]

export default function DailyScreen() {
  const nav = useNavigate()
  const { questions } = useData()

  const [idx, setIdx] = useState(0)
  const [choices, setChoices] = useState([])
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [chosen, setChosen] = useState(null)

  const q = questions[idx]

  useEffect(() => {
    if (!q) return
    // אם שאלת יום — השתמש בימים אמיתיים
    if (q.isDay) {
      const others = DAYS.filter(d => d !== todayName).sort(() => Math.random() - 0.5).slice(0, 2)
      setChoices([todayName, ...others].sort(() => Math.random() - 0.5))
    } else {
      setChoices([...(q.choices || [])].sort(() => Math.random() - 0.5))
    }
    speak(q.question)
    setAnswered(false); setFeedback(''); setChosen(null)
  }, [idx, questions])

  if (!questions.length) return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center gap-4">
      <p className="text-[20px] text-gray-500">אין שאלות יומיות מוגדרות</p>
      <button className="btn-main filled" onClick={() => nav('/caregiver/questions')}>הוספת שאלות</button>
    </div>
  )

  const correct = q.isDay ? todayName : q.correct

  function answer(choice) {
    if (answered) return
    setAnswered(true); setChosen(choice)
    if (choice === correct) {
      setFeedback('מצוין! ממש נכון 🌟'); speak('מצוין! ממש נכון')
    } else {
      setFeedback(`התשובה הנכונה היא: ${correct} ❤️`); speak(`התשובה הנכונה היא ${correct}`)
    }
  }

  function next() {
    if (idx + 1 >= questions.length) nav('/success')
    else setIdx(i => i + 1)
  }

  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <TopBar title="תרגול יומי" />
      <h1 className="screen-title">תרגול יומי ☀️</h1>
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-primary-light p-7 mb-6 text-center shadow-sm">
        <p className="text-[26px] font-bold text-gray-800">{q.question}</p>
        <button className="mt-3 text-primary text-[16px] underline" onClick={() => speak(q.question)}>
          🔊 השמיעי שוב
        </button>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-md">
        {choices.map(c => {
          let style = 'bg-white border-gray-300 text-gray-800'
          if (answered && c === correct) style = 'bg-success-light border-success text-success'
          else if (answered && c === chosen && c !== correct) style = 'bg-red-50 border-red-400 text-red-700'
          return (
            <button key={c} disabled={answered} onClick={() => answer(c)}
              className={`w-full h-[72px] rounded-2xl border-2 text-[22px] font-bold transition-all active:scale-95 ${style}`}>
              {c}
            </button>
          )
        })}
      </div>
      <Feedback msg={feedback} />
      <div className="flex gap-4 mt-4">
        {answered && (
          <button onClick={next} className="px-8 py-3 rounded-full bg-primary text-white text-[18px] font-bold active:scale-95">
            {idx + 1 < questions.length ? 'שאלה הבאה ←' : 'סיום 🌟'}
          </button>
        )}
        <button className="btn-back" onClick={() => nav('/')}>→ חזרה לבית</button>
      </div>
    </div>
  )
}
