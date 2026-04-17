import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

const EMOJIS = ['👩‍🦳','👨‍🦱','👧','👦','👩','👨','👴','👵','👶','🧑','👩‍🦰','👨‍🦳']

const DIFFICULTY_LABELS = {
  1: { label: 'קל מאוד', sub: 'בן/בת, בעל/אישה', color: 'bg-green-100 border-green-400 text-green-800' },
  2: { label: 'קל',      sub: 'נכד/ה, אח/ות',    color: 'bg-blue-100 border-blue-400 text-blue-800' },
  3: { label: 'בינוני',  sub: 'דוד/ה, חבר/ה',    color: 'bg-yellow-100 border-yellow-400 text-yellow-800' },
  4: { label: 'קשה',     sub: 'בן של אח/ות',     color: 'bg-orange-100 border-orange-400 text-orange-800' },
  5: { label: 'קשה מאוד',sub: 'מכר, שכן',        color: 'bg-red-100 border-red-400 text-red-800' },
}

function PhotoGrid({ photos, onAdd, onDelete, uploading }) {
  return (
    <div>
      <label className="text-[14px] text-gray-500 font-medium mb-2 block">
        תמונות ({photos.length})
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {photos.map((p, i) => (
          <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200">
            <img src={p.url} alt="" className="w-full h-full object-cover" />
            <button
              onClick={() => onDelete(p)}
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-[12px] flex items-center justify-center font-bold"
            >×</button>
          </div>
        ))}
        <label className={`w-20 h-20 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
          ${uploading ? 'border-gray-300 bg-gray-50' : 'border-primary bg-primary-light hover:bg-primary/10'}`}>
          {uploading
            ? <span className="text-[11px] text-gray-400 text-center">מעלה...</span>
            : <><span className="text-[24px]">+</span><span className="text-[11px] text-primary font-semibold">הוסף</span></>
          }
          <input type="file" accept="image/*" multiple className="hidden" onChange={onAdd} disabled={uploading} />
        </label>
      </div>
    </div>
  )
}

function MemberCard({ member, onEdit, onDelete }) {
  const mainPhoto = member.photos?.[0]?.url
  const diff = DIFFICULTY_LABELS[member.difficulty || 1]
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary flex items-center justify-center text-[30px] overflow-hidden flex-shrink-0">
        {mainPhoto ? <img src={mainPhoto} alt={member.name} className="w-full h-full object-cover" /> : member.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[18px] font-bold text-gray-800">{member.name}</p>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${diff.color}`}>{diff.label}</span>
          <span className="text-[12px] text-gray-400">{member.gender === 'male' ? '♂' : '♀'}</span>
        </div>
        <p className="text-[14px] text-gray-500">{member.relation}</p>
        <p className="text-[12px] text-gray-400">{member.photos?.length || 0} תמונות</p>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button onClick={() => onEdit(member)} className="px-3 py-1.5 rounded-xl border border-primary text-primary text-[13px] font-semibold active:scale-95">עריכה</button>
        <button onClick={() => onDelete(member.id)} className="px-3 py-1.5 rounded-xl border border-red-300 text-red-500 text-[13px] active:scale-95">מחיקה</button>
      </div>
    </div>
  )
}

function MemberForm({ initial, onSave, onCancel, memberId }) {
  const { uploadPhoto, deletePhoto, family } = useData()
  const [form, setForm] = useState(initial || {
    name: '', relation: '', emoji: '👩‍🦳', photos: [],
    gender: 'female', difficulty: 1, voice: '',
  })
  const [uploading, setUploading] = useState(false)

  // תמונות עדכניות תמיד מה-Firebase (לא מה-form הישן)
  const liveMember = family.find(f => f.id === memberId)
  const livePhotos = liveMember?.photos || form.photos || []

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  async function handleAddPhotos(e) {
    const files = Array.from(e.target.files)
    console.log('files:', files.length, 'memberId:', memberId)
    if (!files.length || !memberId) return
    setUploading(true)
    for (const file of files) {
      await uploadPhoto(memberId, file)
    }
    setUploading(false)
    e.target.value = '' // reset input
  }

  async function handleDeletePhoto(photo) {
    if (!memberId) return
    await deletePhoto(memberId, photo)
  }

  const valid = form.name.trim() && form.relation.trim()
  const voicePlaceholder = `לדוגמה: ${form.gender === 'male' ? 'זה' : 'זו'} ${form.name || '...'}, ${form.relation || '...'} שלך`

  return (
    <div className="bg-white rounded-2xl border-2 border-primary p-5 flex flex-col gap-4">
      <h2 className="text-[20px] font-bold text-primary">{initial ? 'עריכת איש משפחה' : 'הוספת איש משפחה'}</h2>

      {/* תמונות */}
      {memberId ? (
        <PhotoGrid
          photos={livePhotos}
          onAdd={handleAddPhotos}
          onDelete={handleDeletePhoto}
          uploading={uploading}
        />
      ) : (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-[14px] text-amber-700">
          💡 שמרו קודם את הפרטים הבסיסיים — אחר כך תוכלו להעלות תמונות
        </div>
      )}

      {/* אמוג'י (אם אין תמונות) */}
      {!livePhotos.length && (
        <div>
          <label className="text-[14px] text-gray-500 font-medium mb-1 block">אמוג'י</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map(e => (
              <button key={e} onClick={() => set('emoji', e)}
                className={`w-10 h-10 rounded-xl text-[22px] border-2 transition-all ${form.emoji===e ? 'border-primary bg-primary-light' : 'border-gray-200'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* שם */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-1 block">שם *</label>
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="לדוגמה: שרה"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[18px] focus:border-primary focus:outline-none" />
      </div>

      {/* קרבה */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-1 block">קרבה משפחתית *</label>
        <input type="text" value={form.relation} onChange={e => set('relation', e.target.value)}
          placeholder="לדוגמה: הבת, הנכד..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[18px] focus:border-primary focus:outline-none" />
      </div>

      {/* מגדר */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-2 block">מגדר</label>
        <div className="flex gap-3">
          {[['female','נקבה ♀'],['male','זכר ♂']].map(([val, lbl]) => (
            <button key={val} onClick={() => set('gender', val)}
              className={`flex-1 h-11 rounded-xl border-2 text-[17px] font-semibold transition-all active:scale-95
                ${form.gender===val ? 'border-primary bg-primary-light text-primary' : 'border-gray-200 text-gray-600'}`}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* רמת קושי */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-2 block">רמת קושי לזיהוי</label>
        <div className="flex gap-1.5">
          {[1,2,3,4,5].map(d => {
            const dl = DIFFICULTY_LABELS[d]
            return (
              <button key={d} onClick={() => set('difficulty', d)}
                className={`flex-1 py-2 rounded-xl border-2 text-center transition-all active:scale-95
                  ${form.difficulty===d ? `${dl.color} border-current` : 'border-gray-200 text-gray-400'}`}>
                <p className="text-[15px] font-bold">{d}</p>
                <p className="text-[10px] leading-tight hidden sm:block">{dl.label}</p>
              </button>
            )
          })}
        </div>
        <p className="text-[13px] text-gray-400 mt-1">{DIFFICULTY_LABELS[form.difficulty].sub}</p>
      </div>

      {/* קריינות */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-1 block">טקסט לקריינות</label>
        <input type="text" value={form.voice} onChange={e => set('voice', e.target.value)}
          placeholder={voicePlaceholder}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[16px] focus:border-primary focus:outline-none" />
      </div>

      {/* כפתורים */}
      <div className="flex gap-3 pt-1">
        <button disabled={!valid} onClick={() => onSave(form)}
          className={`flex-1 h-12 rounded-xl text-[17px] font-bold transition-all active:scale-95
            ${valid ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          שמירה ✓
        </button>
        <button onClick={onCancel}
          className="flex-1 h-12 rounded-xl border-2 border-gray-300 text-gray-500 text-[17px] active:scale-95">
          ביטול
        </button>
      </div>
    </div>
  )
}

export default function FamilyManagerScreen() {
  const nav = useNavigate()
  const { family, addFamilyMember, updateFamilyMember, removeFamilyMember } = useData()
  const [editing, setEditing] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [newMemberId, setNewMemberId] = useState(null)

  async function handleSave(form) {
    if (editing === 'new') {
      const id = 'p_' + Date.now()
      setNewMemberId(id)
      await addFamilyMember({ ...form, id })
      setEditing({ ...form, id, photos: [] })
    } else {
      updateFamilyMember(editing.id, form)
      setEditing(null)
      setNewMemberId(null)
    }
  }

  const sortedFamily = [...family].sort((a,b) => (a.difficulty||1) - (b.difficulty||1))

  return (
    <div className="screen-enter flex flex-col min-h-[85vh]">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[22px] font-bold text-primary">👨‍👩‍👧 בני משפחה</h1>
        <button className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-500 text-[14px] active:scale-95" onClick={() => nav('/caregiver')}>
          → חזרה
        </button>
      </div>

      {editing && (
        <div className="mb-5">
          <MemberForm
            initial={editing === 'new' ? null : editing}
            memberId={editing === 'new' ? newMemberId : editing?.id}
            onSave={handleSave}
            onCancel={() => { setEditing(null); setNewMemberId(null) }}
          />
        </div>
      )}

      {!editing && (
        <>
          {/* מקרא רמות */}
          <div className="flex gap-1.5 flex-wrap mb-4">
            {Object.entries(DIFFICULTY_LABELS).map(([d, dl]) => (
              <span key={d} className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${dl.color}`}>
                {d} — {dl.label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-5">
            {sortedFamily.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-[17px]">
                אין בני משפחה עדיין.
              </div>
            )}
            {sortedFamily.map(m => (
              <MemberCard key={m.id} member={m} onEdit={setEditing} onDelete={id => setDeleteId(id)} />
            ))}
          </div>

          <button onClick={() => setEditing('new')}
            className="w-full h-14 rounded-2xl border-2 border-dashed border-primary text-primary text-[19px] font-bold active:scale-95 bg-primary-light">
            + הוספת בן/בת משפחה
          </button>
        </>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <p className="text-[20px] font-bold mb-2">למחוק?</p>
            <p className="text-gray-500 mb-5">פעולה זו תמחק גם את כל התמונות</p>
            <div className="flex gap-3">
              <button onClick={() => { removeFamilyMember(deleteId); setDeleteId(null) }}
                className="flex-1 h-12 bg-red-500 text-white rounded-xl font-bold active:scale-95">מחיקה</button>
              <button onClick={() => setDeleteId(null)}
                className="flex-1 h-12 border-2 border-gray-300 rounded-xl active:scale-95">ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
