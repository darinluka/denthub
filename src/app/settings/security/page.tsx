'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Smartphone, Key, AlertTriangle } from 'lucide-react';

export default function SecuritySettings() {
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPass(true);
    setTimeout(() => {
      setLoadingPass(false);
      setPasswordSuccess(true);
      setTimeout(() => {
        setIsPasswordFormOpen(false);
        setPasswordSuccess(false);
      }, 3000);
    }, 1500);
  };

  useEffect(() => {
    const saved = localStorage.getItem('2fa_enabled_lukadarin178@gmail.com');
    if (saved === 'true') setIs2faEnabled(true);
  }, []);

  const handleToggle2fa = () => {
    const newState = !is2faEnabled;
    setIs2faEnabled(newState);
    localStorage.setItem('2fa_enabled_lukadarin178@gmail.com', String(newState));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="fade-in">
      <Link href="/settings" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: 500, textDecoration: 'none', width: 'fit-content' }}>
        <ArrowLeft size={16} /> Kthehu te Cilësimet
      </Link>

      <header>
        <h1>Siguria dhe Privatësia</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Menaxho mbrojtjen e llogarive të stafit dhe të dhënat e pacientëve</p>
      </header>

      <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#7c3aed15', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>Autentikimi me 2 Hapa (Google Authenticator)</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mbro llogarinë tënde duke përdorur një aplikacion autentikimi si Google Authenticator. Një kod i ri gjenerohet çdo 30 sekonda.</p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                <input type="checkbox" checked={is2faEnabled} onChange={handleToggle2fa} style={{ opacity: 0, width: 0, height: 0 }} />
                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: is2faEnabled ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}>
                  <span style={{ position: 'absolute', content: '""', height: '20px', width: '20px', left: is2faEnabled ? '26px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                </span>
              </label>
            </div>

            {is2faEnabled && (
              <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/Denthub.al:admin@klinika.al?secret=JBSWY3DPEHPK3PXP&issuer=Denthub.al" alt="QR Code" width="120" height="120" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Smartphone size={18} color="#0ea5e9" /> Konfiguro Google Authenticator
                  </h4>
                  <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <li>Shkarko aplikacionin <strong>Google Authenticator</strong> nga App Store ose Google Play.</li>
                    <li>Shtyp butonin <strong>+</strong> në aplikacion dhe zgjidh "Scan a QR code".</li>
                    <li>Skano kodin QR që sheh në të majtë për ta lidhur me llogarinë.</li>
                  </ol>
                  <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#e0f2fe', borderRadius: '6px', fontSize: '0.8rem', color: '#0369a1', fontFamily: 'monospace' }}>
                    Ose përdor këtë çelës manualisht: <strong>JBSWY3DPEHPK3PXP</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Key size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: 'var(--text-main)' }}>Ndrysho Fjalëkalimin</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Përditësoni fjalëkalimin tuaj aktual të llogarisë.</p>
            {!isPasswordFormOpen ? (
              <button 
                onClick={() => setIsPasswordFormOpen(true)}
                className="btn-secondary" 
                style={{ display: 'inline-flex', padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
              >
                Ndrysho Fjalëkalimin
              </button>
            ) : (
              <div style={{ marginTop: '16px', padding: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                {passwordSuccess ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#16a34a', fontWeight: 500 }}>
                    <Shield size={20} /> Fjalëkalimi u ndryshua me sukses!
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Fjalëkalimi Aktual</label>
                      <input type="password" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Fjalëkalimi i Ri</label>
                      <input type="password" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Konfirmo Fjalëkalimin e Ri</label>
                      <input type="password" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                      <button type="submit" className="btn-primary" disabled={loadingPass} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: '#0ea5e9', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        {loadingPass ? 'Po ruhet...' : 'Ruaj Ndryshimet'}
                      </button>
                      <button type="button" onClick={() => setIsPasswordFormOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 600 }}>
                        Anulo
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
