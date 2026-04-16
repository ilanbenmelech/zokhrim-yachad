import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, speak } from '../components/UI'
import { useData } from '../context/DataContext'

export default function PhotosScreen() {
  const nav = useNavigate()
  const { photoAlbum } = useData()
  const [idx, setIdx] = useState(0)
  const photo = photoAlbum[idx]

  if (!photoAlbum.length) return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center gap-4">
      <p className="text-[20px] text-gray-500">אין תמונות עדיין</p>
      <button className="btn-main filled" onClick={() => nav('/caregiver/family')}>הוספת משפחה</button>
    </div>
  )

  function next() { setIdx(i => (i + 1) % photoAlbum.length) }
  function prev() { setIdx(i => (i - 1 + photoAlbum.length) % photoAlbum.length) }

  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <TopBar title="תמונות משפחה" />
      <h1 className="screen-title">משפחה אהובה 💙</h1>
      <div className="w-56 h-56 rounded-3xl bg-primary-light border-4 border-primary flex items-center justify-center text-[90px] my-4 overflow-hidden shadow-md">
        {photo.photo ? <img src={photo.photo} alt={photo.caption} className="w-full h-full object-cover" /> : photo.emoji}
      </div>
      <p className="text-[26px] font-bold text-gray-800 mt-2">{photo.caption}</p>
      <p className="text-[18px] text-gray-500 mt-1">{photo.sub}</p>
      <button className="mt-3 text-primary text-[17px] underline" onClick={() => speak(`${photo.caption} — ${photo.sub}`)}>
        🔊 השמיעי את השם
      </button>
      <div className="flex gap-5 mt-7">
        <button onClick={prev} className="w-36 h-14 rounded-2xl border-2 border-primary text-primary text-[20px] font-bold bg-white active:scale-95">→ הקודם</button>
        <button onClick={next} className="w-36 h-14 rounded-2xl bg-primary text-white text-[20px] font-bold active:scale-95">הבא ←</button>
      </div>
      <div className="flex gap-2 mt-5">
        {photoAlbum.map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === idx ? 'bg-primary' : 'bg-gray-300'}`} />
        ))}
      </div>
      <button className="btn-back mt-auto" onClick={() => nav('/')}>→ חזרה לבית</button>
    </div>
  )
}
