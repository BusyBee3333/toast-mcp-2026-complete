import React from 'react';

const App: React.FC = () => {
  const items = [
    { name: 'Burger Patties', quantity: 45, unit: 'lbs', status: 'in-stock', reorderAt: 20 },
    { name: 'Lettuce', quantity: 8, unit: 'heads', status: 'low', reorderAt: 10 },
    { name: 'Tomatoes', quantity: 2, unit: 'lbs', status: 'critical', reorderAt: 5 },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Inventory Manager</h1>
        <button style={styles.button}>Add Item</button>
      </header>

      <div style={styles.filters}>
        <button style={styles.filterBtn}>All Items</button>
        <button style={styles.filterBtn}>Low Stock</button>
        <button style={styles.filterBtn}>Out of Stock</button>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div>Item Name</div>
          <div>Quantity</div>
          <div>Unit</div>
          <div>Reorder At</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {items.map((item, idx) => (
          <div key={idx} style={styles.tableRow}>
            <div>{item.name}</div>
            <div style={{ fontWeight: '600' }}>{item.quantity}</div>
            <div>{item.unit}</div>
            <div>{item.reorderAt}</div>
            <div>
              <span style={{
                ...styles.badge,
                backgroundColor: item.status === 'in-stock' ? '#166534' : item.status === 'low' ? '#854d0e' : '#991b1b',
              }}>
                {item.status}
              </span>
            </div>
            <div style={styles.actions}>
              <button style={styles.actionButton}>Update</button>
              <button style={styles.actionButton}>Reorder</button>
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
  button: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' },
  filters: { display: 'flex', gap: '10px', marginBottom: '20px' },
  filterBtn: { padding: '8px 16px', backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' },
  table: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', padding: '16px', fontWeight: '600', borderBottom: '1px solid #333', backgroundColor: '#1e1e1e' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.5fr', padding: '16px', borderBottom: '1px solid #333', alignItems: 'center' },
  badge: { display: 'inline-block', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', textTransform: 'capitalize' },
  actions: { display: 'flex', gap: '8px' },
  actionButton: { backgroundColor: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};

export default App;
