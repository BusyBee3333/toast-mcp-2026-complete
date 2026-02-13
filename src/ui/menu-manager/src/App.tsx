import React, { useState } from 'react';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Menu Manager</h1>
        <button style={styles.button}>Add Item</button>
      </header>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.input}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={styles.select}>
          <option value="all">All Categories</option>
          <option value="appetizers">Appetizers</option>
          <option value="entrees">Entrees</option>
          <option value="desserts">Desserts</option>
          <option value="beverages">Beverages</option>
        </select>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Classic Burger</h3>
          <p style={styles.price}>$12.99</p>
          <p style={styles.description}>Beef patty, lettuce, tomato, cheese</p>
          <div style={styles.cardActions}>
            <button style={styles.editButton}>Edit</button>
            <button style={styles.deleteButton}>Delete</button>
          </div>
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
  filters: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid #333', padding: '10px', borderRadius: '6px', flex: 1 },
  select: { backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid #333', padding: '10px', borderRadius: '6px', width: '200px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '16px' },
  cardTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '8px' },
  price: { fontSize: '20px', fontWeight: 'bold', color: '#22c55e', marginBottom: '8px' },
  description: { fontSize: '14px', color: '#9ca3af', marginBottom: '16px' },
  cardActions: { display: 'flex', gap: '10px' },
  editButton: { backgroundColor: '#1e40af', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
  deleteButton: { backgroundColor: '#991b1b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' },
};

export default App;
