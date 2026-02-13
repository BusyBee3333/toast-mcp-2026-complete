import React from 'react';

const App: React.FC = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Labor Scheduler</h1>
        <div style={styles.headerActions}>
          <button style={styles.button}>Previous Week</button>
          <span style={styles.weekLabel}>Week of Jan 1, 2026</span>
          <button style={styles.button}>Next Week</button>
        </div>
      </header>

      <div style={styles.scheduleGrid}>
        <div style={styles.timeColumn}>
          <div style={styles.timeHeader}>Time</div>
          {hours.map((hour) => (
            <div key={hour} style={styles.timeSlot}>{hour}:00</div>
          ))}
        </div>
        {days.map((day) => (
          <div key={day} style={styles.dayColumn}>
            <div style={styles.dayHeader}>{day}</div>
            {hours.map((hour) => (
              <div key={hour} style={styles.scheduleSlot}>
                {hour >= 10 && hour < 22 && <div style={styles.shift}>John D.</div>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#e0e0e0', padding: '20px', fontFamily: 'system-ui' },
  header: { marginBottom: '20px' },
  title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' },
  headerActions: { display: 'flex', gap: '12px', alignItems: 'center' },
  button: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  weekLabel: { fontWeight: '600', fontSize: '16px' },
  scheduleGrid: { display: 'flex', gap: '1px', backgroundColor: '#333', border: '1px solid #333', borderRadius: '8px', overflow: 'auto' },
  timeColumn: { display: 'flex', flexDirection: 'column' },
  timeHeader: { padding: '12px', backgroundColor: '#1e1e1e', fontWeight: '600', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  timeSlot: { padding: '8px 12px', backgroundColor: '#1a1a1a', minHeight: '40px', display: 'flex', alignItems: 'center', fontSize: '12px' },
  dayColumn: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: '120px' },
  dayHeader: { padding: '12px', backgroundColor: '#1e1e1e', fontWeight: '600', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  scheduleSlot: { padding: '4px', backgroundColor: '#1a1a1a', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  shift: { backgroundColor: '#2563eb', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', width: '100%', textAlign: 'center' },
};

export default App;
