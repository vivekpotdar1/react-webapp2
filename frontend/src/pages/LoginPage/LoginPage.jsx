// LoginPage shows a simple login form (username + password).
// It does NOT decide if login is correct.
// Instead it sends the typed values back to App.jsx using onLogin(...).
import { useState } from 'react'
import styles from './LoginPage.module.css'

export default function LoginPage({ onLogin, errorMessage }) {
  // Local state: what the user typed into the two input boxes.
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    // Prevent the browser from reloading the page.
    event.preventDefault()

    // Ask App.jsx to validate the credentials.
    onLogin(username, password)
  }

  return (
    <div className={styles.screen}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.title}>Sign in</div>
        <div className={styles.subtitle}>Use your admin credentials</div>

        <label className={styles.label}>
          Username
          <input
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="username"
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
          />
        </label>

        {errorMessage ? <div className={styles.error}>{errorMessage}</div> : null}

        <button className={styles.button} type="submit">
          Login
        </button>

        <div className={styles.hint}>
          Demo credentials: <span className={styles.mono}>spadmin</span> /{' '}
          <span className={styles.mono}>admin</span>
        </div>
      </form>
    </div>
  )
}
