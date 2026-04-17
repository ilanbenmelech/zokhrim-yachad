import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { speak } from '../components/UI'

function CaregiverHelp({ onBack }) {
  return (
    <div className="screen-enter flex flex-col min-h-[85vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[22px] font-bold text-primary">? עזרה — אזור ניהול</h1>
        <button className="px-4 py-2 rounded-full border-2 border-gray-300 text-gray-500 text-[14px] active:scale-95" onClick={onBack}>
          → חזרה
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-[17px] font-bold text-gray-800 mb-2">👨‍👩‍👧 בני משפחה</p>
          <ul className="flex flex-col gap-2 text-[15px] text-gray-600">
            <li>• לחצו "הוספת בן/בת משפחה" כדי להוסיף איש חדש</li>
            <li>• הגדירו שם, קרבה, מגדר ורמת קושי לזיהוי (1=קל, 5=קשה)</li>
            <li>• לכל איש משפחה יש 3 כפתורים:</li>
            <li>&nbsp;&nbsp;✏️ <strong>עריכה</strong> — לשינוי שם, קרבה, מגדר ורמה</li>
            <li>&nbsp;&nbsp;📷 <strong>תמונות</strong> — להוספה ומחיקת תמונות</li>
            <li>&nbsp;&nbsp;🗑️ <strong>מחיקה</strong> — מחיקת האיש וכל תמונותיו</li>
            <li>• בעת הוספת איש חדש — שמרו קודם, ואחר כך לחצו 📷 תמונות</li>
            <li>• ניתן להעלות כמה תמונות לכל אדם</li>
            <li>• רמת קושי: בן/בת/בעל = 1, נכד = 2, דוד = 3, ילד אחיין = 4, מכר = 5</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-[17px] font-bold text-gray-800 mb-2">☀️ שאלות יומיות</p>
          <ul className="flex flex-col gap-2 text-[15px] text-gray-600">
            <li>• לחצו "הוספת שאלה" ורשמו את השאלה</li>
            <li>• הוסיפו 2-4 אפשרויות תשובה</li>
            <li>• לחצו על העיגול ליד התשובה הנכונה לסמן אותה</li>
            <li>• שאלת "איזה יום היום?" מתעדכנת אוטומטית</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-[17px] font-bold text-gray-800 mb-2">⚙️ הגדרות</p>
          <ul className="flex flex-col gap-2 text-[15px] text-gray-600">
            <li>• שנו את שם הפנייה (אמא, סבתא, רות...)</li>
            <li>• הפעילו או כבו קריינות אוטומטית</li>
            <li>• רמת הקושי במשחקים עולה ויורדת אוטומטית לפי הביצועים</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-[17px] font-bold text-gray-800 mb-2">🔄 עדכון האפליקציה</p>
          <ul className="flex flex-col gap-2 text-[15px] text-gray-600">
            <li>• כל שינוי שנשמר מופיע מיד בכל המכשירים</li>
            <li>• אין צורך לרענן את הדף</li>
            <li>• התמונות נשמרות בענן ולא תאבדנה</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function UserHelp() {
  const nav = useNavigate()
  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <div className="flex justify-between items-center w-full mb-6">
        <h1 className="text-[22px] font-bold text-primary">? עזרה</h1>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button onClick={() => { speak('חוזרים לדף הבית'); nav('/') }} className="btn-main filled">
          <span className="text-[28px]">🏠</span>
          <span>חזרה לדף הבית</span>
        </button>
        <button onClick={() => { speak('ננסה שוב'); nav(-1) }} className="btn-main">
          <span className="text-[28px]">🔄</span>
          <span>ננסה שוב</span>
        </button>
        <button onClick={() => speak('קראי לבן משפחה שיעזור לך')} className="btn-main">
          <span className="text-[28px]">📞</span>
          <span>קראי לבן משפחה</span>
        </button>
      </div>
      <div className="mt-8 w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6">
        <p className="text-[18px] font-bold text-gray-700 mb-3">איך משתמשים?</p>
        <ul className="flex flex-col gap-3 text-[17px] text-gray-600">
          <li>✅ לוחצים על הכפתורים הגדולים</li>
          <li>✅ כפתור "חזרה" מחזיר למסך הקודם</li>
          <li>✅ כפתור 🔊 מקריא את הטקסט בקול</li>
          <li>✅ אין ציונים — רק כיף ותרגול</li>
        </ul>
      </div>
    </div>
  )
}

export default function HelpScreen() {
  const nav = useNavigate()
  const [params] = useSearchParams()
  const mode = params.get('mode')

  if (mode === 'caregiver') {
    return <CaregiverHelp onBack={() => nav(-1)} />
  }
  return <UserHelp />
}
