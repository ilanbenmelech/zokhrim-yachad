import React, { createContext, useContext, useState, useEffect } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'

const DAYS = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']
const todayName = DAYS[new Date().getDay()]

/* שמות לפי מגדר — ניתן להרחיב */
export const NAMES_BY_GENDER = {
  male:   ['דוד','משה','יוסי','אבי','רון','גיל','עמי','אורי','נועם','תום','ארי','בן','דן','אלי','שי'],
  female: ['רחל','מרים','תמר','דינה','לאה','רות','נעמי','יעל','שרה','רונית','גלית','אורית','נירה','ליאת','מיכל'],
}

const DEFAULT_FAMILY = [
  { id: 'sarah',  name: 'שרה',  relation: 'הבת',        emoji: '👩‍🦳', photos: [], gender: 'female', difficulty: 1, voice: 'זו שרה, הבת שלך' },
  { id: 'daniel', name: 'דניאל',relation: 'הנכד',        emoji: '👨‍🦱', photos: [], gender: 'male',   difficulty: 2, voice: 'זה דניאל, הנכד שלך' },
  { id: 'noa',    name: 'נועה', relation: 'הנכדה הקטנה', emoji: '👧',  photos: [], gender: 'female', difficulty: 3, voice: 'זו נועה, הנכדה הקטנה שלך' },
  { id: 'yossi',  name: 'יוסי', relation: 'הבן',         emoji: '👨',  photos: [], gender: 'male',   difficulty: 1, voice: 'זה יוסי, הבן שלך' },
]

const DEFAULT_QUESTIONS = [
  { id: 'day',      question: 'איזה יום היום?',             correct: todayName,   choices: [todayName,'שני','שישי'], isDay: true },
  { id: 'morning',  question: 'מה עושים אחרי ארוחת בוקר?', correct: 'טיול קצר', choices: ['טיול קצר','שינה ארוכה','שחייה'] },
  { id: 'daughter', question: 'מה שמה של הבת?',            correct: 'שרה',       choices: ['שרה','רחל','מרים'] },
  { id: 'evening',  question: 'מי מתקשר בערב?',            correct: 'יוסי',      choices: ['יוסי','שכן','רופא'] },
]

const DEFAULT_SETTINGS = {
  userName: 'אמא',
  memoryPairs: 3,
  autoSpeak: true,
}

/* ── רמת קושי גלובלית ── */
const DEFAULT_GAME_STATE = {
  whoLevel: 1,        // 1-5
  whoStreak: 0,
  whoFails: 0,
  memoryPairs: 4,     // 2-8 — ברירת מחדל 4
  memoryStreak: 0,
  memoryFails: 0,
}

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [family,    setFamily]    = useState(DEFAULT_FAMILY)
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS)
  const [settings,  setSettings]  = useState(DEFAULT_SETTINGS)
  const [gameState, setGameStateLocal] = useState(DEFAULT_GAME_STATE)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function initIfEmpty() {
      const famRef  = doc(db, 'app', 'family')
      const qRef    = doc(db, 'app', 'questions')
      const setRef  = doc(db, 'app', 'settings')
      const gsRef   = doc(db, 'app', 'gameState')
      const [famSnap, qSnap, setSnap, gsSnap] = await Promise.all([
        getDoc(famRef), getDoc(qRef), getDoc(setRef), getDoc(gsRef)
      ])
      if (!famSnap.exists())  await setDoc(famRef,  { items: DEFAULT_FAMILY })
      if (!qSnap.exists())    await setDoc(qRef,    { items: DEFAULT_QUESTIONS })
      if (!setSnap.exists())  await setDoc(setRef,  DEFAULT_SETTINGS)
      if (!gsSnap.exists())   await setDoc(gsRef,   DEFAULT_GAME_STATE)
    }

    initIfEmpty().then(() => {
      const u1 = onSnapshot(doc(db,'app','family'),    s => { if(s.exists()) setFamily(s.data().items || DEFAULT_FAMILY); setLoading(false) })
      const u2 = onSnapshot(doc(db,'app','questions'), s => { if(s.exists()) setQuestions(s.data().items || DEFAULT_QUESTIONS) })
      const u3 = onSnapshot(doc(db,'app','settings'),  s => { if(s.exists()) setSettings(s.data()) })
      const u4 = onSnapshot(doc(db,'app','gameState'), s => { if(s.exists()) setGameStateLocal(s.data()) })
      return () => { u1(); u2(); u3(); u4() }
    }).catch(err => { console.error('Firebase error:', err); setLoading(false) })
  }, [])

  /* ── פעולות משפחה ── */
  async function saveFamilyToDb(f) { setFamily(f); await setDoc(doc(db,'app','family'), { items: f }) }
  function addFamilyMember(m)      { saveFamilyToDb([...family, { id:'p_'+Date.now(), photos:[], ...m }]) }
  function updateFamilyMember(id,u){ saveFamilyToDb(family.map(f => f.id===id ? {...f,...u} : f)) }
  function removeFamilyMember(id)  { saveFamilyToDb(family.filter(f => f.id!==id)) }

  /* ── כיווץ תמונה לפני העלאה ── */
  function compressImage(file, maxSize = 800, quality = 0.75) {
    return new Promise((resolve) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        let { width, height } = img
        if (width > height) {
          if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize }
        } else {
          if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        canvas.toBlob(blob => resolve(blob || file), 'image/jpeg', quality)
      }
      img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file) }
      img.src = objectUrl
    })
  }

  /* ── העלאת תמונה ל-Storage ── */
  async function uploadPhoto(memberId, file) {
    const compressed = await compressImage(file)
    const path = `photos/${memberId}/${Date.now()}.jpg`
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' })
    const url = await getDownloadURL(storageRef)
    const member = family.find(f => f.id === memberId)
    if (!member) return
    const photos = [...(member.photos || []), { url, path }]
    updateFamilyMember(memberId, { photos })
    return url
  }

  async function deletePhoto(memberId, photo) {
    try { await deleteObject(ref(storage, photo.path)) } catch(e) {}
    const member = family.find(f => f.id === memberId)
    if (!member) return
    updateFamilyMember(memberId, { photos: member.photos.filter(p => p.path !== photo.path) })
  }

  /* ── פעולות שאלות ── */
  async function saveQuestionsToDb(q) { setQuestions(q); await setDoc(doc(db,'app','questions'), { items: q }) }
  function addQuestion(q)             { saveQuestionsToDb([...questions, { id:'q_'+Date.now(), ...q }]) }
  function updateQuestion(id,u)       { saveQuestionsToDb(questions.map(q => q.id===id ? {...q,...u} : q)) }
  function removeQuestion(id)         { saveQuestionsToDb(questions.filter(q => q.id!==id)) }

  /* ── הגדרות ── */
  async function updateSettings(u) {
    const next = {...settings,...u}
    setSettings(next)
    await setDoc(doc(db,'app','settings'), next)
  }

  /* ── מצב משחק ── */
  async function updateGameState(u) {
    const next = {...gameState,...u}
    setGameStateLocal(next)
    await setDoc(doc(db,'app','gameState'), next)
  }

  /* ── אלגוריתם רמות "מי זה?" ── */
  function recordWhoResult(success) {
    let { whoLevel, whoStreak, whoFails } = gameState

    if (success) {
      whoStreak++
      whoFails = 0
      // עלה רמה אחרי 3 הצלחות רצופות, רק אם יש בני משפחה ברמה הבאה
      if (whoStreak >= 3) {
        const nextLevelExists = family.some(f => f.difficulty === whoLevel + 1)
        if (nextLevelExists && whoLevel < 5) {
          whoLevel++
          whoStreak = 0
        } else {
          // אין ברמה הבאה — אפס streak בלי לעלות
          whoStreak = 0
        }
      }
    } else {
      whoFails++
      whoStreak = 0
      if (whoFails >= 2 && whoLevel > 1) {
        whoLevel--
        whoFails = 0
      }
    }
    updateGameState({ whoLevel, whoStreak, whoFails })
  }

  /* ── אלגוריתם רמות זיכרון ── */
  function recordMemoryResult(avgChoicesPerPair) {
    let { memoryPairs, memoryStreak, memoryFails } = gameState
    if (avgChoicesPerPair < 2) {
      memoryStreak++; memoryFails = 0
      if (memoryStreak >= 2 && memoryPairs < 8) { memoryPairs++; memoryStreak = 0 }
    } else if (avgChoicesPerPair > 3) {
      memoryFails++; memoryStreak = 0
      if (memoryFails >= 2 && memoryPairs > 2) { memoryPairs--; memoryFails = 0 }
    } else {
      memoryStreak = 0; memoryFails = 0
    }
    updateGameState({ memoryPairs, memoryStreak, memoryFails })
  }

  /* ── בחירת תמונות לפי רמה ── */
  function getPhotoForWho(person) {
    const photos = person.photos || []
    if (!photos.length) return null
    return photos[Math.floor(Math.random() * photos.length)]
  }

  /* ── בחירת שאלות "מי זה?" לפי רמה ── */
  function getWhoQueue() {
    const level = gameState.whoLevel
    const eligible = family.filter(f => f.difficulty <= level && (f.photos?.length > 0 || f.emoji))
    if (!eligible.length) return family

    // משקולות: בני משפחה ברמה הנוכחית מקבלים משקל גבוה יותר
    const weighted = []
    eligible.forEach(f => {
      const w = f.difficulty === level ? 3 : (f.difficulty === level - 1 ? 2 : 1)
      for (let i = 0; i < w; i++) weighted.push(f)
    })
    return weighted.sort(() => Math.random() - 0.5).slice(0, 6)
  }

  /* ── שמות שגויים לפי מגדר ── */
  function getWrongNames(person, count = 2) {
    const pool = NAMES_BY_GENDER[person.gender || 'female'] || NAMES_BY_GENDER.female
    const filtered = pool.filter(n => n !== person.name)
    return filtered.sort(() => Math.random() - 0.5).slice(0, count)
  }

  const photoAlbum = [
    { emoji: '👨‍👩‍👧', caption: 'כל המשפחה', sub: 'יחד באהבה', photo: null },
    ...family.map(f => ({
      emoji: f.emoji,
      caption: f.name,
      sub: f.relation,
      photo: f.photos?.[0]?.url || null
    })),
  ]

  if (loading) return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:'16px', fontFamily:'Rubik,Arial,sans-serif', direction:'rtl' }}>
      <div style={{ fontSize:'48px' }}>🧠</div>
      <p style={{ fontSize:'20px', color:'#2E7D8C', fontWeight:700 }}>טוען זוכרים יחד...</p>
    </div>
  )

  return (
    <DataContext.Provider value={{
      family, addFamilyMember, updateFamilyMember, removeFamilyMember,
      uploadPhoto, deletePhoto,
      questions, addQuestion, updateQuestion, removeQuestion,
      settings, updateSettings,
      gameState, recordWhoResult, recordMemoryResult,
      getWhoQueue, getWrongNames, getPhotoForWho,
      photoAlbum, DAYS, todayName,
      NAMES_BY_GENDER,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() { return useContext(DataContext) }
