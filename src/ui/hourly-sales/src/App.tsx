import React from 'react';

const App: React.FC = () => {
  const hours = [
    { hour: '11 AM', sales: 456, orders: 8 },
    { hour: '12 PM', sales: 1234, orders: 18 },
    { hour: '1 PM', sales: 1456, orders: 21 },
    { hour: '2 PM', sales: 892, orders: 14 },
    { hour: '3 PM', sales: 234, orders: 5 },
    { hour: '4 PM', sales: 178, orders: 3 },
    { hour: '5 PM', sales: 567, orders: 9 },
    { hour: '6 PM', sales: 2134, orders: 28 },
    { hour: '7 PM', sales: 2456, orders: 32 },
    { hour: '8 PM', sales: 1890, orders: 24 },
    { hour: '9 PM', sales: 1234, orders: 18 },
    { hour: '10 PM', sales: 678, orders: 10 },
  ];

  const maxSales = Math.max(...hours.map(h => h.sales));

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Hourly Sales</h1>
        <select style={styles.select}>
          <option>Today</option>
          <option>Yesterday</option>
          <option>Last Week</option>
        </select>
      </header>

      <div style={styles.chart}>
        {hours.map((hour) => (
          <div key={hour.hour} style={styles.barContainer}>
            <div style={styles.barLabel}>{hour.hour}</div>
            <div style={styles.barWrapper}>
              <div style={{ ...styles.bar, height: `${(hour.sales / maxSales) * 200}px` }}>
                <span style={styles.barValue}>${hour.sales}</span>
              </div>
            </div>
            <div style={styles.orderCount}>{hour.orders} orders</div>
          </div>
        ))}
      </div>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Peak Hour</div>
          <div style={styles.statValue}>7 PM</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Peak Sales</div>
          <div style={styles.statValue}>$2,456</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Sales</div>
          <div style={styles.statValue}>$13,409</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Avg/Hour</div>
          <div style={styles.statValue}>$1,117</div>
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
  chart: { display: 'flex', gap: '8px', marginBottom: '30px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333', justifyContent: 'space-around' },
  barContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 },
  barLabel: { fontSize: '12px', marginBottom: '8px', fontWeight: '600' },
  barWrapper: { height: '220px', display: 'flex', alignItems: 'flex-end' },
  bar: { backgroundColor: '#2563eb', width: '100%', borderRadius: '4px 4px 0 0', minHeight: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '8px', transition: 'height 0.3s' },
  barValue: { fontSize: '11px', fontWeight: '600' },
  orderCount: { fontSize: '11px', color: '#9ca3af', marginTop: '8px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' },
  statCard: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', textAlign: 'center' },
  statLabel: { fontSize: '14px', color: '#9ca3af', marginBottom: '8px' },
  statValue: { fontSize: '28px', fontWeight: 'bold', color: '#22c55e' },
};

export default App;
