'use client';

import { useState, useEffect } from 'react';
import { 
  Building, 
  Check, 
  Trash2, 
  X, 
  Shield, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import styles from './superadmin.module.css';

interface RegistrationRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  clinicName: string;
  clinicCity: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function SuperAdminDashboard() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [toast, setToast] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Seed default mock requests if none exist in localStorage
    const defaultRequests: RegistrationRequest[] = [
      {
        id: 'req_1',
        firstName: 'Bledar',
        lastName: 'Çeliku',
        email: 'contact@dentasmile.com',
        phone: '+355 69 444 3322',
        clinicName: 'Klinika DentaSmile',
        clinicCity: 'Durrës',
        status: 'pending',
        createdAt: '02/07/2026 10:15'
      },
      {
        id: 'req_2',
        firstName: 'Valbona',
        lastName: 'Shkurti',
        email: 'valbona@ortodent.al',
        phone: '+355 68 555 7788',
        clinicName: 'OrtoDent Vlorë',
        clinicCity: 'Vlorë',
        status: 'pending',
        createdAt: '03/07/2026 09:30'
      },
      {
        id: 'req_3',
        firstName: 'Ermal',
        lastName: 'Kasa',
        email: 'info@dentalart-tirana.com',
        phone: '+355 67 222 1199',
        clinicName: 'DentalArt Tirana',
        clinicCity: 'Tiranë',
        status: 'approved',
        createdAt: '28/06/2026 14:05'
      },
      {
        id: 'req_4',
        firstName: 'Blerina',
        lastName: 'Rama',
        email: 'dr.blerina@elitedental.al',
        phone: '+355 69 888 7766',
        clinicName: 'Elite Dental Clinic',
        clinicCity: 'Fier',
        status: 'approved',
        createdAt: '25/06/2026 11:20'
      }
    ];

    try {
      const saved = localStorage.getItem('registration_requests');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRequests(parsed);
          return;
        }
      }
      localStorage.setItem('registration_requests', JSON.stringify(defaultRequests));
      setRequests(defaultRequests);
    } catch (e) {
      console.error(e);
      setRequests(defaultRequests);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleApprove = (id: string) => {
    const updated = requests.map(r => r.id === id ? { ...r, status: 'approved' as const } : r);
    setRequests(updated);
    localStorage.setItem('registration_requests', JSON.stringify(updated));
    showToast('Klinika u aprovua me sukses dhe llogaria u aktivizua!');
  };

  const handleReject = (id: string) => {
    if (confirm('Jeni të sigurt që doni të refuzoni këtë kërkesë?')) {
      const updated = requests.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r);
      setRequests(updated);
      localStorage.setItem('registration_requests', JSON.stringify(updated));
      showToast('Kërkesa u refuzua.');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Jeni të sigurt që doni të fshini këtë kërkesë përgjithmonë?')) {
      const updated = requests.filter(r => r.id !== id);
      setRequests(updated);
      localStorage.setItem('registration_requests', JSON.stringify(updated));
      showToast('Kërkesa u fshi nga sistemi.');
    }
  };

  if (!isMounted) return null;

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedClinics = requests.filter(r => r.status === 'approved');

  // Stats
  const totalClinicsCount = approvedClinics.length + 1; // +1 for the core Denthub.al clinic
  const pendingCount = pendingRequests.length;

  return (
    <div className={styles.container}>
      {toast && (
        <div className={styles.toast}>
          <CheckCircle size={16} />
          {toast}
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div>
          <div className={styles.badgeRow}>
            <h1 className={styles.title}>Super Admin Panel</h1>
            <span className={styles.superAdminBadge}>
              <Shield size={12} /> Mode: Sistem Global
            </span>
          </div>
          <p className={styles.subtitle}>Menaxhimi i kërkesave për regjistrim dhe monitorimi i klinikave dentare.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Building size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Klinika Aktive</span>
            <strong className={styles.statVal}>{totalClinicsCount}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Clock size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Kërkesa në Pritje</span>
            <strong className={styles.statVal}>{pendingCount}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
            <Users size={20} />
          </div>
          <div>
            <span className={styles.statLabel}>Super Administratorë</span>
            <strong className={styles.statVal}>1</strong>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className={styles.tabsRow}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Kërkesat e Reja ({pendingCount})
        </button>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'active' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Klinikat e Regjistruara ({approvedClinics.length})
        </button>
      </div>

      {/* Main Table Card */}
      <div className={styles.tableCard}>
        {activeTab === 'pending' ? (
          pendingCount === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
              <h3>Nuk ka kërkesa të reja</h3>
              <p>Të gjitha kërkesat e klinikave janë shqyrtuar me sukses.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Klinika</th>
                    <th>Doktori / Pronari</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Qyteti</th>
                    <th>Data e Kërkesës</th>
                    <th className={styles.actionsCol}>Aksione</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map(r => (
                    <tr key={r.id}>
                      <td>
                        <strong className={styles.clinicName}>{r.clinicName}</strong>
                      </td>
                      <td>{r.firstName} {r.lastName}</td>
                      <td>
                        <div className={styles.metaRow}><Mail size={12} /> {r.email}</div>
                      </td>
                      <td>
                        <div className={styles.metaRow}><Phone size={12} /> {r.phone}</div>
                      </td>
                      <td>
                        <span className={styles.cityBadge}><MapPin size={10} /> {r.clinicCity}</span>
                      </td>
                      <td>
                        <div className={styles.metaRow}><Calendar size={12} /> {r.createdAt}</div>
                      </td>
                      <td>
                        <div className={styles.actionBtns}>
                          <button 
                            className={styles.approveBtn} 
                            onClick={() => handleApprove(r.id)} 
                            title="Aprovo Klinikën"
                          >
                            <Check size={14} /> Aprovo
                          </button>
                          <button 
                            className={styles.rejectBtn} 
                            onClick={() => handleReject(r.id)} 
                            title="Refuzo Kërkesën"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          approvedClinics.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={40} style={{ color: '#94a3b8', marginBottom: '12px' }} />
              <h3>Nuk ka klinika të tjera aktive</h3>
              <p>Klinikat e aprovuara do të listohen këtu.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Klinika</th>
                    <th>Doktori / Pronari</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Qyteti</th>
                    <th>Statusi</th>
                    <th className={styles.actionsCol}>Aksione</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Seed a core system clinic */}
                  <tr>
                    <td><strong className={styles.clinicName}>Denthub.al (Klinika Qendrore)</strong></td>
                    <td>Dr. Agim Hoxha</td>
                    <td><div className={styles.metaRow}><Mail size={12} /> info@denthub.al</div></td>
                    <td><div className={styles.metaRow}><Phone size={12} /> +355 69 123 4567</div></td>
                    <td><span className={styles.cityBadge} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}><MapPin size={10} /> Tiranë</span></td>
                    <td><span className={styles.statusActive}>Sistem Qendror</span></td>
                    <td><span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Llogari Master</span></td>
                  </tr>

                  {approvedClinics.map(r => (
                    <tr key={r.id}>
                      <td>
                        <strong className={styles.clinicName}>{r.clinicName}</strong>
                      </td>
                      <td>{r.firstName} {r.lastName}</td>
                      <td>
                        <div className={styles.metaRow}><Mail size={12} /> {r.email}</div>
                      </td>
                      <td>
                        <div className={styles.metaRow}><Phone size={12} /> {r.phone}</div>
                      </td>
                      <td>
                        <span className={styles.cityBadge}><MapPin size={10} /> {r.clinicCity}</span>
                      </td>
                      <td>
                        <span className={styles.statusActive}>Aktive</span>
                      </td>
                      <td>
                        <button 
                          className={styles.deleteBtn} 
                          onClick={() => handleDelete(r.id)} 
                          title="Fshi klinikën përgjithmonë"
                        >
                          <Trash2 size={14} /> Fshi
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
