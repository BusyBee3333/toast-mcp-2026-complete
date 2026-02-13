import React, { useState } from 'react';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const customers = [
    { guid: 'cust-1', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', phone: '555-1234', orders: 12 },
    { guid: 'cust-2', firstName: 'Bob', lastName: 'Williams', email: 'bob@example.com', phone: '555-5678', orders: 8 },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Customer Directory</h1>
        <button style={styles.button}>Add Customer</button>
      </header>

      <div style={styles.search}>
        <input
          type="text"
          placeholder="Search customers by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.grid}>
        {customers.map((customer) => (
          <div key={customer.guid} style={styles.card}>
            <div style={styles.customerHeader}>
              <div style={styles.avatar}>{customer.firstName[0]}{customer.lastName[0]}</div>
              <div>
                <div style={styles.name}>{customer.firstName} {customer.lastName}</div>
                <div style={styles.email}>{customer.email}</div>
              </div>
            </div>
            <div style={styles.details}>
              <p><strong>Phone:</strong> {customer.phone}</p>
              <p><strong>Total Orders:</strong> {customer.orders}</p>
            </div>
            <div style={styles.cardActions}>
              <button style={styles.viewButton}>View History</button>
              <button style={styles.editButton}>Edit</button>
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
  search: { marginBottom: '20px' },
  input: { width: '100%', backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid #333', padding: '12px', borderRadius: '6px', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px' },
  customerHeader: { display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' },
  avatar: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' },
  name: { fontSize: '18px', fontWeight: '600', marginBottom: '4px' },
  email: { fontSize: '14px', color: '#9ca3af' },
  details: { marginBottom: '16px', fontSize: '14px', lineHeight: '1.8' },
  cardActions: { display: 'flex', gap: '10px' },
  viewButton: { flex: 1, backgroundColor: '#1e40af', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' },
  editButton: { flex: 1, backgroundColor: '#374151', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' },
};

export default App;
