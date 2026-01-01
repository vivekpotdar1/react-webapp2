// ActivityTimeline shows a list of activity events.
// It maps each event to a TimelineItem.
import styles from './ActivityTimeline.module.css'
import TimelineItem from '../TimelineItem/TimelineItem'

export default function ActivityTimeline({ items, onItemMore }) {
  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>Activity Timeline</div>
          <div className={styles.sub}>Today</div>
        </div>
        <div className={styles.count}>Showing {items.length} events</div>
      </div>

      <div className={styles.list}>
        {/* Turn each plain object into a TimelineItem row. */}
        {items.map((item) => (
          <TimelineItem key={item.id} item={item} onMore={onItemMore} />
        ))}
      </div>
    </section>
  )
}
