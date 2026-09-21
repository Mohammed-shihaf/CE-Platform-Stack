import React, { useState } from 'react';
import OrderDashboard from './components/OrderDashboard';
import InvoiceViewer from './components/InvoiceViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'orders' | 'tax' | 'diagnostics'>('orders');

  return (
    <div style={{ padding: '32px', fontFamily: 'system-ui, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#0f172a' }}>CE-NEW-JSTS-001: Layered Enterprise Monolith</h1>
        <p style={{ margin: '8px 0 0 0', color: '#64748b' }}>Architecture: React 18 SPA + Express Domain Services & Repositories</p>
      </header>

      <nav style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => setActiveTab('orders')} style={{ padding: '8px 16px', cursor: 'pointer', background: activeTab === 'orders' ? '#0f172a' : '#e2e8f0', color: activeTab === 'orders' ? '#fff' : '#0f172a', border: 'none', borderRadius: '4px' }}>Orders & Pricing</button>
        <button onClick={() => setActiveTab('tax')} style={{ padding: '8px 16px', cursor: 'pointer', background: activeTab === 'tax' ? '#0f172a' : '#e2e8f0', color: activeTab === 'tax' ? '#fff' : '#0f172a', border: 'none', borderRadius: '4px' }}>Tax Settlement</button>
        <button onClick={() => setActiveTab('diagnostics')} style={{ padding: '8px 16px', cursor: 'pointer', background: activeTab === 'diagnostics' ? '#0f172a' : '#e2e8f0', color: activeTab === 'diagnostics' ? '#fff' : '#0f172a', border: 'none', borderRadius: '4px' }}>Diagnostics</button>
      </nav>

      {activeTab === 'orders' && (
        <section style={{ border: '1px solid #cbd5e1', padding: '20px', borderRadius: '8px' }}>
          <h3>Order Management & Rebates</h3>
          <p>Customer ID: <strong>{customer}</strong></p>
          <p>Tier: <strong>ENTERPRISE_PLATINUM (15% Multi-Year Discount Active)</strong></p>
        </section>
      )}

      {activeTab === 'tax' && (
        <section style={{ border: '1px solid #cbd5e1', padding: '20px', borderRadius: '8px' }}>
          <h3>Tax Calculation Engine (Dual Regional Pipeline)</h3>
          <p>Status: Ready for cross-regional invoice settlement</p>
        </section>
      )}

      {activeTab === 'diagnostics' && (
        <section style={{ border: '1px solid #cbd5e1', padding: '20px', borderRadius: '8px' }}>
          <h3>System Connectivity Diagnostics</h3>
          <p>Gateway Target: <code>127.0.0.1:3001</code></p>
        </section>
      )}
    </div>
  );
}
