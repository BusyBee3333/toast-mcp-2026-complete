import React, { useState } from 'react';

const App: React.FC = () => {
  const [employees] = useState([
    { guid: 'emp-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '555-0100', job: 'Server' },
    { guid: 'emp-2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '555-0101', job: 'Manager' },
  ]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Employee Roster</h1>
        <button style={styles.button}>Add Employee</button>
      </header>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div>Name</div>
          <div>Email</div>
          <div>Phone</div>
          <div>Position</div>
          <div>Actions</div>
        </div>
        {employees.map((emp) => (
          <div key={emp.guid} style={styles.tableRow}>
            <div>{emp.firstName} {emp.lastName}</div>
            <div>{emp.email}</div>
            <div>{emp.phone}</div>
            <div><span style={styles.badge}>{emp.job}</span></div>
            <div style={styles.actions}>
              <button style={styles.actionButton}>Edit</button>
              <button style={styles.actionButton}>Delete</button>
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
  table: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1.5fr', padding: '16px', fontWeight: '600', borderBottom: '1px solid #333', backgroundColor: '#1e1e1e' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr 1.5fr', padding: '16px', borderBottom: '1px solid #333', alignItems: 'center' },
  badge: { display: 'inline-block', padding: '4px 12px', backgroundColor: '#1e40af', borderRadius: '12px', fontSize: '12px' },
  actions: { display: 'flex', gap: '8px' },
  actionButton: { backgroundColor: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};

export default App;
