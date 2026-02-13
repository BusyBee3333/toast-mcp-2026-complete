import React from 'react';

const App: React.FC = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Sales Analytics</h1>
        <select style={styles.select}>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </header>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Sales</div>
          <div style={styles.statValue}>$12,456</div>
          <div style={styles.statChange}>+12.5% from yesterday</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Orders</div>
          <div style={styles.statValue}>156</div>
          <div style={styles.statChange}>+8.2% from yesterday</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Avg Order Value</div>
          <div style={styles.statValue}>$79.85</div>
          <div style={styles.statChange}>+3.1% from yesterday</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Guests</div>
          <div style={styles.statValue}>312</div>
          <div style={styles.statChange}>+15.4% from yesterday</div>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Sales by Hour</h3>
          <div style={styles.chartPlaceholder}>[Bar Chart Placeholder]</div>
        </div>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Sales by Dining Option</h3>
          <div style={styles.chartPlaceholder}>[Pie Chart Placeholder]</div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#e0e0e0', padding: '20px', fontFamily: 'system-ui' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#fff' },
  select: { backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid #333', padding: '10px', borderRadius: '6px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' },
  statCard: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px' },
  statLabel: { fontSize: '14px', color: '#9ca3af', marginBottom: '8px' },
  statValue: { fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' },
  statChange: { fontSize: '14px', color: '#22c55e' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' },
  chartCard: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px' },
  chartTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
  chartPlaceholder: { height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: '4px', color: '#666' },
};

export default App;
