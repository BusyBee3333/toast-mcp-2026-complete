import React from 'react';

const App: React.FC = () => {
  const centers = [
    { name: 'Bar', sales: 8420.50, orders: 94, avgCheck: 89.58 },
    { name: 'Main Dining', sales: 15678.25, orders: 156, avgCheck: 100.50 },
    { name: 'Patio', sales: 5234.00, orders: 68, avgCheck: 76.97 },
    { name: 'Takeout', sales: 3890.75, orders: 52, avgCheck: 74.82 },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Revenue Centers</h1>
        <select style={styles.select}>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </header>

      <div style={styles.totalCard}>
        <div style={styles.totalLabel}>Total Revenue</div>
        <div style={styles.totalValue}>$33,223.50</div>
        <div style={styles.totalOrders}>370 orders</div>
      </div>

      <div style={styles.grid}>
        {centers.map((center) => (
          <div key={center.name} style={styles.card}>
            <h3 style={styles.cardTitle}>{center.name}</h3>
            <div style={styles.metric}>
              <span style={styles.metricLabel}>Sales:</span>
              <span style={styles.metricValue}>${center.sales.toFixed(2)}</span>
            </div>
            <div style={styles.metric}>
              <span style={styles.metricLabel}>Orders:</span>
              <span style={styles.metricValue}>{center.orders}</span>
            </div>
            <div style={styles.metric}>
              <span style={styles.metricLabel}>Avg Check:</span>
              <span style={styles.metricValue}>${center.avgCheck.toFixed(2)}</span>
            </div>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${(center.sales / 16000) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#e0e0e0', padding: '20px', fontFamily: 'system-ui' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#fff' },
  select: { backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid #333', padding: '10px', borderRadius: '6px' },
  totalCard: { backgroundColor: '#1e40af', borderRadius: '8px', padding: '30px', textAlign: 'center', marginBottom: '30px' },
  totalLabel: { fontSize: '16px', marginBottom: '8px' },
  totalValue: { fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' },
  totalOrders: { fontSize: '14px', opacity: 0.8 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px' },
  cardTitle: { fontSize: '20px', fontWeight: '600', marginBottom: '16px', color: '#60a5fa' },
  metric: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' },
  metricLabel: { color: '#9ca3af' },
  metricValue: { fontWeight: '600' },
  progressBar: { height: '8px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden', marginTop: '16px' },
  progressFill: { height: '100%', backgroundColor: '#22c55e', transition: 'width 0.3s' },
};

export default App;
