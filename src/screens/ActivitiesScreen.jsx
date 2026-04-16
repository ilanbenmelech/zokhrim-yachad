import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar, BigButton, BackButton } from '../components/UI'

export default function ActivitiesScreen() {
  const nav = useNavigate()

  return (
    <div className="screen-enter flex flex-col items-center min-h-[85vh]">
      <TopBar title="פעילויות" />

      <h1 className="screen-title">בחרי משחק</h1>
      <p className="screen-sub">מה נרצה לשחק עכשיו?</p>

      <div className="flex flex-col items-center gap-4 w-full">
        <BigButton filled onClick={() => nav('/memory')}>
          <span className="text-[32px]">🃏</span>
          <span>משחק זיכרון</span>
        </BigButton>

        <BigButton onClick={() => nav('/who-is-it')}>
          <span className="text-[32px]">👨‍👩‍👧</span>
          <span>מי זה?</span>
        </BigButton>

        <BigButton onClick={() => nav('/daily')}>
          <span className="text-[32px]">☀️</span>
          <span>תרגול יומי</span>
        </BigButton>
      </div>

      <BackButton to="/" />
    </div>
  )
}
