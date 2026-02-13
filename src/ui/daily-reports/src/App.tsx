import React from 'react';

const App: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Daily Reports</h1>
        <div style={styles.dateSelector}>
          <button style={styles.navButton}>←</button>
          <span style={styles.date}>January 12, 2026</span>
          <button style={styles.navButton}>→</button>
        </div>
      </header>

      <div style={styles.sections}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Sales Summary</h2>
          <div style={styles.reportCard}>
            <div style={styles.reportRow}><span>Gross Sales:</span><span>$12,456.00</span></div>
            <div style={styles.reportRow}><span>Discounts:</span><span>-$345.00</span></div>
            <div style={styles.reportRow}><span>Refunds:</span><span>-$120.00</span></div>
            <div style={{ ...styles.reportRow, ...styles.totalRow }}><span>Net Sales:</span><span>$11,991.00</span></div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Order Stats</h2>
          <div style={styles.reportCard}>
            <div style={styles.reportRow}><span>Total Orders:</span><span>156</span></div>
            <div style={styles.reportRow}><span>Average Check:</span><span>$79.85</span></div>
            <div style={styles.reportRow}><span>Total Guests:</span><span>312</span></div>
            <div style={styles.reportRow}><span>Avg Party Size:</span><span>2.0</span></div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Labor Summary</h2>
          <div style={styles.reportCard}>
            <div style={styles.reportRow}><span>Total Hours:</span><span>86.5</span></div>
            <div style={styles.reportRow}><span>Labor Cost:</span><span>$1,298.50</span></div>
            <div style={styles.reportRow}><span>Labor %:</span><span>10.8%</span></div>
            <div style={styles.reportRow}><span>Employees Clocked In:</span><span>12</span></div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Payment Methods</h2>
          <div style={styles.reportCard}>
            <div style={styles.reportRow}><span>Credit Card:</span><span>$8,934.00 (74.5%)</span></div>
            <div style={styles.reportRow}><span>Cash:</span><span>$2,567.00 (21.4%)</span></div>
            <div style={styles.reportRow}><span>Gift Card:</span><span>$490.00 (4.1%)</span></div>
          </div>
        </div>
      </div>

      <button style={styles.exportButton}>Export PDF Report</button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#e0e0e0', padding: '20px', fontFamily: 'system-ui' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#fff' },
  dateSelector: { display: 'flex', alignItems: 'center', gap: '16px' },
  navButton: { backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid #333', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '18px' },
  date: { fontSize: '16px', fontWeight: '600' },
  sections: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' },
  section: {},
  sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '12px' },
  reportCard: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px' },
  reportRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333', fontSize: '14px' },
  totalRow: { fontWeight: 'bold', fontSize: '16px', color: '#22c55e', borderBottom: 'none', paddingTop: '16px' },
  exportButton: { width: '100%', padding: '16px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' },
};

export default App;
