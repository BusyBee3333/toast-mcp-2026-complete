import React from 'react';

const App: React.FC = () => {
  const tables = [
    { number: '1', capacity: 2, status: 'available' },
    { number: '2', capacity: 4, status: 'occupied', guest: 'Smith' },
    { number: '3', capacity: 4, status: 'occupied', guest: 'Johnson' },
    { number: '4', capacity: 6, status: 'reserved', guest: 'Williams' },
    { number: '5', capacity: 2, status: 'available' },
    { number: '6', capacity: 8, status: 'occupied', guest: 'Brown' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#166534';
      case 'occupied': return '#991b1b';
      case 'reserved': return '#854d0e';
      default: return '#374151';
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Table Manager</h1>
        <div style={styles.legend}>
          <span style={{ ...styles.legendItem, backgroundColor: '#166534' }}>Available</span>
          <span style={{ ...styles.legendItem, backgroundColor: '#991b1b' }}>Occupied</span>
          <span style={{ ...styles.legendItem, backgroundColor: '#854d0e' }}>Reserved</span>
        </div>
      </header>

      <div style={styles.tablesGrid}>
        {tables.map((table) => (
          <div key={table.number} style={{ ...styles.tableCard, borderColor: getStatusColor(table.status) }}>
            <div style={styles.tableNumber}>Table {table.number}</div>
            <div style={styles.capacity}>Capacity: {table.capacity}</div>
            <div style={{ ...styles.status, backgroundColor: getStatusColor(table.status) }}>
              {table.status.toUpperCase()}
            </div>
            {table.guest && <div style={styles.guest}>Guest: {table.guest}</div>}
            <button style={styles.viewButton}>View Details</button>
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
  legend: { display: 'flex', gap: '12px' },
  legendItem: { padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' },
  tablesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  tableCard: { backgroundColor: '#1a1a1a', border: '3px solid', borderRadius: '8px', padding: '20px', textAlign: 'center' },
  tableNumber: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' },
  capacity: { fontSize: '14px', color: '#9ca3af', marginBottom: '12px' },
  status: { padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', marginBottom: '8px', display: 'inline-block' },
  guest: { fontSize: '14px', marginBottom: '12px', fontStyle: 'italic' },
  viewButton: { width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};

export default App;
