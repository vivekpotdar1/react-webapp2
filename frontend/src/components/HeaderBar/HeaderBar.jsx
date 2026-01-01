// HeaderBar is the top bar of the dashboard.
// It shows the title, the search box, and a small profile menu (Logout).
import { useEffect, useRef, useState } from 'react'
import styles from './HeaderBar.module.css'
import SearchBar from '../SearchBar/SearchBar'

export default function HeaderBar({ onLogout, displayName, searchValue, onSearchValueChange, onSearchSubmit }) {
  // isMenuOpen controls whether the little dropdown menu is visible.
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // menuRef points to the profile area so we can detect clicks outside of it.
  const menuRef = useRef(null)

  useEffect(() => {
    // Close the menu when the user clicks anywhere outside the profile menu.
    function handleClickOutside(event) {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    // Close the menu when the user presses Escape.
    function handleKeyDown(event) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function toggleMenu() {
    // Toggle open/close.
    setIsMenuOpen((v) => !v)
  }

  function handleLogoutClick() {
    // Close menu first, then call the logout handler.
    setIsMenuOpen(false)
    onLogout?.()
  }

  return (
    <header className={styles.header}>
      <div>
        <div className={styles.kicker}>Identity Graph Explorer</div>
        <div className={styles.sub}>{displayName ? `Selected: ${displayName}` : 'Find identity'}</div>
      </div>

      <div className={styles.center}>
        <SearchBar
          placeholder="Search by Name or Display Name..."
          value={searchValue}
          onChange={(e) => onSearchValueChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearchSubmit?.()
          }}
        />
      </div>

      <div className={styles.right}>
        <div className={styles.profile} ref={menuRef}>
          <button
            className={styles.avatarButton}
            type="button"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen ? 'true' : 'false'}
            onClick={toggleMenu}
            title="Profile"
          >
            <span className={styles.avatarText} aria-hidden="true">SP</span>
          </button>

          {isMenuOpen ? (
            <div className={styles.menu} role="menu">
              <button className={styles.menuItem} type="button" role="menuitem" onClick={handleLogoutClick} disabled={!onLogout}>
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
