# 🧠 זוכרים יחד — אפליקציית זיכרון למבוגרים

אפליקציית Web לתרגול זיכרון, מותאמת לאמא שלך ולמשפחה.  
כפתורים גדולים, עברית מלאה, קריינות קולית, בלי ציונים.

---

## 🚀 הקמה ראשונה (פעם אחת)

### שלב 1 — התקינו Node.js
הורידו מ־ https://nodejs.org (בחרו LTS)  
לאחר ההתקנה פתחו Terminal ובדקו:
```bash
node -v
```
צריך להופיע מספר גרסה.

---

### שלב 2 — התקינו את הפרויקט
```bash
cd zokhrim-yachad
npm install
```

---

### שלב 3 — הפעילו בדפדפן
```bash
npm run dev
```
פתחו את הדפדפן ב־ http://localhost:5173

---

## ✏️ התאמה אישית — החשוב ביותר!

כל ההתאמות לאמא שלך נמצאות בקובץ אחד:

```
src/data/family.js
```

פתחו אותו ועדכנו:

### הוספת בני משפחה
```js
export const FAMILY = [
  {
    id: 'sarah',
    name: 'שרה',          // שם לתצוגה
    relation: 'הבת',      // קרבה משפחתית
    emoji: '👩‍🦳',         // אמוג'י זמני
    photo: '/photos/sarah.jpg',  // תמונה אמיתית (ראו הוראות למטה)
    voice: 'זו שרה, הבת שלך',   // טקסט לקריינות
    wrong: ['רחל', 'מרים'],     // שמות שגויים למשחק
  },
  // הוסיפו עוד בני משפחה...
]
```

### הוספת תמונות
1. צרו תיקייה `public/photos/`
2. העתיקו לשם את קבצי התמונה (jpg/png)
3. עדכנו את השדה `photo` בקובץ family.js:
```js
photo: '/photos/sarah.jpg'
```

### שינוי השאלות היומיות
```js
export const DAILY_QUESTIONS = [
  {
    id: 'daughter',
    question: 'מה שמה של הבת?',
    correct: 'שרה',  // תשובה נכונה
    choices: () => ['שרה', 'רחל', 'מרים'].sort(() => Math.random() - 0.5),
  },
  // הוסיפו שאלות נוספות...
]
```

### שינוי רמת קושי במשחק זיכרון
בקובץ `src/screens/MemoryGame.jsx`, שורה 7:
```js
const PAIRS = 3  // קל (3 זוגות)
const PAIRS = 4  // רגיל (4 זוגות) — ברירת המחדל
```

---

## 🌐 פרסום באינטרנט (Vercel — חינמי)

כך כל אחד במשפחה יוכל לפתוח בטלפון/טאבלט בלי להתקין כלום.

### שלב 1 — צרו חשבון ב־Vercel
https://vercel.com (כניסה עם GitHub)

### שלב 2 — העלו את הקוד ל־GitHub
```bash
git init
git add .
git commit -m "first commit"
```
צרו repo חדש ב־ https://github.com/new ועקבו אחר ההוראות.

### שלב 3 — חברו ל־Vercel
1. ב־Vercel לחצו "Add New Project"
2. בחרו את ה־repo שיצרתם
3. לחצו Deploy

קבלתם כתובת! לדוגמה: `zokhrim-yachad.vercel.app`

### שלב 4 — קיצור דרך על הטאבלט
**iOS (iPad/iPhone):**  
Safari → לחצו על סמל השיתוף → "הוסף למסך הבית"

**Android:**  
Chrome → תפריט ⋮ → "הוסף למסך הבית"

האפליקציה תיראה ותתנהג כמו אפליקציה רגילה.

---

## 📁 מבנה הפרויקט

```
zokhrim-yachad/
├── public/
│   └── photos/          ← שימו כאן תמונות משפחה
├── src/
│   ├── data/
│   │   └── family.js    ← ✏️ ערכו כאן!
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── ActivitiesScreen.jsx
│   │   ├── MemoryGame.jsx
│   │   ├── WhoIsItGame.jsx
│   │   ├── DailyScreen.jsx
│   │   ├── PhotosScreen.jsx
│   │   ├── SuccessScreen.jsx
│   │   ├── CaregiverScreen.jsx
│   │   └── HelpScreen.jsx
│   ├── components/
│   │   └── UI.jsx       ← רכיבים משותפים
│   ├── App.jsx          ← ניתוב בין מסכים
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🛠️ פקודות שימושיות

```bash
npm run dev      # הפעלה מקומית לפיתוח
npm run build    # בנייה לפרסום
npm run preview  # תצוגה מקדימה של הגרסה הסופית
```

---

## 🆘 בעיות נפוצות

**הקריינות לא עובדת?**  
וודאו שהדפדפן הוא Chrome או Safari. Firefox תומך חלקית.

**הגופן לא נטען?**  
בדקו חיבור אינטרנט. הגופן Rubik נטען מ-Google Fonts.

**התמונה לא מופיעה?**  
וודאו שהקובץ נמצא ב-`public/photos/` ושהשם זהה בדיוק (כולל סיומת).

---

## 💙 נבנה באהבה עבור אמא
