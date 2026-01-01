/**
 * AccessRequestDetailsPage.jsx
 *
 * A static (hard-coded) page that visually matches the "Access Request Details" design.
 * We are not wiring navigation yet; later we can decide where/how to open this page.
 */

import styles from './AccessRequestDetailsPage.module.css';

// For now, this is just mock content so we can build the UI.
const MOCK = {
  eventId: 'EVT-2023-9942-AWS',
  requestId: 'REQ-2023-8492',
  submissionTime: 'Oct 24, 2023, 14:30 PST',
  requesterName: 'Sarah Jenkins',
  requesterTeam: 'DevOps',
  resourceRequested: 'AWS Production Environment',
  justification:
    'Urgent access required to deploy hotfix for payment gateway latency issue (Ticket #INC-4029).',
  approvalWorkflow: [
    {
      title: 'Request Initiated',
      subtitle: 'Submitted by Sarah Jenkins via Portal',
      time: '14:30 PST',
      status: 'done',
    },
    {
      title: 'Primary Approval',
      subtitle: 'Approved by Michael Chen (Team Lead)',
      time: '14:45 PST',
      status: 'done',
    },
    {
      title: 'Secondary Approval',
      subtitle: 'Usually required by Security Ops',
      time: '14:45 PST',
      status: 'bypassed',
    },
  ],
  bypassReasonTitle: 'Bypass Reason: Emergency Hotfix',
  bypassReasonBody:
    'This approval step was automatically bypassed due to a critical incident.',
  lastUpdated: 'Last updated 2 mins ago',
};

function DetailRow({ label, value }) {
  return (
    <div className={styles.detailRow}>
      <div className={styles.detailLabel}>{label}</div>
      <div className={styles.detailValue}>{value}</div>
    </div>
  );
}

function WorkflowItem({ title, subtitle, time, status }) {
  return (
    <div className={styles.workflowItem} data-status={status}>
      <div className={styles.workflowLeft}>
        <div className={styles.workflowDot} aria-hidden="true" />
        <div className={styles.workflowText}>
          <div className={styles.workflowTitleRow}>
            <div className={styles.workflowTitle}>{title}</div>
            {status === 'bypassed' ? (
              <span className={styles.badgeBypassed}>BYPASSED</span>
            ) : null}
          </div>
          <div className={styles.workflowSubtitle}>{subtitle}</div>
        </div>
      </div>

      <div className={styles.workflowTime}>
        <span className={styles.timePill}>{time}</span>
      </div>
    </div>
  );
}

export default function AccessRequestDetailsPage({ onClose }) {
  return (
    <div className={styles.screen}>
      {/* This overlay makes the page feel like a focused "details" view. */}
      <div className={styles.overlay} />

      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Access Request Details">
        <div className={styles.topBar}>
          <div>
            <div className={styles.pageTitle}>Access Request Details</div>
            <div className={styles.pageSub}>
              <span className={styles.hash}>#</span> Event ID: {MOCK.eventId}
            </div>
          </div>

          <button
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={() => onClose?.()}
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          {/* Request Overview section */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>Request Overview</div>

            <div className={styles.card}>
              <div className={styles.grid2}>
                <DetailRow label="REQUEST ID" value={MOCK.requestId} />
                <DetailRow label="SUBMISSION TIME" value={MOCK.submissionTime} />
              </div>

              <div className={styles.grid2}>
                <div className={styles.detailRow}>
                  <div className={styles.detailLabel}>REQUESTER</div>
                  <div className={styles.requester}>
                    <div className={styles.avatar} aria-hidden="true">
                      SJ
                    </div>
                    <div>
                      <div className={styles.requesterName}>
                        {MOCK.requesterName}{' '}
                        <span className={styles.requesterTeam}>({MOCK.requesterTeam})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <DetailRow label="RESOURCE REQUESTED" value={MOCK.resourceRequested} />
              </div>

              <div className={styles.justification}>
                <div className={styles.detailLabel}>JUSTIFICATION</div>
                <div className={styles.justificationText}>{MOCK.justification}</div>
              </div>
            </div>
          </section>

          {/* Approval Workflow section */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>Approval Workflow</div>

            <div className={styles.card}>
              <div className={styles.workflow}>
                {MOCK.approvalWorkflow.map((step) => (
                  <WorkflowItem
                    key={step.title}
                    title={step.title}
                    subtitle={step.subtitle}
                    time={step.time}
                    status={step.status}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Bypass Reason section */}
          <section className={styles.section}>
            <div className={styles.bypassTitle}>{MOCK.bypassReasonTitle}</div>
            <div className={styles.card}>
              <div className={styles.bypassBody}>{MOCK.bypassReasonBody}</div>
            </div>
          </section>
        </div>

        {/* Bottom action bar */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <span className={styles.footerMuted}>{MOCK.lastUpdated}</span>
          </div>
          <div className={styles.footerRight}>
            <button type="button" className={styles.linkButton}>
              View Full Log
            </button>
            <button type="button" className={styles.primaryButton} onClick={() => onClose?.()}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
