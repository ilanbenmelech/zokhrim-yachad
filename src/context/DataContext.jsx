import React, { createContext, useContext, useState, useEffect } from 'react'

/* ── נתוני ברירת מחדל ── */
const DEFAULT_FAMILY = [
  { id: 'sarah',  name: 'שרה',  relation: 'הבת',          emoji: '👩‍🦳', photo: null, voice: 'זו שרה, הבת שלך',           wrong: ['רחל', 'מרים'] },
  { id: 'daniel', name: 'דניאל',relation: 'הנכד',          emoji: '👨‍🦱', photo: null, voice: 'זה דניאל, הנכד שלך',         wrong: ['יוסי', 'עמוס'] },
  { id: 'noa',    name: 'נועה', relation: 'הנכדה הקטנה',   emoji: '👧',  photo: null, voice: 'זו נועה, הנכדה הקטנה שלך',   wrong: ['תמר', 'דינה'] },
  { id: 'yossi',  name: 'יוסי', relation: 'הבן',           emoji: '👨',  photo: null, voice: 'זה יוסי, הבן שלך',            wrong: ['משה', 'דוד'] },
]

const DAYS = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']
const todayName = DAYS[new Date().getDay()]

const DEFAULT_QUESTIONS = [
  { id: 'day',      question: 'איזה יום היום?',          correct: todayName,   choices: [todayName, 'שני', 'שישי'],   isDay: true },
  { id: 'morning',  question: 'מה עושים אחרי ארוחת בוקר?', correct: 'טיול קצר', choices: ['טיול קצר','שינה ארוכה','שחייה'] },
  { id: 'daughter', question: 'מה שמה של הבת?',          correct: 'שרה',       choices: ['שרה','רחל','מרים'] },
  { id: 'evening',  question: 'מי מתקשר בערב?',          correct: 'יוסי',      choices: ['יוסי','שכן','רופא'] },
]

const DEFAULT_SETTINGS = {
  userName: 'אמא',
  memoryPairs: 4,
  autoSpeak: true,
}

/* ── Context ── */
const DataContext = createContext(null)

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function DataProvider({ children }) {
  const [family,    setFamilyRaw]    = useState(() => load('zj_family',    DEFAULT_FAMILY))
  const [questions, setQuestionsRaw] = useState(() => load('zj_questions', DEFAULT_QUESTIONS))
  const [settings,  setSettingsRaw]  = useState(() => load('zj_settings',  DEFAULT_SETTINGS))

  function setFamily(v)    { setFamilyRaw(v);    save('zj_family', v) }
  function setQuestions(v) { setQuestionsRaw(v); save('zj_questions', v) }
  function setSettings(v)  { setSettingsRaw(v);  save('zj_settings', v) }

  /* helpers */
  function addFamilyMember(member) {
    const id = 'p_' + Date.now()
    setFamily([...family, { id, wrong: ['', ''], ...member }])
  }
  function updateFamilyMember(id, updates) {
    setFamily(family.map(f => f.id === id ? { ...f, ...updates } : f))
  }
  function removeFamilyMember(id) {
    setFamily(family.filter(f => f.id !== id))
  }

  function addQuestion(q) {
    const id = 'q_' + Date.now()
    setQuestions([...questions, { id, ...q }])
  }
  function updateQuestion(id, updates) {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }
  function removeQuestion(id) {
    setQuestions(questions.filter(q => q.id !== id))
  }

  function updateSettings(updates) {
    setSettings(s => { const next = { ...s, ...updates }; save('zj_settings', next); return next })
  }

  /* photo album derived */
  const photoAlbum = [
    { emoji: '👨‍👩‍👧', caption: 'כל המשפחה', sub: 'יחד באהבה', photo: null },
    ...family.map(f => ({ emoji: f.emoji, caption: f.name, sub: f.relation, photo: f.photo })),
  ]

  return (
    <DataContext.Provider value={{
      family, addFamilyMember, updateFamilyMember, removeFamilyMember,
      questions, addQuestion, updateQuestion, removeQuestion,
      settings, updateSettings,
      photoAlbum,
      DAYS, todayName,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
