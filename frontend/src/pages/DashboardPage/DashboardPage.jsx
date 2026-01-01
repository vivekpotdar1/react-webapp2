// DashboardPage builds the whole screen using smaller components.
// It fetches real data from the FastAPI backend based on the search box.
import styles from './DashboardPage.module.css'

import { useEffect, useMemo, useRef, useState } from 'react'

import { fetchIdentityBundle } from '../../api/iamApi'

import Sidebar from '../../components/Sidebar/Sidebar'
import HeaderBar from '../../components/HeaderBar/HeaderBar'
import IdentityCard from '../../components/IdentityCard/IdentityCard'
import FiltersPanel from '../../components/FiltersPanel/FiltersPanel'
import ActivityTimeline from '../../components/ActivityTimeline/ActivityTimeline'
import AccessRequestDetailsPage from '../AccessRequestDetailsPage/AccessRequestDetailsPage'

function identityToCard(identity) {
  // Convert backend identity fields into a simple shape that IdentityCard can show.
  if (!identity) return null

  const tags = []
  if (identity.location) tags.push(identity.location)
  if (identity.manager_name) tags.push(`Manager: ${identity.manager_name}`)
  if (identity.escalation_manager) tags.push(`Escalation: ${identity.escalation_manager}`)

  return {
    displayName: identity.displayName || identity.name,
    name: identity.name,
    email: identity.email,
    tags,
  }
}

export default function DashboardPage({ onLogout }) {
  // searchValue = what is typed into the top search bar.
  const [searchValue, setSearchValue] = useState('')

  // selected = identity returned from the backend.
  const [selected, setSelected] = useState(null)

  // timeline = activity list returned from the backend.
  const [timeline, setTimeline] = useState([])

  // detailsItem = the timeline event the user clicked "More" on.
  // For now, AccessRequestDetailsPage shows static mock data.
  const [detailsItem, setDetailsItem] = useState(null)

  // status = used to show "Loading..." and friendly error messages.
  const [status, setStatus] = useState({ loading: false, error: '' })

  // selectedRange = the time filter (24h/7d/30d/1y).
  const [selectedRange, setSelectedRange] = useState('7d')

  // debounceRef helps us avoid calling the backend on every single keypress.
  // We wait a short time after typing stops.
  const debounceRef = useRef(null)

  // Track prior body overflow so we can restore it when closing the overlay.
  const bodyOverflowRef = useRef('')

  const cardIdentity = useMemo(() => identityToCard(selected), [selected])

  async function runSearch(query, rangeKey = selectedRange) {
    // Only search when we have a non-empty query.
    const q = (query ?? '').trim()
    if (!q) return

    setStatus({ loading: true, error: '' })
    try {
      // Ask the backend for identity + timeline.
      const data = await fetchIdentityBundle(q, rangeKey)
      setSelected(data.identity)
      setTimeline(data.timeline || [])
      setStatus({ loading: false, error: '' })
    } catch (e) {
      // If the backend can't find the user (or backend isn't running), show a friendly message.
      setSelected(null)
      setTimeline([])
      setStatus({ loading: false, error: 'No user found (or backend not running)' })
    }
  }

  function handleSearchValueChange(nextValue) {
    setSearchValue(nextValue)

    // Debounce = wait briefly so we don't spam the backend while typing.
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      runSearch(nextValue)
    }, 350)
  }

  function handleRangeChange(nextRange) {
    setSelectedRange(nextRange)

    // If a user is already selected (or a search term exists), re-fetch for the new range.
    const q = (searchValue || selected?.displayName || selected?.name || '').trim()
    if (q) runSearch(q, nextRange)
  }

  useEffect(() => {
    // Optional: load a default user on page load if you want.
    // Keeping it empty so the page starts clean.
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    if (!detailsItem) return

    bodyOverflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = bodyOverflowRef.current
    }
  }, [detailsItem])

  function handleTimelineMore(item) {
    setDetailsItem(item)
  }

  function handleCloseDetails() {
    setDetailsItem(null)
  }

  return (
    <div className={styles.shell}>
      <Sidebar />

      <main className={styles.main}>
        <HeaderBar
          onLogout={onLogout}
          displayName={selected?.displayName || selected?.name || ''}
          searchValue={searchValue}
          onSearchValueChange={handleSearchValueChange}
          onSearchSubmit={() => runSearch(searchValue)}
        />

        <section className={styles.content}>
          <IdentityCard identity={cardIdentity} loading={status.loading} errorMessage={status.error} />

          <div className={styles.twoCol}>
            <FiltersPanel selectedRange={selectedRange} onRangeChange={handleRangeChange} />
            <ActivityTimeline items={timeline} onItemMore={handleTimelineMore} />
          </div>
        </section>
      </main>

      {detailsItem ? <AccessRequestDetailsPage onClose={handleCloseDetails} /> : null}
    </div>
  )
}
