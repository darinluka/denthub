'use client';

import { useState, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, Clock, User, Stethoscope, CalendarDays } from 'lucide-react';
import styles from './appointments.module.css';
import { sendTelegramNotification } from '@/lib/telegram';

type Appointment = {
  id: number;
  patient: string;
  treatment: string;
  doctor: string;
  date: string; // YYYY-MM-DD
  time: string;
  duration: string;
  type: 'treatment' | 'consultation' | 'surgery';
};

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const initialAppointments: Appointment[] = [
  { id: 1, patient: 'Agim Ramadani', treatment: 'Pastrim Gurëzash', doctor: 'Dr. Agimi', date: todayStr, time: '09:00', duration: '90', type: 'treatment' },
  { id: 2, patient: 'Teuta Kelmendi', treatment: 'Konsultë & Grafi', doctor: 'Dr. Agimi', date: todayStr, time: '11:30', duration: '45', type: 'consultation' },
  { id: 3, patient: 'Dritan Hoxha', treatment: 'Implant (Dhëmbi 32)', doctor: 'Dr. Agimi', date: todayStr, time: '14:00', duration: '120', type: 'surgery' },
];

const MOCK_SERVICES = [
  { id: '1', name: 'Pastrim Gurëzash', price: 4000 },
  { id: '2', name: 'Mbushje Kompozit (E Vogël)', price: 5000 },
  { id: '3', name: 'Mbushje Kompozit (E Madhe)', price: 6000 },
  { id: '4', name: 'Mjekim Kanali (Dhëmb Tek)', price: 8000 },
  { id: '5', name: 'Ekstraksion i Thjeshtë', price: 3000 },
  { id: '6', name: 'Kurorë Zirkoni', price: 20000 },
];

const DAYS = ['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die'];
const MONTHS = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

function formatAlbanianDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const daysFull = ['E Diel', 'E Hënë', 'E Martë', 'E Mërkurë', 'E Enjte', 'E Premte', 'E Shtunë'];
  const monthsFull = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];
  return `${daysFull[d.getDay()]} ${d.getDate()} ${monthsFull[d.getMonth()]}`;
}

export default function Appointments() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [form, setForm] = useState({ patient: '', treatment: '', doctor: 'Dr. Agimi', date: todayStr, time: '09:00', duration: '60', type: 'treatment' as const });

  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '09:00' });

  useEffect(() => {
    setIsMounted(true);
    const todayVal = new Date();
    const todayValStr = todayVal.toISOString().split('T')[0];
    const defaultAppts: Appointment[] = [
      { id: 1, patient: 'Agim Ramadani', treatment: 'Pastrim Gurëzash', doctor: 'Dr. Agimi', date: todayValStr, time: '09:00', duration: '90', type: 'treatment' },
      { id: 2, patient: 'Teuta Kelmendi', treatment: 'Konsultë & Grafi', doctor: 'Dr. Agimi', date: todayValStr, time: '11:30', duration: '45', type: 'consultation' },
      { id: 3, patient: 'Dritan Hoxha', treatment: 'Implant (Dhëmbi 32)', doctor: 'Dr. Agimi', date: todayValStr, time: '14:00', duration: '120', type: 'surgery' },
    ];
    try {
      const saved = localStorage.getItem('appointments_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setAppointments(parsed);
        } else {
          setAppointments(defaultAppts);
        }
      } else {
        setAppointments(defaultAppts);
      }
    } catch (e) {
      console.error('Failed to parse appointments:', e);
      setAppointments(defaultAppts);
    }

    // Load Patients
    const initialPatients = [
      { id: '1', firstName: 'Agim', lastName: 'Ramadani', phone: '+355 69 123 4567', email: 'agim@email.com', dob: '1985-04-12', lastVisit: '10 Qershor 2026', nextVisit: '22 Qershor 2026' },
      { id: '2', firstName: 'Teuta', lastName: 'Kelmendi', phone: '+355 68 987 6543', email: 'teuta@email.com', dob: '1990-08-22', lastVisit: '15 Maj 2026', nextVisit: '22 Qershor 2026' },
      { id: '3', firstName: 'Dritan', lastName: 'Hoxha', phone: '+355 67 456 7890', email: '', dob: '1978-01-30', lastVisit: '2 Prill 2026', nextVisit: 'E pacaktuar' },
    ];
    try {
      const savedPatients = localStorage.getItem('patients_list');
      if (savedPatients) {
        const parsed = JSON.parse(savedPatients);
        if (Array.isArray(parsed)) {
          setPatients(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse patients:', e);
    }
    setPatients(initialPatients);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getAppts = (dateStr: string) => appointments.filter(a => a.date === dateStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let currentAppts = appointments;
    try {
      const saved = localStorage.getItem('appointments_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentAppts = parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }

    const newAppt = { ...form, id: Date.now() };
    const newList = [...currentAppts, newAppt];
    setAppointments(newList);
    localStorage.setItem('appointments_list', JSON.stringify(newList));
    
    // Fetch patient info for Telegram notification
    let patientPhone = '—';
    let patientEmail = '—';
    try {
      const savedPatients = localStorage.getItem('patients_list');
      if (savedPatients) {
        const parsed = JSON.parse(savedPatients);
        if (Array.isArray(parsed)) {
          const patientObj = parsed.find(p => `${p.firstName} ${p.lastName}` === form.patient);
          if (patientObj) {
            patientPhone = patientObj.phone || '—';
            patientEmail = patientObj.email || '—';
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    
    // Telegram Notification with email and phone
    sendTelegramNotification(`📅 <b>Vizitë e Re</b>\nPacienti: ${form.patient}\nTelefon: ${patientPhone}\nEmail: ${patientEmail}\nTrajtimi: ${form.treatment}\nData: ${form.date} ora ${form.time}`);

    setShowModal(false);
    setForm({ patient: '', treatment: '', doctor: 'Dr. Agimi', date: selectedDate, time: '09:00', duration: '60', type: 'treatment' });
  };

  const handleApptClick = (appt: Appointment) => {
    setSelectedAppt(appt);
    setRescheduleForm({ date: appt.date, time: appt.time });
    setIsRescheduling(false);
    setShowDetailsModal(true);
  };

  const handleCancelAppt = () => {
    if (!selectedAppt) return;
    
    let currentAppts = appointments;
    try {
      const saved = localStorage.getItem('appointments_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentAppts = parsed;
        }
      }
    } catch (err) {
      console.error(err);
    }
    
    const newList = currentAppts.filter(a => a.id !== selectedAppt.id);
    setAppointments(newList);
    localStorage.setItem('appointments_list', JSON.stringify(newList));
    
    // Fetch patient info for Telegram notification
    let patientPhone = '—';
    let patientEmail = '—';
    try {
      const savedPatients = localStorage.getItem('patients_list');
      if (savedPatients) {
        const parsed = JSON.parse(savedPatients);
        if (Array.isArray(parsed)) {
          const patientObj = parsed.find(p => `${p.firstName} ${p.lastName}` === selectedAppt.patient);
          if (patientObj) {
            patientPhone = patientObj.phone || '—';
            patientEmail = patientObj.email || '—';
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Telegram notification
    sendTelegramNotification(`❌ <b>Vizitë e Anuluar</b>\nPacienti: ${selectedAppt.patient}\nTelefon: ${patientPhone}\nEmail: ${patientEmail}\nTrajtimi: ${selectedAppt.treatment}\nData: ${selectedAppt.date} ora ${selectedAppt.time}`);
    
    setShowDetailsModal(false);
    setSelectedAppt(null);
  };

  const handleRescheduleAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    
    let currentAppts = appointments;
    try {
      const saved = localStorage.getItem('appointments_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentAppts = parsed;
        }
      }
    } catch (err) {
      console.error(err);
    }

    const isBooked = currentAppts.some(a => a.id !== selectedAppt.id && a.date === rescheduleForm.date && a.time === rescheduleForm.time);
    if (isBooked) {
      alert("Ky orar është i zënë! Ju lutemi zgjidhni një orar tjetër.");
      return;
    }

    const updatedAppts = currentAppts.map(a => {
      if (a.id === selectedAppt.id) {
        return { ...a, date: rescheduleForm.date, time: rescheduleForm.time };
      }
      return a;
    });

    setAppointments(updatedAppts);
    localStorage.setItem('appointments_list', JSON.stringify(updatedAppts));

    // Fetch patient info for Telegram notification
    let patientPhone = '—';
    let patientEmail = '—';
    try {
      const savedPatients = localStorage.getItem('patients_list');
      if (savedPatients) {
        const parsed = JSON.parse(savedPatients);
        if (Array.isArray(parsed)) {
          const patientObj = parsed.find(p => `${p.firstName} ${p.lastName}` === selectedAppt.patient);
          if (patientObj) {
            patientPhone = patientObj.phone || '—';
            patientEmail = patientObj.email || '—';
          }
        }
      }
    } catch (e) {
      console.error(e);
    }

    // Telegram Notification
    sendTelegramNotification(`🔄 <b>Vizitë e Shtyra (Ndryshuar)</b>\nPacienti: ${selectedAppt.patient}\nTelefon: ${patientPhone}\nEmail: ${patientEmail}\nNga data: ${selectedAppt.date} ora ${selectedAppt.time}\nNë datën: ${rescheduleForm.date} ora ${rescheduleForm.time}\nTrajtimi: ${selectedAppt.treatment}`);

    setShowDetailsModal(false);
    setSelectedAppt(null);
  };

  // Build calendar days array
  const calendarDays: (string | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    calendarDays.push(`${year}-${mm}-${dd}`);
  }

  const selectedAppts = getAppts(selectedDate);

  if (!isMounted) return null;

  return (
    <div className={`${styles.page} fade-in`}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1>Vizitat</h1>
          <p className={styles.subtitle}>Menaxhimi i orarit të vizitave</p>
        </div>
        <button className="btn-primary" onClick={() => { setForm(f => ({ ...f, date: selectedDate })); setShowModal(true); }}>
          <Plus size={16} />
          Shto Vizitë
        </button>
      </header>

      <div className={styles.content}>
        {/* Left: Calendar */}
        <div className={styles.calendarCard}>
          {/* Month Navigator */}
          <div className={styles.calNav}>
            <button className={styles.navBtn} onClick={prevMonth}><ChevronLeft size={18} /></button>
            <span className={styles.calTitle}>{MONTHS[month]} {year}</span>
            <button className={styles.navBtn} onClick={nextMonth}><ChevronRight size={18} /></button>
          </div>

          {/* Day names */}
          <div className={styles.calGrid}>
            {DAYS.map(d => (
              <div key={d} className={styles.dayName}>{d}</div>
            ))}
            {calendarDays.map((dateStr, i) => {
              if (!dateStr) return <div key={`e-${i}`} />;
              const appts = getAppts(dateStr);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              return (
                <button
                  key={dateStr}
                  className={`${styles.dayCell} ${isToday ? styles.today : ''} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <span className={styles.dayNum}>{parseInt(dateStr.split('-')[2])}</span>
                  {appts.length > 0 && (
                    <span className={styles.apptDot}>{appts.length}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Day's appointments */}
        <div className={styles.dayPanel}>
          <div className={styles.dayPanelHeader}>
            <h2>
              {formatAlbanianDate(selectedDate)}
            </h2>
            <span className={styles.apptCount}>{selectedAppts.length} vizitë</span>
          </div>

          <div className={styles.timelineGrid}>
            {Array.from({ length: 12 }, (_, i) => String(i + 8).padStart(2, '0') + ':00').map(hour => {
              // Find appointments that start near this hour
              const hourPrefix = hour.split(':')[0];
              const apptsInHour = selectedAppts.filter(a => a.time.startsWith(hourPrefix));

              return (
                <div key={hour} className={styles.timelineRow}>
                  <div className={styles.timeLabel}>{hour}</div>
                  <div className={styles.timeSlot}>
                    {apptsInHour.length > 0 ? (
                      <div className={styles.slotAppts}>
                        {apptsInHour.sort((a, b) => a.time.localeCompare(b.time)).map(appt => (
                          <div
                            key={appt.id}
                            className={`${styles.apptItem} ${styles[`appt_${appt.type}`]}`}
                            onClick={() => handleApptClick(appt)}
                          >
                            <div className={styles.apptTimeBlock}>
                              <span className={styles.apptTime}>{appt.time}</span>
                              <span className={styles.apptDuration}>{appt.duration} min</span>
                            </div>
                            <div className={styles.apptDetails}>
                              <div className={styles.apptPatient}>{appt.patient}</div>
                              <div className={styles.apptTreatment}>{appt.treatment}</div>
                              <div className={styles.apptDoctor}>{appt.doctor}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div 
                        className={styles.emptySlot} 
                        onClick={() => {
                          setForm(f => ({ ...f, date: selectedDate, time: hour }));
                          setShowModal(true);
                        }}
                      >
                        <Plus size={14} /> Shto vizitë në {hour}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Shto Vizitë të Re</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
             <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label><User size={14} /> Emri Pacientit</label>
                <select value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} required autoFocus>
                  <option value="">Zgjidh Pacientin...</option>
                  {patients.map(p => {
                    const fullName = `${p.firstName} ${p.lastName}`;
                    return <option key={p.id} value={fullName}>{fullName}</option>;
                  })}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label><Stethoscope size={14} /> Trajtimi</label>
                <select value={form.treatment} onChange={e => setForm({...form, treatment: e.target.value})} required>
                  <option value="">Zgjidh Shërbimin...</option>
                  {MOCK_SERVICES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label><CalendarDays size={14} /> Data</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                </div>
                <div className={styles.formGroup}>
                  <label><Clock size={14} /> Ora</label>
                  <select value={form.time} onChange={e => setForm({...form, time: e.target.value})} required>
                    {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"].map(t => {
                      const isBooked = appointments.some(a => a.date === form.date && a.time === t);
                      return (
                        <option key={t} value={t} disabled={isBooked} style={{ color: isBooked ? 'red' : 'inherit' }}>
                          {t} {isBooked ? '(E zënë)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Kohëzgjatja</label>
                  <select value={form.duration} onChange={e => setForm({...form, duration: e.target.value})}>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">1 orë</option>
                    <option value="90">1 orë 30 min</option>
                    <option value="120">2 orë</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Lloji</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})}>
                    <option value="treatment">Trajtim</option>
                    <option value="consultation">Konsultë</option>
                    <option value="surgery">Kirurgji</option>
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Anulo</button>
                <button type="submit" className="btn-primary">Ruaj Vizitën</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS / CANCEL / RESCHEDULE MODAL */}
      {showDetailsModal && selectedAppt && (
        <div className={styles.modalOverlay} onClick={() => { setShowDetailsModal(false); setSelectedAppt(null); }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Detajet e Vizitës</h2>
              <button className={styles.closeBtn} onClick={() => { setShowDetailsModal(false); setSelectedAppt(null); }}><X size={20} /></button>
            </div>
            
            {!isRescheduling ? (
              <div className={styles.detailsContent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PACIENTI</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary-color)' }}>{selectedAppt.patient}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TRAJTIMI</p>
                    <p style={{ fontWeight: 600 }}>{selectedAppt.treatment}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MJEKU</p>
                    <p style={{ fontWeight: 600 }}>{selectedAppt.doctor}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>DATA</p>
                    <p style={{ fontWeight: 600 }}>{selectedAppt.date}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ORA</p>
                    <p style={{ fontWeight: 600 }}>{selectedAppt.time} ({selectedAppt.duration} min)</p>
                  </div>
                </div>

                <div className={styles.formActions} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', borderTop: 'none', paddingTop: 0 }}>
                  <button type="button" className={styles.cancelBtn} style={{ borderColor: 'var(--danger-color)', color: 'var(--danger-color)', width: 'auto' }} onClick={handleCancelAppt}>
                    Anulo Vizitën
                  </button>
                  <button type="button" className="btn-primary" onClick={() => setIsRescheduling(true)}>
                    Shty / Ndrysho orar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRescheduleAppt} className={styles.form}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Ndrysho datën ose orën për vizitën e <strong>{selectedAppt.patient}</strong></p>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label><CalendarDays size={14} /> Data e Re</label>
                    <input type="date" value={rescheduleForm.date} onChange={e => setRescheduleForm({...rescheduleForm, date: e.target.value})} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label><Clock size={14} /> Ora e Re</label>
                    <select
                      value={rescheduleForm.time}
                      onChange={e => setRescheduleForm({...rescheduleForm, time: e.target.value})}
                      required
                    >
                      {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"].map(t => {
                        const isBooked = appointments.some(a => a.id !== selectedAppt.id && a.date === rescheduleForm.date && a.time === t);
                        return (
                          <option key={t} value={t} disabled={isBooked} style={{ color: isBooked ? 'red' : 'inherit' }}>
                            {t} {isBooked ? '(E zënë)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsRescheduling(false)}>Prapa</button>
                  <button type="submit" className="btn-primary">Konfirmo Ndryshimin</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
