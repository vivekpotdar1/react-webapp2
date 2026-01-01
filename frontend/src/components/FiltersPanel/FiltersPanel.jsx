// FiltersPanel shows filter controls on the left.
// Time range buttons call back to DashboardPage so the timeline can re-fetch.
import styles from './FiltersPanel.module.css'

export default function FiltersPanel({ selectedRange, onRangeChange }) {
  function RangeButton({ value, label }) {
    // Highlight the currently selected range.
    const isActive = selectedRange === value
    return (
      <button
        className={styles.pill}
        data-active={isActive ? 'true' : 'false'}
        type="button"
        onClick={() => onRangeChange?.(value)}
      >
        {label}
      </button>
    )
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>Filters</div>
        <button className={styles.clear} type="button">Clear all</button>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Search logs</div>
        <input className={styles.input} placeholder="Search logs..." />
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Time range</div>
        <div className={styles.pills}>
          <RangeButton value="24h" label="24H" />
          <RangeButton value="7d" label="7D" />
          <RangeButton value="30d" label="30D" />
          <RangeButton value="1y" label="1 YEAR" />
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.label}>Severity</div>
        <div className={styles.legend}>
          <div className={styles.legendRow}><span className={styles.dotCritical} /> Critical</div>
          <div className={styles.legendRow}><span className={styles.dotHigh} /> High</div>
          <div className={styles.legendRow}><span className={styles.dotMedium} /> Medium</div>
          <div className={styles.legendRow}><span className={styles.dotSafe} /> Low / Safe</div>
        </div>
      </div>

      <div className={styles.note}>
        Timeline updates based on the selected time range.
      </div>
    </aside>
  )
}
