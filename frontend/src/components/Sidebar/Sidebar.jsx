// Sidebar is the left menu.
// It shows navigation buttons (not wired up in this demo).
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { label: 'Identity Search' },
  { label: 'Access Reviews' },
  { label: 'Risk Dashboard' },
  { label: 'Policies' },
]

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>*</div>
        <div>
          <div className={styles.title}>IAM Portal</div>
          <div className={styles.subtitle}>Admin Console</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {/* These are just UI buttons for now (no routing logic). */}
        {NAV_ITEMS.map((item) => (
          <button key={item.label} className={styles.navItem} type="button">
            {item.label}
          </button>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.settings} type="button">
          Settings
        </button>
      </div>
    </aside>
  )
}
