// IdentityCard shows the selected person's basic details.
// DashboardPage passes `identity`, plus loading/error flags.
import styles from './IdentityCard.module.css'

function Tag({ children }) {
  return <span className={styles.tag}>{children}</span>
}

export default function IdentityCard({ identity, loading, errorMessage }) {
  // Show a friendly message if something went wrong.
  if (errorMessage) {
    return (
      <section className={styles.card}>
        <div className={styles.meta}>
          <div className={styles.name}>No result</div>
          <div className={styles.row}>{errorMessage}</div>
        </div>
      </section>
    )
  }

  // Show a friendly loading state while we wait for the backend.
  if (loading) {
    return (
      <section className={styles.card}>
        <div className={styles.meta}>
          <div className={styles.name}>Loading...</div>
          <div className={styles.row}>Fetching user data from backend</div>
        </div>
      </section>
    )
  }

  // Before searching, there's no identity yet.
  if (!identity) {
    return (
      <section className={styles.card}>
        <div className={styles.meta}>
          <div className={styles.name}>Search for a user</div>
          <div className={styles.row}>Type a Name or Display Name in the search box.</div>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.card}>
      <div className={styles.left}>
        <div className={styles.photo} aria-hidden="true">JD</div>

        <div className={styles.meta}>
          <div className={styles.name}>{identity.displayName || identity.name}</div>
          <div className={styles.row}>
            <span className={styles.muted}>Name</span>
            <span>{identity.name}</span>
            {identity.email ? (
              <>
                <span className={styles.dot}>•</span>
                <span>{identity.email}</span>
              </>
            ) : null}
          </div>

          <div className={styles.tags}>
            {identity.tags?.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {/* Button is a placeholder (no export logic yet). */}
        <button className={styles.button} type="button">Export Report</button>
      </div>
    </section>
  )
}
