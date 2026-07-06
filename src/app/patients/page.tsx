'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, X, User, Phone, Calendar, Mail, FolderOpen, MessageCircle, AlertTriangle } from 'lucide-react';
import styles from './patients.module.css';
import { sendTelegramNotification } from '@/lib/telegram';

const initialPatients = [
  { id: '1', firstName: 'Agim', lastName: 'Ramadani', phone: '+355 69 123 4567', email: 'agim@email.com', dob: '1985-04-12', lastVisit: '10 Qershor 2026', nextVisit: '22 Qershor 2026' },
  { id: '2', firstName: 'Teuta', lastName: 'Kelmendi', phone: '+355 68 987 6543', email: 'teuta@email.com', dob: '1990-08-22', lastVisit: '15 Maj 2026', nextVisit: '22 Qershor 2026' },
  { id: '3', firstName: 'Dritan', lastName: 'Hoxha', phone: '+355 67 456 7890', email: '', dob: '1978-01-30', lastVisit: '2 Prill 2026', nextVisit: 'E pacaktuar' },
];

export default function PatientsList() {
  const [patients, setPatients] = useState(initialPatients);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', whatsapp: '', email: '', dob: '' });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('patients_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPatients(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse patients:', e);
    }
  }, []);

  if (!isMounted) return null;

  const filtered = Array.isArray(patients) ? patients.filter(p => {
    const name = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
    const phone = p.phone || '';
    return name.includes(search.toLowerCase()) || phone.includes(search);
  }) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.email) {
      const exists = patients.some(p => p.email && p.email.toLowerCase() === form.email.toLowerCase());
      if (exists) {
        setError('Ky email ekziston tashmë! Nuk mund të regjistrohen dy pacientë me të njëjtin email.');
        return;
      }
    }

    const newId = String(Date.now());
    const newPatient = { ...form, id: newId, lastVisit: '—', nextVisit: 'E pacaktuar' };
    const newPatientsList = [...patients, newPatient];
    
    setPatients(newPatientsList);
    localStorage.setItem('patients_list', JSON.stringify(newPatientsList));
    
    // Send Telegram Notification
    sendTelegramNotification(`👤 <b>Pacient i Ri</b>\nEmri: ${form.firstName} ${form.lastName}\nTelefon: ${form.phone}\nEmail: ${form.email || '—'}`);
    
    setShowModal(false);
    setForm({ firstName: '', lastName: '', phone: '', whatsapp: '', email: '', dob: '' });
  };

  return (
    <div className={`${styles.patientsPage} fade-in`}>
      <header className={styles.header}>
        <div>
          <h1>Lista e Pacientëve</h1>
          <p className={styles.subtitle}>{patients.length} pacientë gjithsej</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.searchBox}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Kërko me emër, nr. tel..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Shto Pacient
          </button>
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Emri Mbiemri</th>
              <th>Nr. Telefonit</th>
              <th>Vizita e Fundit</th>
              <th>Vizita e Rradhës</th>
              <th>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => (
              <tr key={p.id}>
                <td className={styles.idCell}>#{1001 + idx}</td>
                <td>
                  <div className={styles.patientCell}>
                    <div className={styles.patientAvatar}>{p.firstName[0]}{p.lastName[0]}</div>
                    <div>
                      <div className={styles.patientName}>{p.firstName} {p.lastName}</div>
                      {p.email && <div className={styles.patientEmail}>{p.email}</div>}
                    </div>
                  </div>
                </td>
                <td>{p.phone}</td>
                <td>{p.lastVisit}</td>
                <td>{p.nextVisit}</td>
                <td>
                  <Link href={`/patients/${p.id}`} className={styles.viewBtn}>
                    <FolderOpen size={14} />
                    Hap Kartelën
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>Nuk u gjet asnjë pacient.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Shto Pacient të Ri</h2>
              <button className={styles.closeBtn} onClick={() => { setShowModal(false); setError(''); }}><X size={20} /></button>
            </div>
            {error && <div className={styles.errorAlert}><AlertTriangle size={16}/> {error}</div>}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label><User size={14} /> Emri</label>
                  <input type="text" placeholder="Emri" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label><User size={14} /> Mbiemri</label>
                  <input type="text" placeholder="Mbiemri" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label><Phone size={14} /> Numri i Telefonit *</label>
                <input type="tel" placeholder="+355 69 000 0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label><MessageCircle size={14} /> Nr. WhatsApp (nëse ndryshon)</label>
                <input type="tel" placeholder="Nëse ndryshon nga nr. cel..." value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label><Mail size={14} /> Email (opsional)</label>
                <input type="email" placeholder="email@shembull.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label><Calendar size={14} /> Data e Lindjes</label>
                <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Anulo</button>
                <button type="submit" className="btn-primary">Regjistro Pacientin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
