import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

function QuestionCard({ q, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-[17px] font-bold text-gray-800 flex-1">{q.question}</p>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => onEdit(q)} className="px-3 py-1 rounded-lg border border-primary text-primary text-[13px] font-semibold active:scale-95">עריכה</button>
          <button onClick={() => onDelete(q.id)} className="px-3 py-1 rounded-lg border border-red-300 text-red-500 text-[13px] active:scale-95">מחיקה</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {(q.choices || []).map((c, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full text-[14px] font-medium
              ${c === q.correct
                ? 'bg-success-light text-success border border-success'
                : 'bg-gray-100 text-gray-500'}`}
          >
            {c === q.correct ? '✓ ' : ''}{c}
          </span>
        ))}
      </div>
    </div>
  )
}

function QuestionForm({ initial, onSave, onCancel }) {
  const [question, setQuestion] = useState(initial?.question || '')
  const [correct,  setCorrect]  = useState(initial?.correct  || '')
  const [choices,  setChoices]  = useState(
    initial?.choices?.length >= 2 ? initial.choices : ['', '', '']
  )

  function setChoice(i, val) {
    const c = [...choices]
    c[i] = val
    setChoices(c)
  }

  function addChoice() { setChoices([...choices, '']) }
  function removeChoice(i) {
    if (choices.length <= 2) return
    const c = [...choices]
    c.splice(i, 1)
    if (correct === choices[i]) setCorrect('')
    setChoices(c)
  }

  const filledChoices = choices.filter(Boolean)
  const valid = question.trim() && correct.trim() && filledChoices.length >= 2 && filledChoices.includes(correct)

  return (
    <div className="bg-white rounded-2xl border-2 border-primary p-5 flex flex-col gap-4">
      <h2 className="text-[20px] font-bold text-primary">
        {initial ? 'עריכת שאלה' : 'הוספת שאלה'}
      </h2>

      {/* שאלה */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-1 block">השאלה *</label>
        <input
          type="text" value={question} onChange={e => setQuestion(e.target.value)}
          placeholder="לדוגמה: מה שמה של הבת?"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[17px] focus:border-primary focus:outline-none"
        />
      </div>

      {/* אפשרויות תשובה */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-2 block">
          אפשרויות תשובה (סמנו את הנכונה)
        </label>
        <div className="flex flex-col gap-2">
          {choices.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <button
                type="button"
                onClick={() => { if (c) setCorrect(c) }}
                className={`w-8 h-8 rounded-full border-2 flex-shrink-0 transition-all
                  ${correct === c && c ? 'bg-success border-success' : 'border-gray-300'}`}
              >
                {correct === c && c ? <span className="text-white text-[16px] font-bold flex items-center justify-center w-full">✓</span> : null}
              </button>
              <input
                type="text" value={c} onChange={e => setChoice(i, e.target.value)}
                placeholder={`אפשרות ${i + 1}`}
                className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-[16px] focus:border-primary focus:outline-none"
              />
              {choices.length > 2 && (
                <button onClick={() => removeChoice(i)} className="text-red-400 text-[20px] px-1">×</button>
              )}
            </div>
          ))}
        </div>
        {choices.length < 4 && (
          <button onClick={addChoice} className="mt-2 text-primary text-[14px] underline">
            + הוספת אפשרות
          </button>
        )}
        {correct && <p className="text-[13px] text-success mt-1">✓ תשובה נכונה: {correct}</p>}
        {!correct && filledChoices.length >= 2 && (
          <p className="text-[13px] text-amber-500 mt-1">לחצו על העיגול ליד התשובה הנכונה</p>
        )}
      </div>

      {/* כפתורים */}
      <div className="flex gap-3 pt-1">
        <button
          disabled={!valid}
          onClick={() => onSave({ question, correct, choices: choices.filter(Boolean) })}
          className={`flex-1 h-12 rounded-xl text-[17px] font-bold transition-all active:scale-95
            ${valid ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
        >
          שמירה ✓
        </button>
        <button
          onClick={onCancel}
          className="flex-1 h-12 rounded-xl border-2 border-gray-300 text-gray-500 text-[17px] active:scale-95"
        >
          ביטול
        </button>
      </div>
    </div>
  )
}

export default function QuestionsManagerScreen() {
  const nav = useNavigate()
  const { questions, addQuestion, updateQuestion, removeQuestion } = useData()
  const [editing, setEditing] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  function handleSave(data) {
    if (editing === 'new') {
      addQuestion(data)
    } else {
      updateQuestion(editing.id, data)
    }
    setEditing(null)
  }

  return (
    <div className="screen-enter flex flex-col min-h-[85vh]">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[22px] font-bold text-primary">☀️ שאלות יומיות</h1>
        <button className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-500 text-[14px] active:scale-95" onClick={() => nav('/caregiver')}>
          → חזרה
        </button>
      </div>

      {editing && (
        <div className="mb-5">
          <QuestionForm
            initial={editing === 'new' ? null : editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {!editing && (
        <>
          <div className="flex flex-col gap-3 mb-5">
            {questions.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-[17px]">
                אין שאלות עדיין.<br/>לחצו "הוספה" כדי להתחיל.
              </div>
            )}
            {questions.map(q => (
              <QuestionCard
                key={q.id}
                q={q}
                onEdit={setEditing}
                onDelete={id => setDeleteId(id)}
              />
            ))}
          </div>

          <button
            onClick={() => setEditing('new')}
            className="w-full h-14 rounded-2xl border-2 border-dashed border-amber-400 text-amber-600 text-[19px] font-bold active:scale-95 bg-amber-50"
          >
            + הוספת שאלה
          </button>
        </>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <p className="text-[20px] font-bold mb-2">למחוק את השאלה?</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => { removeQuestion(deleteId); setDeleteId(null) }} className="flex-1 h-12 bg-red-500 text-white rounded-xl font-bold active:scale-95">מחיקה</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 h-12 border-2 border-gray-300 rounded-xl active:scale-95">ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
