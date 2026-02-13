// Shared UI components and utilities for Toast MCP apps

// Dark theme styles
const DARK_THEME = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: #0f0f0f;
    color: #e0e0e0;
    line-height: 1.6;
  }
  
  .app-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 20px;
  }
  
  header {
    background: #1a1a1a;
    border-bottom: 2px solid #2d2d2d;
    padding: 20px;
    margin-bottom: 30px;
    border-radius: 8px;
  }
  
  h1 {
    color: #00bfa5;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 10px;
  }
  
  h2 {
    color: #fff;
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
  
  h3 {
    color: #00bfa5;
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .subtitle {
    color: #888;
    font-size: 0.9rem;
  }
  
  .back-link {
    color: #00bfa5;
    text-decoration: none;
    display: inline-block;
    margin-bottom: 20px;
    font-size: 0.9rem;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  .card {
    background: #1a1a1a;
    border: 1px solid #2d2d2d;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
  }
  
  .grid {
    display: grid;
    gap: 20px;
    margin-top: 20px;
  }
  
  .grid-2 { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
  .grid-3 { grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }
  .grid-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  
  .stat-card {
    background: #232323;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid #2d2d2d;
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #00bfa5;
    margin-bottom: 5px;
  }
  
  .stat-label {
    color: #888;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th {
    background: #232323;
    color: #00bfa5;
    padding: 12px;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #2d2d2d;
  }
  
  td {
    padding: 12px;
    border-bottom: 1px solid #2d2d2d;
  }
  
  tr:hover {
    background: #1f1f1f;
  }
  
  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .badge-success { background: #1b5e20; color: #4caf50; }
  .badge-warning { background: #f57f17; color: #ffeb3b; }
  .badge-error { background: #b71c1c; color: #f44336; }
  .badge-info { background: #01579b; color: #03a9f4; }
  .badge-default { background: #2d2d2d; color: #00bfa5; }
  
  button {
    background: #00bfa5;
    color: #000;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  button:hover {
    background: #00e5c2;
    transform: translateY(-1px);
  }
  
  button:active {
    transform: translateY(0);
  }
  
  button.secondary {
    background: #2d2d2d;
    color: #00bfa5;
  }
  
  button.secondary:hover {
    background: #3d3d3d;
  }
  
  input, select {
    background: #232323;
    border: 1px solid #2d2d2d;
    color: #e0e0e0;
    padding: 10px;
    border-radius: 6px;
    font-size: 0.9rem;
    width: 100%;
  }
  
  input:focus, select:focus {
    outline: none;
    border-color: #00bfa5;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    color: #999;
    font-size: 0.85rem;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .loading {
    text-align: center;
    padding: 40px;
    color: #888;
  }
  
  .error {
    background: #b71c1c;
    color: #fff;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
  }
  
  .success {
    background: #1b5e20;
    color: #fff;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 20px;
  }
  
  .toolbar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  
  .search-box {
    flex: 1;
    min-width: 200px;
  }
`;

// Format currency
function formatCurrency(cents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

// Format date
function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Format business date (YYYYMMDD)
function formatBusinessDate(businessDate) {
  const str = businessDate.toString();
  const year = str.substring(0, 4);
  const month = str.substring(4, 6);
  const day = str.substring(6, 8);
  return `${month}/${day}/${year}`;
}

// Get today's business date
function getTodayBusinessDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return parseInt(`${year}${month}${day}`);
}

// Client-side state management
class AppState {
  constructor() {
    this.data = {};
    this.listeners = new Map();
  }
  
  set(key, value) {
    this.data[key] = value;
    this.notify(key, value);
  }
  
  get(key) {
    return this.data[key];
  }
  
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
  }
  
  notify(key, value) {
    if (this.listeners.has(key)) {
      this.listeners.get(key).forEach(cb => cb(value));
    }
  }
}

// Export for use in apps
if (typeof window !== 'undefined') {
  window.ToastUI = {
    DARK_THEME,
    formatCurrency,
    formatDate,
    formatBusinessDate,
    getTodayBusinessDate,
    AppState,
  };
}
