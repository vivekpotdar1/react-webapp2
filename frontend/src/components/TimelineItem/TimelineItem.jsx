// TimelineItem shows one activity row (title, severity, time, description).
// The look changes a bit based on `item.severity`.
import styles from './TimelineItem.module.css'

function severityLabel(severity) {
  // Convert internal severity keywords into short labels.
  if (severity === 'critical') return 'CRITICAL'
  if (severity === 'high') return 'HIGH'
  if (severity === 'medium') return 'MEDIUM'
  return 'SAFE'
}

export default function TimelineItem({ item, onMore }) {
  return (
    <div className={styles.item} data-severity={item.severity}>
      {/* The dot color is controlled by CSS using data-severity. */}
      <div className={styles.marker} aria-hidden="true" />

      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.badge}>{severityLabel(item.severity)}</div>
          <div className={styles.time}>{item.time}</div>
        </div>

        <div className={styles.desc}>{item.description}</div>
        <div className={styles.meta}>{item.meta}</div>
      </div>

      <button className={styles.more} type="button" onClick={() => onMore?.(item)}>
        More
      </button>
    </div>
  )
}
