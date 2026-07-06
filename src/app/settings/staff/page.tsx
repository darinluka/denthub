'use client';

import { useState } from 'react';
import { Plus, X, UserCog, Pencil, Trash2, Check, Shield } from 'lucide-react';
import styles from './staff.module.css';

type Role = 'Admin' | 'Mjek Dentar' | 'Recepsionist' | 'Asistent';

type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  specialty: string;
  color: string;
  has2fa?: boolean;
};

const ROLES: Role[] = ['Admin', 'Mjek Dentar', 'Recepsionist', 'Asistent'];

const ROLE_COLORS: Record<Role, string> = {
  'Admin': '#7c3aed',
  'Mjek Dentar': '#059669',
  'Recepsionist': '#0ea5e9',
  'Asistent': '#f59e0b',
};

const initialStaff: StaffMember[] = [
  { id: '1', name: 'Dr. Agim Hoxha', email: 'agim@dentacrm.al', phone: '+355 69 100 0001', role: 'Mjek Dentar', specialty: 'Ortodonci', color: '#059669', has2fa: true },
  { id: '2', name: 'Teuta Leka', email: 'teuta@dentacrm.al', phone: '+355 68 100 0002', role: 'Recepsionist', specialty: '—', color: '#0ea5e9', has2fa: false },
  { id: '3', name: 'Admin Klinike', email: 'admin@dentacrm.al', phone: '+355 67 100 0003', role: 'Admin', specialty: '—', color: '#7c3aed', has2fa: true },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'Mjek Dentar' as Role, specialty: '', password: '' });

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', email: '', phone: '', role: 'Mjek Dentar', specialty: '', password: '' });
    setShowModal(true);
  };

  const openEdit = (s: StaffMember) => {
    setEditId(s.id);
    setForm({ name: s.name, email: s.email, phone: s.phone, role: s.role, specialty: s.specialty, password: '' });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Jeni të sigurt që doni ta fshini këtë punonjës?')) {
      setStaff(prev => prev.filter(s => s.id !== id));
    }
  };

  const toggle2fa = (id: string) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, has2fa: !s.has2fa } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setStaff(prev => prev.map(s => s.id === editId
        ? { ...s, ...form, color: ROLE_COLORS[form.role] }
        : s
      ));
    } else {
      setStaff(prev => [...prev, {
        id: String(Date.now()),
        ...form,
        color: ROLE_COLORS[form.role],
      }]);
    }
    setShowModal(false);
  };

  const doctors = staff.filter(s => s.role === 'Mjek Dentar');

  return (
    <div className={`${styles.page} fade-in`}>
      <header className={styles.header}>
        <div>
          <h1>Stafi & Rolet</h1>
          <p className={styles.subtitle}>Menaxhimi i punonjësve dhe roleve të tyre</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={16} />
          Shto Punonjës
        </button>
      </header>

      {/* Role summary */}
      <div className={styles.roleCards}>
        {ROLES.map(role => {
          const count = staff.filter(s => s.role === role).length;
          return (
            <div key={role} className={styles.roleCard}>
              <div className={styles.roleDot} style={{ backgroundColor: ROLE_COLORS[role] }} />
              <div>
                <p className={styles.roleCount}>{count}</p>
                <p className={styles.roleName}>{role}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Punonjësi</th>
              <th>Roli</th>
              <th>Specialiteti</th>
              <th>Nr. Telefonit</th>
              <th>Email</th>
              <th>Siguria (2FA)</th>
              <th>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => (
              <tr key={s.id}>
                <td>
                  <div className={styles.staffCell}>
                    <div className={styles.staffAvatar} style={{ backgroundColor: s.color + '20', color: s.color }}>
                      {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <span className={styles.staffName}>{s.name}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.roleBadge} style={{ backgroundColor: s.color + '15', color: s.color }}>
                    <Shield size={11} /> {s.role}
                  </span>
                </td>
                <td>{s.specialty}</td>
                <td>{s.phone}</td>
                <td>{s.email}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                      <input type="checkbox" checked={s.has2fa} onChange={() => toggle2fa(s.id)} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: s.has2fa ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '34px' }}>
                        <span style={{ position: 'absolute', content: '""', height: '14px', width: '14px', left: s.has2fa ? '19px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                      </span>
                    </label>
                    <span style={{ fontSize: '0.8rem', color: s.has2fa ? '#10b981' : '#64748b', fontWeight: 500 }}>
                      {s.has2fa ? 'Aktiv' : 'Fikur'}
                    </span>
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => openEdit(s)}>
                      <Pencil size={14} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(s.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Doctor list for appointment assignment info */}
      <div className={styles.doctorSection}>
        <h2>Mjekët Aktivë</h2>
        <p className={styles.sectionSubtitle}>Këta mjekë mund t'u caktohen vizitave dhe pacientëve</p>
        <div className={styles.doctorCards}>
          {doctors.map(d => (
            <div key={d.id} className={styles.doctorCard}>
              <div className={styles.doctorAvatar} style={{ backgroundColor: d.color + '20', color: d.color }}>
                {d.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className={styles.doctorName}>{d.name}</p>
                <p className={styles.doctorSpec}>{d.specialty}</p>
              </div>
              <div className={styles.doctorStatus}>
                <Check size={14} /> Aktiv
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{editId ? 'Edito Punonjësin' : 'Shto Punonjës të Ri'}</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Emri i Plotë</label>
                <input type="text" placeholder="Dr. Emri Mbiemri" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Roli</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value as Role})}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {form.role === 'Mjek Dentar' && (
                <div className={styles.formGroup}>
                  <label>Specialiteti</label>
                  <input type="text" placeholder="P.sh. Ortodonci, Implantologji..." value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} />
                </div>
              )}
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" placeholder="email@klinika.al" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Fjalëkalimi {editId && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>(Lëre bosh për të mos e ndryshuar)</span>}</label>
                <input type="text" placeholder="Fjalëkalimi i ri..." value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editId} />
              </div>
              <div className={styles.formGroup}>
                <label>Nr. Telefonit</label>
                <input type="tel" placeholder="+355 69 000 0000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Anulo</button>
                <button type="submit" className="btn-primary">
                  {editId ? 'Ruaj Ndryshimet' : 'Shto Punonjësin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
