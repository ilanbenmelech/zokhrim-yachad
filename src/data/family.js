/*
  ===================================================
  קובץ נתוני משפחה — ערכו כאן את הפרטים!
  ===================================================
  כל אחד מהאנשים כולל:
    name    — שם לתצוגה
    relation — קרבה משפחתית
    emoji   — אמוג'י זמני (עד שמעלים תמונה אמיתית)
    photo   — נתיב לתמונה בתיקיית public/photos/
             (הניחו את הקובץ שם והכניסו את השם כאן)
    voice   — טקסט שיוקרא בקול כאשר מציגים את האדם
    wrong   — שמות שגויים לשימוש במשחק "מי זה?"
*/

export const FAMILY = [
  {
    id: 'sarah',
    name: 'שרה',
    relation: 'הבת',
    emoji: '👩‍🦳',
    photo: null,            // לדוגמה: '/photos/sarah.jpg'
    voice: 'זו שרה, הבת שלך',
    wrong: ['רחל', 'מרים'],
  },
  {
    id: 'daniel',
    name: 'דניאל',
    relation: 'הנכד',
    emoji: '👨‍🦱',
    photo: null,
    voice: 'זה דניאל, הנכד שלך',
    wrong: ['יוסי', 'עמוס'],
  },
  {
    id: 'noa',
    name: 'נועה',
    relation: 'הנכדה הקטנה',
    emoji: '👧',
    photo: null,
    voice: 'זו נועה, הנכדה הקטנה שלך',
    wrong: ['תמר', 'דינה'],
  },
  {
    id: 'yossi',
    name: 'יוסי',
    relation: 'הבן',
    emoji: '👨',
    photo: null,
    voice: 'זה יוסי, הבן שלך',
    wrong: ['משה', 'דוד'],
  },
]

/*
  ===================================================
  שאלות לתרגול יומי — ערכו לפי הרוטינה של אמא
  ===================================================
*/

const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const todayName = DAYS[new Date().getDay()]

export const DAILY_QUESTIONS = [
  {
    id: 'day',
    question: 'איזה יום היום?',
    correct: todayName,
    choices: () => {
      const others = DAYS.filter(d => d !== todayName)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
      return [todayName, ...others].sort(() => Math.random() - 0.5)
    },
  },
  {
    id: 'morning',
    question: 'מה עושים אחרי ארוחת בוקר?',
    correct: 'טיול קצר',
    choices: () => ['טיול קצר', 'שינה ארוכה', 'שחייה'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'daughter',
    question: 'מה שמה של הבת?',
    correct: 'שרה',
    choices: () => ['שרה', 'רחל', 'מרים'].sort(() => Math.random() - 0.5),
  },
  {
    id: 'evening',
    question: 'מי מתקשר בערב?',
    correct: 'יוסי',
    choices: () => ['יוסי', 'שכן', 'רופא'].sort(() => Math.random() - 0.5),
  },
]

/*
  ===================================================
  תמונות לאלבום המשפחתי
  ===================================================
*/

export const PHOTO_ALBUM = [
  { emoji: '👨‍👩‍👧', caption: 'כל המשפחה', sub: 'יחד באהבה', photo: null },
  ...FAMILY.map(f => ({ emoji: f.emoji, caption: f.name, sub: f.relation, photo: f.photo })),
]

/*
  ===================================================
  אמוג'ים למשחק זיכרון (ניתן לשנות)
  ===================================================
*/
export const MEMORY_EMOJIS = ['🌸', '🌻', '🦋', '🐠', '🍎', '🌈', '🐶', '🦁']
