'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Upload, Phone, Mail, MapPin } from 'lucide-react';
import styles from './clinic.module.css';

export default function ClinicSettings() {
  const [clinicInfo, setClinicInfo] = useState({
    name: 'Klinika Denthub.al',
    nipt: 'L12345678A',
    address: 'Rruga e Dibrës, Pallati 12, Tiranë',
    phone: '+355 69 123 4567',
    email: 'info@denthub.al',
    website: 'www.denthub.al'
  });

  const [toast, setToast] = useState('');
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedInfo = localStorage.getItem('clinicInfo');
    if (savedInfo) setClinicInfo(JSON.parse(savedInfo));
    const savedLogo = localStorage.getItem('clinicLogo');
    if (savedLogo) setLogoPreviewUrl(savedLogo);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('clinicInfo', JSON.stringify(clinicInfo));
    if (logoPreviewUrl) localStorage.setItem('clinicLogo', logoPreviewUrl);
    window.dispatchEvent(new Event('clinicInfoUpdated'));
    setToast('✅ Të dhënat u ruajtën me sukses!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className={styles.container}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.header}>
        <div>
          <Link href="/settings" className={styles.backBtn}>
            <ArrowLeft size={16} /> Kthehu te Cilësimet
          </Link>
          <h1>Informacioni i Klinikës</h1>
          <p>Këto të dhëna do të shfaqen në faturat dhe recetat e printuara.</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftCol}>
          <div className={styles.logoUpload}>
            <div className={styles.logoPreview}>
              {logoPreviewUrl ? (
                <img src={logoPreviewUrl} alt="Logo e Klinikës" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              ) : (
                <Building2 size={48} className={styles.placeholderIcon} />
              )}
            </div>
            <input 
              type="file" 
              id="logoUpload" 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handleLogoUpload} 
            />
            <label htmlFor="logoUpload" className={styles.uploadBtn}>
              <Upload size={16} /> Ndrysho Logon
            </label>
            <p className={styles.uploadHint}>Format i rekomanduar: PNG ose JPG, max 2MB.</p>
          </div>
        </div>

        <div className={styles.rightCol}>
          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Emri i Klinikës</label>
                <div className={styles.inputWrap}>
                  <Building2 size={16} className={styles.inputIcon} />
                  <input type="text" value={clinicInfo.name} onChange={e => setClinicInfo({...clinicInfo, name: e.target.value})} required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>NIPT</label>
                <input type="text" value={clinicInfo.nipt} onChange={e => setClinicInfo({...clinicInfo, nipt: e.target.value})} required />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Adresa e Plotë</label>
              <div className={styles.inputWrap}>
                <MapPin size={16} className={styles.inputIcon} />
                <input type="text" value={clinicInfo.address} onChange={e => setClinicInfo({...clinicInfo, address: e.target.value})} required />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Numri i Telefonit</label>
                <div className={styles.inputWrap}>
                  <Phone size={16} className={styles.inputIcon} />
                  <input type="tel" value={clinicInfo.phone} onChange={e => setClinicInfo({...clinicInfo, phone: e.target.value})} required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Email Adresa</label>
                <div className={styles.inputWrap}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input type="email" value={clinicInfo.email} onChange={e => setClinicInfo({...clinicInfo, email: e.target.value})} required />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Faqja Web (Opsionale)</label>
              <input type="text" value={clinicInfo.website} onChange={e => setClinicInfo({...clinicInfo, website: e.target.value})} />
            </div>

            <div className={styles.actions}>
              <button type="submit" className="btn-primary">Ruaj Ndryshimet</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
