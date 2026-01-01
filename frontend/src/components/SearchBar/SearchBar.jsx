// SearchBar is the input box in the header.
// It is a "controlled" input: the parent gives it the value and handlers.
import styles from './SearchBar.module.css'

export default function SearchBar({ placeholder, value, onChange, onKeyDown }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon} aria-hidden="true">⌕</span>
      <input
        className={styles.input}
        placeholder={placeholder}
        // value comes from the parent (DashboardPage).
        value={value}
        // onChange tells the parent when the user types.
        onChange={onChange}
        // onKeyDown lets the parent react to Enter, etc.
        onKeyDown={onKeyDown}
      />
    </div>
  )
}
