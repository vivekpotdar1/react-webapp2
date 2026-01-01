// App.jsx is the "traffic controller" of the frontend.
// It decides which page to show: Login or Dashboard.
import { useState } from 'react'

import DashboardPage from './pages/DashboardPage/DashboardPage'
import LoginPage from './pages/LoginPage/LoginPage'

const VALID_USERNAME = 'spadmin'
const VALID_PASSWORD = 'admin'

export default function App() {
  // isLoggedIn = our simple "key" that says if the user can see the dashboard.
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // errorMessage = shown on the Login page when credentials are wrong.
  const [errorMessage, setErrorMessage] = useState('')

  function handleLogin(username, password) {
    // Check the typed username/password against our static demo values.
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true)
      setErrorMessage('')
      return
    }

    setErrorMessage('Invalid username or password')
  }

  if (!isLoggedIn) {
    // Not logged in yet -> show the Login page.
    return <LoginPage onLogin={handleLogin} errorMessage={errorMessage} />
  }

  function handleLogout() {
    // Logout just flips us back to the Login page.
    setIsLoggedIn(false)
    setErrorMessage('')
  }

  // Logged in -> show the Dashboard page.
  return <DashboardPage onLogout={handleLogout} />
}
