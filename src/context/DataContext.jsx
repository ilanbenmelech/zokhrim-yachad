import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  doc, getDoc, setDoc, onSnapshot, collection
} from 'firebase/firestore'
import { db } from '../firebase'

/* ── נתוני ברירת מחדל ── */
const DAYS = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']
const todayName = DAYS[new Date().getDay()]

const DEFAULT_FAMILY = [
  { id: 'sarah',  name: 'שרה',  relation: 'הבת',        emoji: '👩‍🦳', photo: null, voice: 'זו שרה, הבת שלך',         wrong: ['רחל','מרים'] },
  { id: 'daniel', name: 'דניאל',relation: 'הנכד',        emoji: '👨‍🦱', photo: null, voice: 'זה דניאל, הנכד שלך',       wrong: ['יוסי','עמוס'] },
  { id: 'noa',    name: 'נועה', relation: 'הנכדה הקטנה', emoji: '👧',  photo: null, voice: 'זו נועה, הנכדה הקטנה שלך', wrong: ['תמר','דינה'] },
  { id: 'yossi',  name: 'יוסי', relation: 'הבן',         emoji: '👨',  photo: null, voice: 'זה יוסי, הבן שלך',          wrong: ['משה','דוד'] },
]

const DEFAULT_QUESTIONS = [
  { id: 'day',      question: 'איזה יום היום?',             correct: todayName,   choices: [todayName,'שני','שישי'], isDay: true },
  { id: 'morning',  question: 'מה עושים אחרי ארוחת בוקר?', correct: 'טיול קצר', choices: ['טיול קצר','שינה ארוכה','שחייה'] },
  { id: 'daughter', question: 'מה שמה של הבת?',            correct: 'שרה',       choices: ['שרה','רחל','מרים'] },
  { id: 'evening',  question: 'מי מתקשר בערב?',            correct: 'יוסי',      choices: ['יוסי','שכן','רופא'] },
]

const DEFAULT_SETTINGS = {
  userName: 'אמא',
  memoryPairs: 4,
  autoSpeak: true,
}

/* ── Document IDs ── */
const DOC_FAMILY    = 'app/family'
const DOC_QUESTIONS = 'app/questions'
const DOC_SETTINGS  = 'app/settings'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [family,    setFamily]    = useState(DEFAULT_FAMILY)
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS)
  const [settings,  setSettings]  = useState(DEFAULT_SETTINGS)
  const [loading,   setLoading]   = useState(true)

  /* ── טעינה ראשונית + האזנה לשינויים ── */
  useEffect(() => {
    // אם אין נתונים ב-Firebase עדיין — נשמור את ברירות המחדל
    async function initIfEmpty() {
      const famRef  = doc(db, 'app', 'family')
      const qRef    = doc(db, 'app', 'questions')
      const setRef  = doc(db, 'app', 'settings')

      const [famSnap, qSnap, setSnap] = await Promise.all([
        getDoc(famRef), getDoc(qRef), getDoc(setRef)
      ])

      if (!famSnap.exists())  await setDoc(famRef,  { items: DEFAULT_FAMILY })
      if (!qSnap.exists())    await setDoc(qRef,    { items: DEFAULT_QUESTIONS })
      if (!setSnap.exists())  await setDoc(setRef,  DEFAULT_SETTINGS)
    }

    initIfEmpty().then(() => {
      // האזנה בזמן אמת לשינויים
      const unsubFamily = onSnapshot(doc(db, 'app', 'family'), snap => {
        if (snap.exists()) setFamily(snap.data().items || DEFAULT_FAMILY)
        setLoading(false)
      })
      const unsubQ = onSnapshot(doc(db, 'app', 'questions'), snap => {
        if (snap.exists()) setQuestions(snap.data().items || DEFAULT_QUESTIONS)
      })
      const unsubSet = onSnapshot(doc(db, 'app', 'settings'), snap => {
        if (snap.exists()) setSettings(snap.data())
      })

      return () => { unsubFamily(); unsubQ(); unsubSet() }
    }).catch(err => {
      console.error('Firebase error:', err)
      setLoading(false)
    })
  }, [])

  /* ── פעולות משפחה ── */
  async function saveFamilyToDb(newFamily) {
    setFamily(newFamily)
    await setDoc(doc(db, 'app', 'family'), { items: newFamily })
  }

  function addFamilyMember(member) {
    const id = 'p_' + Date.now()
    saveFamilyToDb([...family, { id, wrong: ['',''], ...member }])
  }
  function updateFamilyMember(id, updates) {
    saveFamilyToDb(family.map(f => f.id === id ? { ...f, ...updates } : f))
  }
  function removeFamilyMember(id) {
    saveFamilyToDb(family.filter(f => f.id !== id))
  }

  /* ── פעולות שאלות ── */
  async function saveQuestionsToDb(newQ) {
    setQuestions(newQ)
    await setDoc(doc(db, 'app', 'questions'), { items: newQ })
  }

  function addQuestion(q) {
    saveQuestionsToDb([...questions, { id: 'q_' + Date.now(), ...q }])
  }
  function updateQuestion(id, updates) {
    saveQuestionsToDb(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }
  function removeQuestion(id) {
    saveQuestionsToDb(questions.filter(q => q.id !== id))
  }

  /* ── הגדרות ── */
  async function updateSettings(updates) {
    const next = { ...settings, ...updates }
    setSettings(next)
    await setDoc(doc(db, 'app', 'settings'), next)
  }

  /* ── אלבום תמונות ── */
  const photoAlbum = [
    { emoji: '👨‍👩‍👧', caption: 'כל המשפחה', sub: 'יחד באהבה', photo: null },
    ...family.map(f => ({ emoji: f.emoji, caption: f.name, sub: f.relation, photo: f.photo })),
  ]

  if (loading) return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', gap: '16px',
      fontFamily: 'Rubik, Arial, sans-serif', direction: 'rtl'
    }}>
      <div style={{ fontSize: '48px' }}>🧠</div>
      <p style={{ fontSize: '20px', color: '#2E7D8C', fontWeight: 700 }}>טוען זוכרים יחד...</p>
    </div>
  )

  return (
    <DataContext.Provider value={{
      family, addFamilyMember, updateFamilyMember, removeFamilyMember,
      questions, addQuestion, updateQuestion, removeQuestion,
      settings, updateSettings,
      photoAlbum, DAYS, todayName,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
