import React from 'react';

const App: React.FC = () => {
  const discounts = [
    { name: 'Happy Hour 20%', usage: 24, amount: 456.00, employee: 'Multiple' },
    { name: 'Employee Meal', usage: 8, amount: 120.00, employee: 'Various' },
    { name: 'Manager Comp', usage: 3, amount: 210.00, employee: 'Jane S.' },
    { name: 'Senior Discount', usage: 12, amount: 96.00, employee: 'Multiple' },
    { name: 'Loyalty 10%', usage: 18, amount: 234.00, employee: 'System' },
  ];

  const totalAmount = discounts.reduce((sum, d) => sum + d.amount, 0);
  const totalUsage = discounts.reduce((sum, d) => sum + d.usage, 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Discount Tracker</h1>
        <select style={styles.select}>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </header>

      <div style={styles.summary}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Discounts</div>
          <div style={styles.summaryValue}>${totalAmount.toFixed(2)}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Total Usage</div>
          <div style={styles.summaryValue}>{totalUsage}</div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryLabel}>Avg Discount</div>
          <div style={styles.summaryValue}>${(totalAmount / totalUsage).toFixed(2)}</div>
        </div>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHeader}>
          <div>Discount Name</div>
          <div>Usage Count</div>
          <div>Total Amount</div>
          <div>Applied By</div>
          <div>Actions</div>
        </div>
        {discounts.map((discount, idx) => (
          <div key={idx} style={styles.tableRow}>
            <div style={styles.discountName}>{discount.name}</div>
            <div><span style={styles.badge}>{discount.usage}</span></div>
            <div style={styles.amount}>${discount.amount.toFixed(2)}</div>
            <div>{discount.employee}</div>
            <div>
              <button style={styles.detailsButton}>View Details</button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.chartSection}>
        <h2 style={styles.chartTitle}>Discount Distribution</h2>
        <div style={styles.chartBars}>
          {discounts.map((discount, idx) => (
            <div key={idx} style={styles.chartBar}>
              <div style={styles.chartBarLabel}>{discount.name}</div>
              <div style={styles.chartBarWrapper}>
                <div style={{ ...styles.chartBarFill, width: `${(discount.amount / totalAmount) * 100}%` }}>
                  ${discount.amount.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
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
  summary: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' },
  summaryCard: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px', textAlign: 'center' },
  summaryLabel: { fontSize: '14px', color: '#9ca3af', marginBottom: '8px' },
  summaryValue: { fontSize: '28px', fontWeight: 'bold', color: '#ef4444' },
  table: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden', marginBottom: '30px' },
  tableHeader: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr', padding: '16px', fontWeight: '600', borderBottom: '1px solid #333', backgroundColor: '#1e1e1e' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr 1fr', padding: '16px', borderBottom: '1px solid #333', alignItems: 'center' },
  discountName: { fontWeight: '600' },
  badge: { display: 'inline-block', padding: '4px 12px', backgroundColor: '#1e40af', borderRadius: '12px', fontSize: '12px' },
  amount: { fontWeight: '600', color: '#ef4444' },
  detailsButton: { backgroundColor: '#374151', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  chartSection: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '20px' },
  chartTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
  chartBars: { display: 'flex', flexDirection: 'column', gap: '12px' },
  chartBar: {},
  chartBarLabel: { fontSize: '14px', marginBottom: '4px', fontWeight: '500' },
  chartBarWrapper: { backgroundColor: '#0a0a0a', borderRadius: '4px', overflow: 'hidden', height: '32px' },
  chartBarFill: { backgroundColor: '#ef4444', height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '12px', fontSize: '12px', fontWeight: '600', transition: 'width 0.3s' },
};

export default App;
