import React, { useState } from 'react';

const App: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const addDigit = (digit: string) => setAmount(amount + digit);
  const clear = () => setAmount('');

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Payment Terminal</h1>
      </header>

      <div style={styles.terminal}>
        <div style={styles.display}>
          <div style={styles.amountLabel}>Amount to Charge</div>
          <div style={styles.amount}>${amount || '0.00'}</div>
        </div>

        <div style={styles.paymentMethods}>
          <button style={paymentMethod === 'card' ? styles.methodActive : styles.method} onClick={() => setPaymentMethod('card')}>Card</button>
          <button style={paymentMethod === 'cash' ? styles.methodActive : styles.method} onClick={() => setPaymentMethod('cash')}>Cash</button>
          <button style={paymentMethod === 'other' ? styles.methodActive : styles.method} onClick={() => setPaymentMethod('other')}>Other</button>
        </div>

        <div style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C'].map((key) => (
            <button key={key} style={styles.key} onClick={() => key === 'C' ? clear() : addDigit(key)}>{key}</button>
          ))}
        </div>

        <button style={styles.chargeButton}>Process Payment</button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#e0e0e0', padding: '20px', fontFamily: 'system-ui', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  header: { marginBottom: '30px' },
  title: { fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#fff', textAlign: 'center' },
  terminal: { maxWidth: '400px', width: '100%' },
  display: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '30px', marginBottom: '20px', textAlign: 'center' },
  amountLabel: { fontSize: '14px', color: '#9ca3af', marginBottom: '8px' },
  amount: { fontSize: '48px', fontWeight: 'bold', color: '#22c55e' },
  paymentMethods: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' },
  method: { padding: '12px', backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' },
  methodActive: { padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: '1px solid #2563eb', borderRadius: '6px', cursor: 'pointer' },
  keypad: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' },
  key: { padding: '24px', fontSize: '24px', fontWeight: 'bold', backgroundColor: '#1a1a1a', color: '#e0e0e0', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' },
  chargeButton: { width: '100%', padding: '20px', fontSize: '18px', fontWeight: 'bold', backgroundColor: '#22c55e', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer' },
};

export default App;
