import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

const EMOJIS = ['👩‍🦳','👨‍🦱','👧','👦','👩','👨','👴','👵','👶','🧑','👩‍🦰','👨‍🦳']

function MemberCard({ member, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-primary-light border-2 border-primary flex items-center justify-center text-[32px] overflow-hidden flex-shrink-0">
        {member.photo
          ? <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
          : member.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[19px] font-bold text-gray-800">{member.name}</p>
        <p className="text-[15px] text-gray-500">{member.relation}</p>
        {member.wrong?.filter(Boolean).length > 0 && (
          <p className="text-[13px] text-gray-400 mt-0.5">שגויים: {member.wrong.filter(Boolean).join(', ')}</p>
        )}
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(member)}
          className="px-4 py-1.5 rounded-xl border border-primary text-primary text-[14px] font-semibold active:scale-95"
        >
          עריכה
        </button>
        <button
          onClick={() => onDelete(member.id)}
          className="px-4 py-1.5 rounded-xl border border-red-300 text-red-500 text-[14px] active:scale-95"
        >
          מחיקה
        </button>
      </div>
    </div>
  )
}

function MemberForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    name: '', relation: '', emoji: '👩‍🦳', photo: null,
    voice: '', wrong: ['', ''],
  })

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }
  function setWrong(i, val) {
    const w = [...(form.wrong || ['',''])]
    w[i] = val
    set('wrong', w)
  }

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('photo', ev.target.result)
    reader.readAsDataURL(file)
  }

  const valid = form.name.trim() && form.relation.trim()

  return (
    <div className="bg-white rounded-2xl border-2 border-primary p-5 flex flex-col gap-4">
      <h2 className="text-[20px] font-bold text-primary">
        {initial ? 'עריכת איש משפחה' : 'הוספת איש משפחה'}
      </h2>

      {/* תמונה / אמוג'י */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-light border-2 border-primary flex items-center justify-center text-[36px] overflow-hidden flex-shrink-0">
          {form.photo
            ? <img src={form.photo} alt="" className="w-full h-full object-cover" />
            : form.emoji}
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-[13px] text-gray-500 font-medium">העלאת תמונה</label>
          <input
            type="file" accept="image/*"
            onChange={handlePhoto}
            className="text-[14px] text-gray-600 file:ml-3 file:py-1 file:px-3 file:rounded-full file:border file:border-primary file:text-primary file:bg-primary-light file:text-[13px] file:font-semibold"
          />
          {form.photo && (
            <button onClick={() => set('photo', null)} className="text-[13px] text-red-400 text-right">
              הסר תמונה
            </button>
          )}
        </div>
      </div>

      {/* אמוג'י בחירה (אם אין תמונה) */}
      {!form.photo && (
        <div>
          <label className="text-[14px] text-gray-500 font-medium mb-1 block">אמוג'י</label>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => set('emoji', e)}
                className={`w-10 h-10 rounded-xl text-[22px] border-2 transition-all ${form.emoji === e ? 'border-primary bg-primary-light' : 'border-gray-200'}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* שם */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-1 block">שם *</label>
        <input
          type="text" value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="לדוגמה: שרה"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[18px] focus:border-primary focus:outline-none"
        />
      </div>

      {/* קרבה */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-1 block">קרבה משפחתית *</label>
        <input
          type="text" value={form.relation} onChange={e => set('relation', e.target.value)}
          placeholder="לדוגמה: הבת, הנכד, הבן..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[18px] focus:border-primary focus:outline-none"
        />
      </div>

      {/* טקסט קריינות */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-1 block">טקסט לקריינות</label>
        <input
          type="text" value={form.voice} onChange={e => set('voice', e.target.value)}
          placeholder={`לדוגמה: זו ${form.name || 'שרה'}, ${form.relation || 'הבת'} שלך`}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[16px] focus:border-primary focus:outline-none"
        />
      </div>

      {/* שמות שגויים למשחק */}
      <div>
        <label className="text-[14px] text-gray-500 font-medium mb-1 block">
          שמות שגויים למשחק "מי זה?"
        </label>
        <div className="flex gap-2">
          {[0, 1].map(i => (
            <input
              key={i}
              type="text"
              value={(form.wrong || ['',''])[i]}
              onChange={e => setWrong(i, e.target.value)}
              placeholder={i === 0 ? 'שם שגוי 1' : 'שם שגוי 2'}
              className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-[16px] focus:border-primary focus:outline-none"
            />
          ))}
        </div>
      </div>

      {/* כפתורים */}
      <div className="flex gap-3 pt-1">
        <button
          disabled={!valid}
          onClick={() => onSave(form)}
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

export default function FamilyManagerScreen() {
  const nav = useNavigate()
  const { family, addFamilyMember, updateFamilyMember, removeFamilyMember } = useData()
  const [editing, setEditing] = useState(null)   // null | 'new' | member object
  const [deleteId, setDeleteId] = useState(null)

  function handleSave(form) {
    if (editing === 'new') {
      addFamilyMember(form)
    } else {
      updateFamilyMember(editing.id, form)
    }
    setEditing(null)
  }

  function confirmDelete(id) { setDeleteId(id) }
  function doDelete() { removeFamilyMember(deleteId); setDeleteId(null) }

  return (
    <div className="screen-enter flex flex-col min-h-[85vh]">
      {/* כותרת */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[22px] font-bold text-primary">👨‍👩‍👧 בני משפחה</h1>
        <button className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-500 text-[14px] active:scale-95" onClick={() => nav('/caregiver')}>
          → חזרה
        </button>
      </div>

      {/* טופס עריכה / הוספה */}
      {editing && (
        <div className="mb-5">
          <MemberForm
            initial={editing === 'new' ? null : editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {/* רשימה */}
      {!editing && (
        <>
          <div className="flex flex-col gap-3 mb-5">
            {family.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-[17px]">
                אין בני משפחה עדיין.<br />לחצו על "הוספה" כדי להתחיל.
              </div>
            )}
            {family.map(m => (
              <MemberCard
                key={m.id}
                member={m}
                onEdit={setEditing}
                onDelete={confirmDelete}
              />
            ))}
          </div>

          <button
            onClick={() => setEditing('new')}
            className="w-full h-14 rounded-2xl border-2 border-dashed border-primary text-primary text-[19px] font-bold active:scale-95 bg-primary-light"
          >
            + הוספת בן/בת משפחה
          </button>
        </>
      )}

      {/* אישור מחיקה */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <p className="text-[20px] font-bold mb-2">למחוק את האיש הזה?</p>
            <p className="text-gray-500 mb-5">פעולה זו לא ניתנת לביטול</p>
            <div className="flex gap-3">
              <button onClick={doDelete} className="flex-1 h-12 bg-red-500 text-white rounded-xl font-bold active:scale-95">מחיקה</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 h-12 border-2 border-gray-300 rounded-xl text-gray-600 active:scale-95">ביטול</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
