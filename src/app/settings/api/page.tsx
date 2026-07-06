'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Key, Copy, Check, Terminal, FileText } from 'lucide-react';

export default function ApiSettingsPage() {
  const [apiToken, setApiToken] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedToken = localStorage.getItem('clinic_api_token');
    if (savedToken) {
      setApiToken(savedToken);
    }
  }, []);

  const handleGenerateToken = () => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newToken = `denthub_live_${randomHex}`;
    localStorage.setItem('clinic_api_token', newToken);
    setApiToken(newToken);
  };

  const handleCopy = () => {
    if (!apiToken) return;
    navigator.clipboard.writeText(apiToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isMounted) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="fade-in">
      <header style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Link href="/settings" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={14} /> Kthehu te Cilësimet
        </Link>
        <h1>API & Integrimet</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lidhni faqen tuaj të internetit, formën e kontaktit ose aplikacione të treta direkt me CRM-në tuaj.</p>
      </header>

      {/* API Key Generation */}
      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <Key size={18} style={{ color: '#2563eb' }} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Çelësi juaj API</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Përdorni këtë çelës për të autentikuar kërkesat e jashtme drejt aplikacionit tuaj dentar.</p>

        {apiToken ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px', position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'var(--background-color)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 12px', fontFamily: 'monospace', fontSize: '0.88rem', color: 'var(--text-main)', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {apiToken}
            </div>
            <button 
              onClick={handleCopy}
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', fontSize: '0.85rem', backgroundColor: copied ? '#059669' : '#2563eb', borderColor: copied ? '#059669' : '#2563eb' }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'U Kopjua' : 'Kopjo'}
            </button>
            <button 
              onClick={handleGenerateToken}
              style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 16px', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--background-color)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Rigjenero Çelësin
            </button>
          </div>
        ) : (
          <div>
            <button 
              onClick={handleGenerateToken}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', backgroundColor: '#2563eb', borderColor: '#2563eb' }}
            >
              <Code size={16} /> Gjenero Çelës të Ri API
            </button>
          </div>
        )}
      </div>

      {/* API Documentation */}
      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <Terminal size={18} style={{ color: 'var(--text-muted)' }} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Dokumentacioni i Integrimit (API)</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Endpoint 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.72rem', padding: '4px 8px', borderRadius: '4px' }}>POST</span>
              <code style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>https://api.denthub.al/v1/patients</code>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>— Krijimi i një pacienti të ri</span>
            </div>
            
            <div style={{ backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '0.78rem', overflowX: 'auto', lineHeight: '1.5' }}>
              <span style={{ color: '#94a3b8' }}># Kërkesa curl</span><br />
              curl -X POST https://api.denthub.al/v1/patients \<br />
              &nbsp;&nbsp;-H <span style={{ color: '#38bdf8' }}>"Authorization: Bearer {apiToken || 'CEL_API_JUAJ'}"</span> \<br />
              &nbsp;&nbsp;-H <span style={{ color: '#38bdf8' }}>"Content-Type: application/json"</span> \<br />
              &nbsp;&nbsp;-d '<span style={{ color: '#a7f3d0' }}>{"{"} "firstName": "Arbër", "lastName": "Kelmendi", "phone": "+355694445555", "email": "arber@email.com" {"}"}</span>'
            </div>
          </div>

          {/* Endpoint 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.72rem', padding: '4px 8px', borderRadius: '4px' }}>POST</span>
              <code style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>https://api.denthub.al/v1/appointments</code>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>— Krijo takim direkt në Kalendar</span>
            </div>
            
            <div style={{ backgroundColor: '#1e293b', color: '#e2e8f0', borderRadius: '8px', padding: '14px', fontFamily: 'monospace', fontSize: '0.78rem', overflowX: 'auto', lineHeight: '1.5' }}>
              <span style={{ color: '#94a3b8' }}># Kërkesa curl</span><br />
              curl -X POST https://api.denthub.al/v1/appointments \<br />
              &nbsp;&nbsp;-H <span style={{ color: '#38bdf8' }}>"Authorization: Bearer {apiToken || 'CEL_API_JUAJ'}"</span> \<br />
              &nbsp;&nbsp;-H <span style={{ color: '#38bdf8' }}>"Content-Type: application/json"</span> \<br />
              &nbsp;&nbsp;-d '<span style={{ color: '#a7f3d0' }}>{"{"} "patientName": "Teuta Kelmendi", "treatment": "Konsultë", "date": "2026-07-15", "time": "11:30" {"}"}</span>'
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
