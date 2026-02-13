import React, { useState, useEffect } from 'react';

interface Order {
  guid: string;
  openedDate: string;
  source: string;
  numberOfGuests?: number;
  totalAmount?: number;
  paymentStatus?: string;
}

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // MCP tool call would go here
      // For demo, using placeholder data
      const mockOrders: Order[] = [
        {
          guid: 'order-001',
          openedDate: new Date().toISOString(),
          source: 'Online',
          numberOfGuests: 2,
          totalAmount: 45.99,
          paymentStatus: 'PAID',
        },
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Toast Orders Dashboard</h1>
        <button style={styles.button} onClick={fetchOrders} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div style={styles.filters}>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={styles.input}
          placeholder="Filter by date"
        />
      </div>

      <div style={styles.ordersGrid}>
        {orders.map((order) => (
          <div key={order.guid} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <span style={styles.orderSource}>{order.source}</span>
              <span style={styles.orderStatus}>{order.paymentStatus}</span>
            </div>
            <div style={styles.orderBody}>
              <p><strong>Order ID:</strong> {order.guid}</p>
              <p><strong>Time:</strong> {new Date(order.openedDate).toLocaleString()}</p>
              <p><strong>Guests:</strong> {order.numberOfGuests || 'N/A'}</p>
              <p><strong>Total:</strong> ${order.totalAmount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#e0e0e0',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  filters: {
    marginBottom: '20px',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#e0e0e0',
    border: '1px solid #333',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    width: '200px',
  },
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  orderCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '16px',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #333',
  },
  orderSource: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#60a5fa',
  },
  orderStatus: {
    fontSize: '12px',
    padding: '4px 8px',
    backgroundColor: '#166534',
    color: '#86efac',
    borderRadius: '4px',
  },
  orderBody: {
    fontSize: '14px',
    lineHeight: '1.6',
  },
};

export default App;
