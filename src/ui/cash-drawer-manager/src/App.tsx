import React from 'react';

const App: React.FC = () => {
  const entries = [
    { time: '10:30 AM', type: 'Paid In', amount: 200.00, reason: 'Opening float', employee: 'John D.' },
    { time: '11:45 AM', type: 'Paid Out', amount: -50.00, reason: 'Supplies', employee: 'Jane S.' },
    { time: '2:15 PM', type: 'Paid Out', amount: -25.00, reason: 'Refund', employee: 'John D.' },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Cash Drawer Manager</h1>
        <button style={styles.button}>Close Drawer</button>
      </header>

      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Opening Balance</div>
          <div style={styles.summaryValue}>$200.00</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Cash In</div>
          <div style={styles.summaryValue}>$1,245.50</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Cash Out</div>
          <div style={styles.summaryValue}>$75.00</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Expected Balance</div>
          <div style={styles.summaryValue}>$1,370.50</div>
        </div>
      </div>

      <div style={styles.actions}>
        <button style={styles.actionButton}>Paid In</button>
        <button style={styles.actionButton}>Paid Out</button>
        <button style={styles.actionButton}>No Sale</button>
      </div>

      <div style={styles.entriesSection}>
        <h2 style={styles.sectionTitle}>Cash Entries Today</h2>
        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <div>Time</div>
            <div>Type</div>
            <div>Amount</div>
            <div>Reason</div>
            <div>Employee</div>
          </div>
          {entries.map((entry, idx) => (
            <div key={idx} style={styles.tableRow}>
              <div>{entry.time}</div>
              <div><span style={{ ...styles.typeBadge, backgroundColor: entry.type === 'Paid In' ? '#166534' : '#991b1b' }}>{entry.type}</span></div>
              <div style={{ fontWeight: '600', color: entry.amount > 0 ? '#22c55e' : '#ef4444' }}>${Math.abs(entry.amount).toFixed(2)}</div>
              <div>{entry.reason}</div>
              <div>{entry.employee}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#e0e0e0', padding: '20px', fontFamily: 'system-ui' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#fff' },
  button: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  summaryCard: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', textAlign: 'center' },
  summaryLabel: { fontSize: '14px', color: '#9ca3af', marginBottom: '8px' },
  summaryValue: { fontSize: '28px', fontWeight: 'bold', color: '#22c55e' },
  actions: { display: 'flex', gap: '12px', marginBottom: '30px' },
  actionButton: { flex: 1, padding: '12px', backgroundColor: '#1e40af', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
  entriesSection: { },
  sectionTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '16px' },
  table: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 1.5fr', padding: '16px', fontWeight: '600', borderBottom: '1px solid #333', backgroundColor: '#1e1e1e' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr 1.5fr', padding: '16px', borderBottom: '1px solid #333', alignItems: 'center' },
  typeBadge: { display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' },
};

export default App;
