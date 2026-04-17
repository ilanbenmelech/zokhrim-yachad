import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { DataProvider } from './context/DataContext'

import HomeScreen             from './screens/HomeScreen'
import ActivitiesScreen       from './screens/ActivitiesScreen'
import MemoryGame             from './screens/MemoryGame'
import WhoIsItGame            from './screens/WhoIsItGame'
import DailyScreen            from './screens/DailyScreen'
import PhotosScreen           from './screens/PhotosScreen'
import SuccessScreen          from './screens/SuccessScreen'
import CaregiverLoginScreen   from './screens/CaregiverLoginScreen'
import CaregiverScreen        from './screens/CaregiverScreen'
import FamilyManagerScreen    from './screens/FamilyManagerScreen'
import QuestionsManagerScreen from './screens/QuestionsManagerScreen'
import SettingsScreen         from './screens/SettingsScreen'
import HelpScreen             from './screens/HelpScreen'
import GoodbyeScreen          from './screens/GoodbyeScreen'

// מסכי משחק — ממלאים את המסך בלי גלילה
const GAME_SCREENS = ['/memory', '/who-is-it', '/daily', '/success', '/goodbye']

function Layout({ children }) {
  const { pathname } = useLocation()
  const isGame = GAME_SCREENS.some(p => pathname.startsWith(p))

  return (
    <div
      className="min-h-screen bg-warm font-hebrew"
      dir="rtl"
      style={isGame ? {
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      } : {}}
    >
      <div
        className="max-w-lg mx-auto w-full"
        style={isGame ? {
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 16px',
        } : { padding: '24px 16px' }}
      >
        {children}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Layout><HomeScreen /></Layout>} />
        <Route path="/activities" element={<Layout><ActivitiesScreen /></Layout>} />
        <Route path="/memory" element={<Layout><MemoryGame /></Layout>} />
        <Route path="/who-is-it" element={<Layout><WhoIsItGame /></Layout>} />
        <Route path="/daily" element={<Layout><DailyScreen /></Layout>} />
        <Route path="/photos" element={<Layout><PhotosScreen /></Layout>} />
        <Route path="/success" element={<Layout><SuccessScreen /></Layout>} />
        <Route path="/caregiver-login" element={<Layout><CaregiverLoginScreen /></Layout>} />
        <Route path="/caregiver" element={<Layout><CaregiverScreen /></Layout>} />
        <Route path="/caregiver/family" element={<Layout><FamilyManagerScreen /></Layout>} />
        <Route path="/caregiver/questions" element={<Layout><QuestionsManagerScreen /></Layout>} />
        <Route path="/caregiver/settings" element={<Layout><SettingsScreen /></Layout>} />
        <Route path="/help" element={<Layout><HelpScreen /></Layout>} />
        <Route path="/goodbye" element={<Layout><GoodbyeScreen /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </DataProvider>
  )
}
