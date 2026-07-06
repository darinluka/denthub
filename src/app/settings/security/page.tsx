'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Smartphone, Key } from 'lucide-react';
import styles from './security.module.css';

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

      <div className={styles.card}>
        
        <div className={`${styles.row} ${styles.row2fa}`}>
          <div className={styles.iconContainer}>
            <Shield size={24} />
          </div>
          <div className={styles.content}>
            <div className={styles.headerRow}>
              <div className={styles.titleContainer}>
                <h3 className={styles.title}>Autentikimi me 2 Hapa (Google Authenticator)</h3>
                <p className={styles.description}>Mbro llogarinë tënde duke përdorur një aplikacion autentikimi si Google Authenticator. Një kod i ri gjenerohet çdo 30 sekonda.</p>
              </div>
              <label className={styles.toggleLabel}>
                <input type="checkbox" checked={is2faEnabled} onChange={handleToggle2fa} className={styles.toggleInput} />
                <span className={styles.toggleSlider} style={{ backgroundColor: is2faEnabled ? '#10b981' : '#cbd5e1' }}>
                  <span className={styles.toggleKnob} style={{ left: is2faEnabled ? '26px' : '3px' }}></span>
                </span>
              </label>
            </div>

            {is2faEnabled && (
              <div className={styles.qrContainer}>
                <div className={styles.qrCodeBox}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/Denthub.al:admin@klinika.al?secret=JBSWY3DPEHPK3PXP&issuer=Denthub.al" alt="QR Code" width="120" height="120" />
                </div>
                <div className={styles.qrInfo}>
                  <h4 className={styles.qrTitle}>
                    <Smartphone size={18} color="#0ea5e9" /> Konfiguro Google Authenticator
                  </h4>
                  <ol className={styles.stepsList}>
                    <li>Shkarko aplikacionin <strong>Google Authenticator</strong> nga App Store ose Google Play.</li>
                    <li>Shtyp butonin <strong>+</strong> në aplikacion dhe zgjidh "Scan a QR code".</li>
                    <li>Skano kodin QR që sheh në të majtë për ta lidhur me llogarinë.</li>
                  </ol>
                  <div className={styles.manualKey}>
                    Ose përdor këtë çelës manualisht: <strong>JBSWY3DPEHPK3PXP</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.passwordRow}>
          <div className={styles.passwordIconContainer}>
            <Key size={24} />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>Ndrysho Fjalëkalimin</h3>
            <p className={styles.description} style={{ marginBottom: '16px' }}>Përditësoni fjalëkalimin tuaj aktual të llogarisë.</p>
            {!isPasswordFormOpen ? (
              <button 
                onClick={() => setIsPasswordFormOpen(true)}
                className="btn-secondary" 
                style={{ display: 'inline-flex', padding: '8px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 600, color: '#475569' }}
              >
                Ndrysho Fjalëkalimin
              </button>
            ) : (
              <div className={styles.passwordFormContainer}>
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
