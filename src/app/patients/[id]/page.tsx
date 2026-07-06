'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { sendTelegramNotification } from '@/lib/telegram';
import {
  ArrowLeft, Phone, Mail, CalendarDays, Calendar as CalendarIcon, Upload, FileText,
  Plus, Activity, CreditCard, X, Pencil, Check, ZoomIn, ZoomOut, Maximize2,
  AlertTriangle, User, Stethoscope
} from 'lucide-react';
import dynamic from 'next/dynamic';
const Odontogram3D = dynamic(() => import('./Odontogram3D'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '500px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
      Duke ngarkuar Odontogramin 3D...
    </div>
  )
});
import styles from './kartela.module.css';

const mockPatient = {
  id: '1',
  firstName: 'Agim',
  lastName: 'Ramadani',
  phone: '+355 69 123 4567',
  email: 'agim@email.com',
  dob: '12 Prill 1985',
  address: 'Rr. Ismail Qemali, Tiranë',
  bloodType: 'A+',
  doctor: 'Dr. Agim Hoxha',
};

const mockTreatments = [
  { date: '10 Qer 2026', tooth: '30', description: 'Pastrim Gurëzash', doctor: 'Dr. Agimi', status: 'Kryer', cost: 4000 },
  { date: '15 Maj 2026', tooth: '32', description: 'Mbushje Kompozit', doctor: 'Dr. Agimi', status: 'Kryer', cost: 6000 },
  { date: '2 Prill 2026', tooth: '11', description: 'Kurorë Porcelani', doctor: 'Dr. Agimi', status: 'Planifikuar', cost: 25000 },
];

// Simulated grayscale X-ray placeholders via CSS gradients
const initialXrays = [
  { id: 1, date: '10 Qer 2026', title: 'Panoramike e Plotë', notes: 'Dhëmbi 30 me karies të thellë', color: '#475569' },
  { id: 2, date: '15 Maj 2026', title: 'Grafi e Poshtme', notes: 'Mbushje e vjetër e dëmtuar', color: '#334155' },
];

const DOCTORS = ['Dr. Agim Hoxha', 'Dr. Blerina Koci', 'Dr. Ermal Doci'];
const tabs = ['Historiku', 'Odontogrami 3D', 'Grafit (X-Ray)', 'Fotografi (Para/Pas)', 'Recetat', 'Financat'];

export default function PatientKartela() {
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Historiku');
  const [xrays, setXrays] = useState(initialXrays);
  const [lightbox, setLightbox] = useState<any>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [beforePhotos, setBeforePhotos] = useState<any[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<any[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newPhoto = { id: Date.now(), imgSrc: url, title: `Foto ${type === 'before' ? 'Para' : 'Pas'}`, notes: file.name, date: new Date().toLocaleDateString('sq-AL'), num: 1 };
      if (type === 'before') {
        setBeforePhotos([...beforePhotos, newPhoto]);
      } else {
        setAfterPhotos([...afterPhotos, newPhoto]);
      }
    }
  };

  // Reset zoom when lightbox opens
  useEffect(() => {
    if (lightbox) setZoomLevel(1);
  }, [lightbox]);

  useEffect(() => {
    const defaultServices = [
      { id: '1', name: 'Pastrim Gurëzash', price: 4000 },
      { id: '2', name: 'Mbushje Kompozit (E Vogël)', price: 5000 },
      { id: '3', name: 'Mbushje Kompozit (E Madhe)', price: 6000 },
      { id: '4', name: 'Mjekim Kanali (Dhëmb Tek)', price: 8000 },
      { id: '5', name: 'Ekstraksion i Thjeshtë', price: 3000 },
      { id: '6', name: 'Kurorë Zirkoni', price: 20000 },
    ];
    try {
      const savedSvc = localStorage.getItem('services_list');
      if (savedSvc) {
        const parsed = JSON.parse(savedSvc);
        if (Array.isArray(parsed)) {
          setServices(parsed);
          return;
        }
      }
      localStorage.setItem('services_list', JSON.stringify(defaultServices));
      setServices(defaultServices);
    } catch (e) {
      console.error(e);
      setServices(defaultServices);
    }
  }, []);

  const [invoicesList, setInvoicesList] = useState([
    { id: '1', date: '10 Qer 2026', service: 'Pastrim Gurëzash', amount: 4000, paid: 4000, status: 'Paguar' },
    { id: '2', date: '15 Maj 2026', service: 'Mbushje Kompozit', amount: 6000, paid: 3000, status: 'Pjesërisht' },
  ]);

  const [prescriptions, setPrescriptions] = useState([
    { id: '1', date: '10 Qer 2026', text: 'Amoxicillin 500mg - 1 kokërr çdo 8 orë për 5 ditë\nOki (Ketoprofen) - 1 pako pas ushqimit kur ka dhimbje', doctor: 'Dr. Agim Hoxha' }
  ]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [newPrescription, setNewPrescription] = useState('');

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoice, setInvoice] = useState({ service: '', amount: '', notes: '' });
  
  // Editable patient info
  const [patient, setPatient] = useState({
    ...mockPatient,
    allergies: 'Penicillinë',
    notes: 'Pacient i rregullt. Ka frikë nga anestezikët.',
    doctor: mockPatient.doctor,
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');


  const [showEditPatientModal, setShowEditPatientModal] = useState(false);
  const [editPatientForm, setEditPatientForm] = useState({ ...patient });

  const handleEditPatientSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPatient({ ...patient, ...editPatientForm });
    setShowEditPatientModal(false);
  };

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveEdit = (field: string) => {
    setPatient(prev => ({ ...prev, [field]: tempValue }));
    setEditingField(null);
  };

  const handleXrayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const id = Date.now();
        setXrays(prev => [{
          id,
          date: new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' }),
          title: file.name,
          notes: 'Ngarkuar manualisht',
          color: ['#1e3a5f', '#1a4731', '#4a1942', '#5c3317'][prev.length % 4],
          imgSrc: event.target?.result as string
        }, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice = {
      id: String(Date.now()),
      date: new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' }),
      service: invoice.service,
      amount: Number(invoice.amount),
      paid: 0,
      status: 'Pa Paguar'
    };

    setInvoicesList([newInvoice, ...invoicesList]);
    setShowInvoiceModal(false);
    
    // Telegram Notification
    sendTelegramNotification(`💰 <b>Faturë e Re</b>\nPacienti: ${patient.firstName} ${patient.lastName}\nShërbimi: ${invoice.service}\nShuma: ${invoice.amount} Lekë`);
    setInvoice({ service: '', amount: '', notes: '' });

    // Simulate print
    const printWindow = window.open('', 'whatsappWindow', 'width=800,height=600,left=200,top=100');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Fatura - ${patient.firstName} ${patient.lastName}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #1f2937; }
              h1 { color: #059669; margin-bottom: 5px; }
              .details { margin-top: 30px; border-top: 2px solid #e5e7eb; padding-top: 20px; font-size: 1.1rem; line-height: 1.8; }
              .footer { margin-top: 50px; font-size: 0.9rem; color: #6b7280; text-align: center; }
            </style>
          </head>
          <body>
            <h1>Klinika Dentare</h1>
            <h3>Faturë Shërbimi</h3>
            <div class="details">
              <p><strong>Pacienti:</strong> ${patient.firstName} ${patient.lastName}</p>
              <p><strong>Data:</strong> ${newInvoice.date}</p>
              <p><strong>Shërbimi/Trajtimi:</strong> ${newInvoice.service}</p>
              <p style="font-size:1.3rem; margin-top: 20px;"><strong>Shuma Totale:</strong> ${newInvoice.amount.toLocaleString()} Lekë</p>
            </div>
            <div class="footer">Faleminderit që zgjodhët klinikën tonë!</div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrescription.trim()) return;
    
    setPrescriptions([{
      id: String(Date.now()),
      date: new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' }),
      text: newPrescription,
      doctor: patient.doctor
    }, ...prescriptions]);
    
    setNewPrescription('');
    setShowPrescriptionModal(false);
  };

  return (
    <div className={`${styles.kartelaPage} fade-in`}>
      <Link href="/patients" className={styles.backLink}>
        <ArrowLeft size={16} /> Kthehu te lista
      </Link>

      {/* Patient Header */}
      <div className={styles.patientHeader}>
        <div className={styles.avatarLarge}>
          {patient.firstName[0]}{patient.lastName[0]}
        </div>
        <div className={styles.patientInfo}>
          <h1>{patient.firstName} {patient.lastName}</h1>
          <div className={styles.patientMeta}>
            <span><Phone size={13} /> {patient.phone}</span>
            <span>
              <a href={`mailto:${patient.email}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', textDecoration: 'none' }}>
                <Mail size={13} /> {patient.email}
              </a>
            </span>
            <span><CalendarDays size={13} /> Lindur: {patient.dob}</span>
          </div>

          {/* Editable fields row */}
          <div className={styles.editableRow}>
            {/* Allergies */}
            <div className={styles.editableField}>
              <span className={styles.editableLabel}><AlertTriangle size={12} /> Alergjitë:</span>
              {editingField === 'allergies' ? (
                <div className={styles.editInline}>
                  <input
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                    placeholder="P.sh. Penicillinë, Latex..."
                    autoFocus
                  />
                  <button className={styles.saveBtn} onClick={() => saveEdit('allergies')}><Check size={14} /></button>
                  <button className={styles.cancelEditBtn} onClick={() => setEditingField(null)}><X size={14} /></button>
                </div>
              ) : (
                <div className={styles.editableValue}>
                  <span className={patient.allergies ? styles.allergyTag : styles.noValue}>
                    {patient.allergies || 'Nuk ka'}
                  </span>
                  <button className={styles.editIconBtn} onClick={() => startEdit('allergies', patient.allergies)}>
                    <Pencil size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Assigned Doctor */}
            <div className={styles.editableField}>
              <span className={styles.editableLabel}><Stethoscope size={12} /> Mjeku:</span>
              {editingField === 'doctor' ? (
                <div className={styles.editInline}>
                  <select value={tempValue} onChange={e => setTempValue(e.target.value)}>
                    {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <button className={styles.saveBtn} onClick={() => saveEdit('doctor')}><Check size={14} /></button>
                  <button className={styles.cancelEditBtn} onClick={() => setEditingField(null)}><X size={14} /></button>
                </div>
              ) : (
                <div className={styles.editableValue}>
                  <span className={styles.doctorTag}>{patient.doctor}</span>
                  <button className={styles.editIconBtn} onClick={() => startEdit('doctor', patient.doctor)}>
                    <Pencil size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className={styles.editableField} style={{ flexBasis: '100%' }}>
              <span className={styles.editableLabel}><Activity size={12} /> Shënime:</span>
              {editingField === 'notes' ? (
                <div className={styles.editInline}>
                  <input value={tempValue} onChange={e => setTempValue(e.target.value)} autoFocus />
                  <button className={styles.saveBtn} onClick={() => saveEdit('notes')}><Check size={14} /></button>
                  <button className={styles.cancelEditBtn} onClick={() => setEditingField(null)}><X size={14} /></button>
                </div>
              ) : (
                <div className={styles.editableValue}>
                  <span className={styles.notesText}>{patient.notes || 'Nuk ka shënime'}</span>
                  <button className={styles.editIconBtn} onClick={() => startEdit('notes', patient.notes)}>
                    <Pencil size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.patientActions}>
          <button className={styles.btnSecondary} onClick={() => setShowEditPatientModal(true)}>
            <Pencil size={15} /> Ndrysho të dhënat
          </button>
          <button className="btn-primary" onClick={() => setShowInvoiceModal(true)}>
            <CreditCard size={15} />
            Krijo Faturë
          </button>
          <Link href="/appointments" className={styles.btnSecondary}>
            <Plus size={15} />
            Shto Vizitë
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'Historiku' && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data</th><th>Dhëmbi</th><th>Trajtimi</th>
                  <th>Mjeku</th><th>Çmimi</th><th>Statusi</th>
                </tr>
              </thead>
              <tbody>
                {mockTreatments.map((t, i) => (
                  <tr key={i}>
                    <td>{t.date}</td>
                    <td><span className={styles.toothBadge}>#{t.tooth}</span></td>
                    <td><strong>{t.description}</strong></td>
                    <td>{t.doctor}</td>
                    <td><strong>{t.cost.toLocaleString()} L</strong></td>
                    <td>
                      <span className={`${styles.statusBadge} ${t.status === 'Kryer' ? styles.done : styles.planned}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Odontogrami 3D' && (
          <div className={styles.tableWrapper} style={{ padding: '20px' }}>
             <Odontogram3D />
          </div>
        )}

        {activeTab === 'Grafit (X-Ray)' && (
          <div className={styles.xraySection}>
            <div className={styles.xraySectionHeader}>
              <h2>Radiografi dhe Fotografi</h2>
              <input type="file" id="xrayUpload" accept="image/*" style={{ display: 'none' }} onChange={handleXrayUpload} />
              <label htmlFor="xrayUpload" className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={15} />
                Ngarko Grafi
              </label>
            </div>
            <div className={styles.xrayGrid}>
              <label htmlFor="xrayUpload" className={styles.uploadCard} style={{ cursor: 'pointer' }}>
                <Upload size={28} className={styles.uploadIcon} />
                <p>Kliko për të ngarkuar</p>
                <span>PNG, JPG, DICOM deri 50MB</span>
              </label>
              {xrays.map((xr: any, index) => (
                <div key={xr.id} className={styles.xrayCard} onClick={() => setLightbox({...xr, num: xrays.length - index})}>
                  <div className={styles.xrayThumb} style={{ background: `linear-gradient(135deg, ${xr.color}, ${xr.color}99)` }}>
                    {xr.imgSrc && <img src={xr.imgSrc} alt={xr.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, opacity: 0.8 }} />}
                    {/* Number badge */}
                    <div className={styles.xrayNumBadge}>#{xrays.length - index}</div>
                    {/* Date badge */}
                    <div className={styles.xrayDateBadge}>{xr.date}</div>
                    <div className={styles.xrayOverlay}>
                      <ZoomIn size={24} className={styles.zoomIcon} />
                    </div>
                    <div className={styles.xraySimulated}>
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className={styles.xrayLine} style={{ opacity: 0.1 + (i * 0.05), height: `${6 + Math.sin(i) * 3}px` }} />
                      ))}
                    </div>
                  </div>
                  <div className={styles.xrayInfo}>
                    <div className={styles.xrayTitleRow}>
                      <p className={styles.xrayTitle}>{xr.title}</p>
                    </div>
                    <p className={styles.xrayNotes}>{xr.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Fotografi (Para/Pas)' && (
          <div className={styles.xraySection}>
            <div className={styles.xraySectionHeader}>
              <h2>Krahasimi Para dhe Pas Trajtimit</h2>
              <p>Ngarko foto të buzëqeshjes së pacientit për të pasur prova vizuale të punës së kryer.</p>
            </div>
            
            <div className={styles.photoCompareGrid}>
              {/* Para Trajtimit */}
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={18}/> Para Trajtimit</h3>
                  <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '0.9rem' }}>
                    <Upload size={14} /> Ngarko
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, 'before')} />
                  </label>
                </div>
                {beforePhotos.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', border: '2px dashed #cbd5e1', borderRadius: '8px' }}>Nuk ka foto para trajtimit.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                    {beforePhotos.map(p => (
                      <div key={p.id} onClick={() => setLightbox(p)} style={{ position: 'relative', height: '200px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #cbd5e1' }}>
                        <img src={p.imgSrc} alt="Para" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px', fontSize: '0.85rem' }}>{p.date} - {p.notes}</div>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.2s', background: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '10px' }} className="hover-zoom">
                          <ZoomIn size={24} color="white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pas Trajtimit */}
              <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, color: '#22c55e', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={18}/> Pas Trajtimit</h3>
                  <label className="btn-primary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', fontSize: '0.9rem', backgroundColor: '#22c55e', borderColor: '#22c55e' }}>
                    <Upload size={14} /> Ngarko
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handlePhotoUpload(e, 'after')} />
                  </label>
                </div>
                {afterPhotos.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b', border: '2px dashed #86efac', borderRadius: '8px' }}>Nuk ka foto pas trajtimit.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                    {afterPhotos.map(p => (
                      <div key={p.id} onClick={() => setLightbox(p)} style={{ position: 'relative', height: '200px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #86efac' }}>
                        <img src={p.imgSrc} alt="Pas" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: '8px', fontSize: '0.85rem' }}>{p.date} - {p.notes}</div>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0, transition: 'opacity 0.2s', background: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '10px' }} className="hover-zoom">
                          <ZoomIn size={24} color="white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab content logic continues below */}        {activeTab === 'Recetat' && (
          <div className={styles.tableWrapper}>
            <div className={styles.financeHeader}>
              <div className={styles.financeSummary}>
                <h3>Historiku i Recetave</h3>
              </div>
              <button className="btn-primary" onClick={() => setShowPrescriptionModal(true)}>
                <Plus size={15} /> Recetë e Re
              </button>
            </div>
            <div className={styles.prescriptionsList}>
              {prescriptions.map(p => (
                <div key={p.id} className={styles.prescriptionCard}>
                  <div className={styles.prescriptionHeader}>
                    <span className={styles.prescriptionDate}><CalendarIcon size={14}/> {p.date}</span>
                    <span className={styles.prescriptionDoctor}><Stethoscope size={14}/> {p.doctor}</span>
                  </div>
                  <pre className={styles.prescriptionText}>{p.text}</pre>
                  <div className={styles.prescriptionActions}>
                    <button className={styles.whatsappBtn} onClick={() => window.open(`https://wa.me/${patient.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Përshëndetje ${patient.firstName}, kjo është receta juaj nga klinika Denthub.al:\n\n${p.text}`)}`, 'whatsappWindow', 'width=800,height=600,left=200,top=100')}>
                      <Phone size={14} /> Dërgo Recetën në WhatsApp
                    </button>
                  </div>
                </div>
              ))}
              {prescriptions.length === 0 && (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nuk ka receta të regjistruara për këtë pacient.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Financat' && (
          <div className={styles.tableWrapper}>
            <div className={styles.financeHeader}>
              <div className={styles.financeSummary}>
                <div className={styles.financeCard}><p>Total i Faturuar</p><h3>{invoicesList.reduce((acc, inv) => acc + inv.amount, 0).toLocaleString()} L</h3></div>
                <div className={styles.financeCard}><p>Paguar</p><h3 style={{ color: 'var(--primary-color)' }}>{invoicesList.reduce((acc, inv) => acc + inv.paid, 0).toLocaleString()} L</h3></div>
                <div className={styles.financeCard}><p>Balancë</p><h3 style={{ color: 'var(--danger-color)' }}>{invoicesList.reduce((acc, inv) => acc + (inv.amount - inv.paid), 0).toLocaleString()} L</h3></div>
              </div>
              <button className="btn-primary" onClick={() => setShowInvoiceModal(true)}>
                <FileText size={15} /> Faturë e Re
              </button>
            </div>
            <table className={styles.table}>
              <thead><tr><th>Data</th><th>Shërbimi</th><th>Shuma</th><th>Paguar</th><th>Statusi</th></tr></thead>
              <tbody>
                {invoicesList.map(inv => (
                  <tr key={inv.id}>
                    <td>{inv.date}</td><td>{inv.service}</td><td>{inv.amount.toLocaleString()} L</td><td>{inv.paid.toLocaleString()} L</td>
                    <td>
                      <span className={`${styles.statusBadge} ${inv.status === 'Paguar' ? styles.done : inv.status === 'Pa Paguar' ? styles.missed : styles.planned}`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* X-Ray Lightbox */}
      {lightbox && (
        <div className={styles.lightboxOverlay} onClick={() => setLightbox(null)}>
          <button className={styles.lightboxCloseBtn} onClick={() => setLightbox(null)}><X size={32} /></button>
          <div className={styles.lightbox} onClick={e => e.stopPropagation()}>
            <div className={styles.lightboxImage} style={{ background: `linear-gradient(135deg, ${lightbox.color}, ${lightbox.color}bb)`, position: 'relative', overflow: 'hidden' }}>
              {/* Zoom Controls (Always visible) */}
              <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, zIndex: 10 }}>
                <button className="btn-primary" onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))} style={{ padding: '8px' }}><ZoomIn size={18} /></button>
                <button className="btn-primary" onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))} style={{ padding: '8px' }}><ZoomOut size={18} /></button>
                <button className="btn-primary" onClick={() => setZoomLevel(1)} style={{ padding: '8px' }}><Maximize2 size={18} /></button>
              </div>
              
              <div style={{ 
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                overflow: zoomLevel > 1 ? 'auto' : 'hidden',
                transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease', cursor: zoomLevel > 1 ? 'grab' : 'default'
              }}>
                {lightbox.imgSrc ? (
                  <img 
                    src={lightbox.imgSrc} 
                    alt={lightbox.title} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  />
                ) : (
                  <>
                    <p className={styles.lightboxPlaceholderText}>{lightbox.title}</p>
                    <div className={styles.lightboxGrid}>
                      {Array.from({ length: 16 }, (_, i) => (
                        <div key={i} className={styles.lightboxCell} style={{ opacity: 0.05 + Math.random() * 0.2 }} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.lightboxMeta}>
              <h3>{lightbox.title}</h3>
              <p>{lightbox.date}</p>
              <p className={styles.lightboxNotes}>{lightbox.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className={styles.modalOverlay} onClick={() => setShowInvoiceModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Krijo Faturë të Re</h2>
              <button className={styles.closeBtn} onClick={() => setShowInvoiceModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleInvoice} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Shërbimi / Trajtimi</label>
                <select value={invoice.service} onChange={e => {
                  const svc = services.find(s => s.name === e.target.value);
                  setInvoice({...invoice, service: e.target.value, amount: svc ? String(svc.price) : ''});
                }} required>
                  <option value="">Zgjidh Shërbimin...</option>
                  {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Shuma (L)</label>
                <input type="number" placeholder="0" value={invoice.amount} onChange={e => setInvoice({...invoice, amount: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Shënime</label>
                <textarea placeholder="Shënime shtesë..." value={invoice.notes} onChange={e => setInvoice({...invoice, notes: e.target.value})} rows={3} />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowInvoiceModal(false)}>Anulo</button>
                <button type="submit" className="btn-primary">Ruaj & Faturë</button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {/* Edit Patient Modal */}
      {showEditPatientModal && (
        <div className={styles.modalOverlay} onClick={() => setShowEditPatientModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Ndrysho të Dhënat e Pacientit</h2>
              <button className={styles.closeBtn} onClick={() => setShowEditPatientModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditPatientSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Emri</label>
                <input type="text" value={editPatientForm.firstName} onChange={e => setEditPatientForm({...editPatientForm, firstName: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Mbiemri</label>
                <input type="text" value={editPatientForm.lastName} onChange={e => setEditPatientForm({...editPatientForm, lastName: e.target.value})} required />
              </div>
              <div className={styles.formGroup}>
                <label>Telefoni</label>
                <input type="text" value={editPatientForm.phone} onChange={e => setEditPatientForm({...editPatientForm, phone: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" value={editPatientForm.email} onChange={e => setEditPatientForm({...editPatientForm, email: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Datëlindja</label>
                <input type="text" value={editPatientForm.dob} onChange={e => setEditPatientForm({...editPatientForm, dob: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Adresa</label>
                <input type="text" value={editPatientForm.address} onChange={e => setEditPatientForm({...editPatientForm, address: e.target.value})} />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowEditPatientModal(false)}>Anulo</button>
                <button type="submit" className="btn-primary">Ruaj Ndryshimet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPrescriptionModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Shkruaj Recetë të Re</h2>
              <button className={styles.closeBtn} onClick={() => setShowPrescriptionModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handlePrescriptionSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Barnat dhe Përdorimi</label>
                <textarea 
                  placeholder="P.sh. Amoxicillin 500mg, 1 tabletë çdo 8 orë..." 
                  value={newPrescription} 
                  onChange={e => setNewPrescription(e.target.value)} 
                  required 
                  rows={6}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', color: '#1f2937', resize: 'vertical' }}
                />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowPrescriptionModal(false)}>Anulo</button>
                <button type="submit" className="btn-primary">Ruaj Recetën</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
