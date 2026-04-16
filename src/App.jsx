import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './context/DataContext'

import HomeScreen            from './screens/HomeScreen'
import ActivitiesScreen      from './screens/ActivitiesScreen'
import MemoryGame            from './screens/MemoryGame'
import WhoIsItGame           from './screens/WhoIsItGame'
import DailyScreen           from './screens/DailyScreen'
import PhotosScreen          from './screens/PhotosScreen'
import SuccessScreen         from './screens/SuccessScreen'
import CaregiverScreen       from './screens/CaregiverScreen'
import FamilyManagerScreen   from './screens/FamilyManagerScreen'
import QuestionsManagerScreen from './screens/QuestionsManagerScreen'
import SettingsScreen        from './screens/SettingsScreen'
import HelpScreen            from './screens/HelpScreen'

export default function App() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-warm font-hebrew" dir="rtl">
        <div className="max-w-lg mx-auto px-4 py-6">
          <Routes>
            <Route path="/"                    element={<HomeScreen />} />
            <Route path="/activities"          element={<ActivitiesScreen />} />
            <Route path="/memory"              element={<MemoryGame />} />
            <Route path="/who-is-it"           element={<WhoIsItGame />} />
            <Route path="/daily"               element={<DailyScreen />} />
            <Route path="/photos"              element={<PhotosScreen />} />
            <Route path="/success"             element={<SuccessScreen />} />
            <Route path="/caregiver"           element={<CaregiverScreen />} />
            <Route path="/caregiver/family"    element={<FamilyManagerScreen />} />
            <Route path="/caregiver/questions" element={<QuestionsManagerScreen />} />
            <Route path="/caregiver/settings"  element={<SettingsScreen />} />
            <Route path="/help"                element={<HelpScreen />} />
            <Route path="*"                    element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </DataProvider>
  )
}
