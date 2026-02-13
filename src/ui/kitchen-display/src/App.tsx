import React from 'react';

const App: React.FC = () => {
  const orders = [
    { id: 'ORD-001', table: '12', time: '5m', items: ['Burger', 'Fries', 'Coke'], status: 'preparing' },
    { id: 'ORD-002', table: '8', time: '2m', items: ['Salad', 'Water'], status: 'new' },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Kitchen Display System</h1>
        <div style={styles.stats}>
          <span style={styles.statBadge}>New: 3</span>
          <span style={styles.statBadge}>Preparing: 5</span>
          <span style={styles.statBadge}>Ready: 2</span>
        </div>
      </header>

      <div style={styles.ordersGrid}>
        {orders.map((order) => (
          <div key={order.id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <span style={styles.orderId}>{order.id}</span>
              <span style={styles.table}>Table {order.table}</span>
              <span style={styles.time}>{order.time}</span>
            </div>
            <div style={styles.items}>
              {order.items.map((item, idx) => (
                <div key={idx} style={styles.item}>• {item}</div>
              ))}
            </div>
            <div style={styles.orderActions}>
              <button style={styles.startButton}>Start</button>
              <button style={styles.doneButton}>Done</button>
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
  stats: { display: 'flex', gap: '12px' },
  statBadge: { padding: '8px 16px', backgroundColor: '#1e40af', borderRadius: '6px', fontSize: '14px', fontWeight: '600' },
  ordersGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' },
  orderCard: { backgroundColor: '#1a1a1a', border: '2px solid #dc2626', borderRadius: '8px', padding: '20px' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', fontWeight: '600' },
  orderId: { color: '#60a5fa' },
  table: { color: '#22c55e' },
  time: { color: '#f59e0b' },
  items: { marginBottom: '16px' },
  item: { padding: '8px 0', fontSize: '16px', borderBottom: '1px solid #333' },
  orderActions: { display: 'flex', gap: '10px' },
  startButton: { flex: 1, backgroundColor: '#f59e0b', color: '#000', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  doneButton: { flex: 1, backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
};

export default App;
