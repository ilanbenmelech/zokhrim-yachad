import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function SettingsScreen() {
  const nav = useNavigate()
  const { settings, updateSettings } = useData()
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({ ...settings })
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function save() {
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="screen-enter flex flex-col min-h-[85vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[22px] font-bold text-primary">⚙️ הגדרות</h1>
        <button className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-500 text-[14px] active:scale-95" onClick={() => nav('/caregiver')}>
          → חזרה
        </button>
      </div>

      <div className="flex flex-col gap-5">

        {/* שם המשתמשת */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <label className="text-[15px] text-gray-500 font-medium mb-2 block">
            שם הפנייה (יופיע במסך הבית)
          </label>
          <input
            type="text"
            value={form.userName}
            onChange={e => set('userName', e.target.value)}
            placeholder="לדוגמה: אמא, סבתא, רות..."
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-[20px] focus:border-primary focus:outline-none"
          />
          <p className="text-[13px] text-gray-400 mt-1">יוצג כ: "שלום {form.userName || '...'} 👋"</p>
        </div>

        {/* קריינות אוטומטית */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[17px] font-bold text-gray-800">קריינות אוטומטית</p>
              <p className="text-[14px] text-gray-400">הקראת הוראות בכניסה לכל מסך</p>
            </div>
            <button
              onClick={() => set('autoSpeak', !form.autoSpeak)}
              className={`w-14 h-8 rounded-full transition-all relative flex-shrink-0
                ${form.autoSpeak ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all
                ${form.autoSpeak ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* שמירה */}
        <button
          onClick={save}
          className={`w-full h-14 rounded-2xl text-[19px] font-bold transition-all active:scale-95
            ${saved ? 'bg-success text-white' : 'bg-primary text-white'}`}
        >
          {saved ? '✓ נשמר!' : 'שמירת הגדרות'}
        </button>

      </div>
    </div>
  )
}
