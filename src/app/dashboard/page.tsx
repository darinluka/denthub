'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, CalendarCheck, Banknote, Bell, Plus, CalendarPlus,
  FileText, Clock, ChevronRight, X, User, Phone, Mail, Stethoscope,
  CreditCard, MessageCircle, FlaskConical, AlertTriangle, Calendar,
  Shield, Building, ArrowRight, Search, MapPin, UserCog
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import styles from './page.module.css';
import { sendTelegramNotification } from '@/lib/telegram';

const REVENUE_DATA = [
  { name: 'Hën', vizita: 12, te_ardhura: 45000 },
  { name: 'Mar', vizita: 19, te_ardhura: 82000 },
  { name: 'Mër', vizita: 15, te_ardhura: 60000 },
  { name: 'Enj', vizita: 22, te_ardhura: 95000 },
  { name: 'Pre', vizita: 25, te_ardhura: 110000 },
  { name: 'Sht', vizita: 30, te_ardhura: 140000 },
  { name: 'Die', vizita: 8, te_ardhura: 25000 },
];

const TREATMENT_DATA = [
  { name: 'Mbushje', value: 45 },
  { name: 'Pastrim', value: 25 },
  { name: 'Kirurgji', value: 15 },
  { name: 'Ortodonci', value: 10 },
  { name: 'Zbardhim', value: 5 },
];
const COLORS = ['#0ea5e9', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b'];

const MODAL_TYPES = {
  PATIENT: 'patient',
  VISIT: 'visit',
  INVOICE: 'invoice',
};

const MOCK_PATIENTS = [
  { id: '1', name: 'Agim Ramadani' },
  { id: '2', name: 'Teuta Kelmendi' },
  { id: '3', name: 'Dritan Hoxha' },
];


export default function Home() {
  const [services, setServices] = useState<any[]>([]);
  const [modal, setModal] = useState<string | null>(null);
  const [patientForm, setPatientForm] = useState({ firstName: '', lastName: '', phone: '', whatsapp: '', email: '', dob: '' });
  const [visitForm, setVisitForm] = useState({ patient: '', treatment: '', date: '', time: '09:00' });
  const [invoiceForm, setInvoiceForm] = useState({ patient: '', service: '', amount: '' });
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [dashboardAppts, setDashboardAppts] = useState<any[]>([]);
  const [allAppts, setAllAppts] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [regRequests, setRegRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsMounted(true);
    const initialPatients = [
      { id: '1', firstName: 'Agim', lastName: 'Ramadani', phone: '+355 69 123 4567', email: 'agim@email.com', dob: '1985-04-12', lastVisit: '10 Qershor 2026', nextVisit: '22 Qershor 2026' },
      { id: '2', firstName: 'Teuta', lastName: 'Kelmendi', phone: '+355 68 987 6543', email: 'teuta@email.com', dob: '1990-08-22', lastVisit: '15 Maj 2026', nextVisit: '22 Qershor 2026' },
      { id: '3', firstName: 'Dritan', lastName: 'Hoxha', phone: '+355 67 456 7890', email: '', dob: '1978-01-30', lastVisit: '2 Prill 2026', nextVisit: 'E pacaktuar' },
    ];
    try {
      const saved = localStorage.getItem('patients_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPatients(parsed);
        } else {
          setPatients(initialPatients);
        }
      } else {
        setPatients(initialPatients);
      }
    } catch (e) {
      console.error('Failed to parse patients:', e);
      setPatients(initialPatients);
    }

    // Load Appointments
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const defaultAppts = [
      { id: 1, patient: 'Agim Ramadani', treatment: 'Pastrim Gurëzash', doctor: 'Dr. Agimi', date: todayStr, time: '09:00', duration: '90', type: 'treatment', status: 'Në pritje', statusClass: 'statusPending' },
      { id: 2, patient: 'Teuta Kelmendi', treatment: 'Konsultë & Grafi', doctor: 'Dr. Agimi', date: todayStr, time: '11:30', duration: '45', type: 'consultation', status: 'Planifikuar', statusClass: 'statusScheduled' },
      { id: 3, patient: 'Dritan Hoxha', treatment: 'Implant (Dhëmbi 46)', doctor: 'Dr. Agimi', date: todayStr, time: '14:00', duration: '120', type: 'surgery', status: 'Planifikuar', statusClass: 'statusScheduled' },
    ];
    let loadedAppts = defaultAppts;
    try {
      const savedAppts = localStorage.getItem('appointments_list');
      if (savedAppts) {
        const parsed = JSON.parse(savedAppts);
        if (Array.isArray(parsed)) {
          loadedAppts = parsed;
        }
      } else {
        localStorage.setItem('appointments_list', JSON.stringify(defaultAppts));
      }
    } catch (e) {
      console.error('Failed to parse appointments:', e);
    }
    
    const todayAppts = loadedAppts
      .filter((a: any) => a.date === todayStr)
      .sort((a: any, b: any) => a.time.localeCompare(b.time));
    setDashboardAppts(todayAppts);
    setAllAppts(loadedAppts);

    // Load Services
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
        }
      }
      localStorage.setItem('services_list', JSON.stringify(defaultServices));
      setServices(defaultServices);
    } catch (e) {
      console.error(e);
      setServices(defaultServices);
    }

    // Load user role
    setUserRole(localStorage.getItem('user_role'));

    // Load registration requests
    try {
      const savedReqs = localStorage.getItem('registration_requests');
      if (savedReqs) {
        setRegRequests(JSON.parse(savedReqs));
      } else {
        const defaultRequests = [
          { id: 'req_1', firstName: 'Bledar', lastName: 'Çeliku', email: 'contact@dentasmile.com', phone: '+355 69 444 3322', clinicName: 'Klinika DentaSmile', clinicCity: 'Durrës', status: 'pending', createdAt: '02/07/2026 10:15' },
          { id: 'req_2', firstName: 'Valbona', lastName: 'Shkurti', email: 'valbona@ortodent.al', phone: '+355 68 555 7788', clinicName: 'OrtoDent Vlorë', clinicCity: 'Vlorë', status: 'pending', createdAt: '03/07/2026 09:30' },
          { id: 'req_3', firstName: 'Ermal', lastName: 'Kasa', email: 'info@dentalart-tirana.com', phone: '+355 67 222 1199', clinicName: 'DentalArt Tirana', clinicCity: 'Tiranë', status: 'approved', createdAt: '28/06/2026 14:05' },
          { id: 'req_4', firstName: 'Blerina', lastName: 'Rama', email: 'dr.blerina@elitedental.al', phone: '+355 69 888 7766', clinicName: 'Elite Dental Clinic', clinicCity: 'Fier', status: 'approved', createdAt: '25/06/2026 11:20' }
        ];
        localStorage.setItem('registration_requests', JSON.stringify(defaultRequests));
        setRegRequests(defaultRequests);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const closeModal = () => setModal(null);

  const handlePatient = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let currentPatients = patients;
    try {
      const saved = localStorage.getItem('patients_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentPatients = parsed;
        }
      }
    } catch (err) {
      console.error('Failed to parse patients:', err);
    }

    if (patientForm.email) {
      const exists = currentPatients.some(p => p.email && p.email.toLowerCase() === patientForm.email.toLowerCase());
      if (exists) {
        setError('Ky email ekziston tashmë! Nuk mund të regjistrohen dy pacientë me të njëjtin email.');
        return;
      }
    }

    const newId = String(Date.now());
    const newPatient = {
      id: newId,
      firstName: patientForm.firstName,
      lastName: patientForm.lastName,
      phone: patientForm.phone,
      whatsapp: patientForm.whatsapp,
      email: patientForm.email,
      dob: patientForm.dob,
      lastVisit: '—',
      nextVisit: 'E pacaktuar'
    };

    const newPatientsList = [...currentPatients, newPatient];
    setPatients(newPatientsList);
    localStorage.setItem('patients_list', JSON.stringify(newPatientsList));

    // Send Telegram Notification
    sendTelegramNotification(`👤 <b>Pacient i Ri</b>\nEmri: ${patientForm.firstName} ${patientForm.lastName}\nTelefon: ${patientForm.phone}\nEmail: ${patientForm.email || '—'}`);

    closeModal();
    showToast(`✅ Pacienti "${patientForm.firstName} ${patientForm.lastName}" u regjistrua me sukses!`);
    setPatientForm({ firstName: '', lastName: '', phone: '', whatsapp: '', email: '', dob: '' });
  };

  const handleVisit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let currentAppts: any[] = [];
    try {
      const saved = localStorage.getItem('appointments_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          currentAppts = parsed;
        }
      } else {
        const todayStr = new Date().toISOString().split('T')[0];
        currentAppts = [
          { id: 1, patient: 'Agim Ramadani', treatment: 'Pastrim Gurëzash', doctor: 'Dr. Agimi', date: todayStr, time: '09:00', duration: '90', type: 'treatment', status: 'Në pritje', statusClass: 'statusPending' },
          { id: 2, patient: 'Teuta Kelmendi', treatment: 'Konsultë & Grafi', doctor: 'Dr. Agimi', date: todayStr, time: '11:30', duration: '45', type: 'consultation', status: 'Planifikuar', statusClass: 'statusScheduled' },
          { id: 3, patient: 'Dritan Hoxha', treatment: 'Implant (Dhëmbi 46)', doctor: 'Dr. Agimi', date: todayStr, time: '14:00', duration: '120', type: 'surgery', status: 'Planifikuar', statusClass: 'statusScheduled' },
        ];
      }
    } catch (err) {
      console.error('Failed to parse appointments:', err);
    }

    const newAppt = {
      id: Date.now(),
      patient: visitForm.patient,
      treatment: visitForm.treatment,
      doctor: 'Dr. Agimi',
      date: visitForm.date,
      time: visitForm.time,
      duration: '60',
      type: 'treatment',
      status: 'Planifikuar',
      statusClass: 'statusScheduled'
    };

    const newList = [...currentAppts, newAppt];
    localStorage.setItem('appointments_list', JSON.stringify(newList));
    setAllAppts(newList);
    
    // Update dashboard state for today
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppts = newList
      .filter((a: any) => a.date === todayStr)
      .sort((a: any, b: any) => a.time.localeCompare(b.time));
    setDashboardAppts(todayAppts);
    
    // Fetch patient info for Telegram notification
    let patientPhone = '—';
    let patientEmail = '—';
    try {
      const savedPatients = localStorage.getItem('patients_list');
      if (savedPatients) {
        const parsed = JSON.parse(savedPatients);
        if (Array.isArray(parsed)) {
          const patientObj = parsed.find((p: any) => `${p.firstName} ${p.lastName}` === visitForm.patient);
          if (patientObj) {
            patientPhone = patientObj.phone || '—';
            patientEmail = patientObj.email || '—';
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    
    // Send Telegram Notification with patient contact info
    sendTelegramNotification(`📅 <b>Vizitë e Re</b>\nPacienti: ${visitForm.patient}\nTelefon: ${patientPhone}\nEmail: ${patientEmail}\nTrajtimi: ${visitForm.treatment}\nData: ${visitForm.date} ora ${visitForm.time}`);

    closeModal();
    showToast(`✅ Vizita u shtua për "${visitForm.patient}" në ${visitForm.date} ora ${visitForm.time}`);
    setVisitForm({ patient: '', treatment: '', date: '', time: '09:00' });
  };

  const handleInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
    showToast(`✅ Fatura për "${invoiceForm.patient}" - ${invoiceForm.amount} L u krijua!`);
    
    // Simulate print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Fatura - ${invoiceForm.patient}</title>
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
              <p><strong>Pacienti:</strong> ${invoiceForm.patient}</p>
              <p><strong>Data:</strong> ${new Date().toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p><strong>Shërbimi/Trajtimi:</strong> ${invoiceForm.service}</p>
              <p style="font-size:1.3rem; margin-top: 20px;"><strong>Shuma Totale:</strong> ${Number(invoiceForm.amount).toLocaleString()} Lekë</p>
            </div>
            <div class="footer">Faleminderit që zgjodhët klinikën tonë!</div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
    setInvoiceForm({ patient: '', service: '', amount: '' });
  };

  const todayStr = new Date().toLocaleDateString('sq-AL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (!isMounted) return null;

  if (userRole === 'super_admin') {
    const pendingReqs = regRequests.filter(r => r.status === 'pending');
    const approvedClinics = regRequests.filter(r => r.status === 'approved');
    const totalClinics = approvedClinics.length + 1; // +1 for central master
    const pendingCount = pendingReqs.length;

    // Define all clinics with dynamic mock stats based on their unique IDs
    const allClinics = [
      {
        id: 'master',
        clinicName: 'Denthub.al (Klinika Master)',
        owner: 'Dr. Agim Hoxha',
        email: 'info@denthub.al',
        phone: '+355 69 123 4567',
        city: 'Tiranë',
        status: 'Aktive',
        statusText: 'Sistem Qendror',
        doctors: 4,
        patients: 342,
        appointments: 185,
        income: '2,450,000 L',
        statusBg: '#ecfdf5',
        statusColor: '#059669'
      },
      ...regRequests.map(r => {
        const idNum = parseInt(r.id.replace(/\D/g, '')) || 5;
        // Deterministic stats per clinic
        const docCount = (idNum % 3) + 2; // 2 to 4 doctors
        const patCount = (idNum % 200) + 60; // 60 to 260 patients
        const apptCount = (idNum % 100) + 30; // 30 to 130 appointments
        const incVal = ((idNum % 40) + 15) * 25000; // e.g. 375,000 to 1,375,000 L
        
        return {
          id: r.id,
          clinicName: r.clinicName,
          owner: `${r.firstName} ${r.lastName}`,
          email: r.email,
          phone: r.phone,
          city: r.clinicCity,
          status: r.status === 'approved' ? 'Aktive' : (r.status === 'pending' ? 'Në Pritje' : 'Refuzuar'),
          statusText: r.status === 'approved' ? 'Aktive' : (r.status === 'pending' ? 'Në Pritje' : 'Refuzuar'),
          doctors: docCount,
          patients: patCount,
          appointments: apptCount,
          income: incVal.toLocaleString() + ' Lekë',
          statusBg: r.status === 'approved' ? '#ecfdf5' : (r.status === 'pending' ? '#fffbeb' : '#fef2f2'),
          statusColor: r.status === 'approved' ? '#059669' : (r.status === 'pending' ? '#d97706' : '#dc2626')
        };
      })
    ];

    const filteredClinics = allClinics.filter(c => 
      c.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className={styles.dashboard}>
        <header className={styles.pageHeader} style={{ marginBottom: '8px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(220, 38, 38, 0.08)', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '4px 10px', borderRadius: '99px', marginBottom: '8px', border: '1px solid rgba(220, 38, 38, 0.15)' }}>
              <Shield size={12} /> Super Admin Dashboard
            </div>
            <h1>Monitorimi Global i Klinikave</h1>
            <p className={styles.date}>Menaxhoni dhe ndiqni statistikat e klinikave të regjistruara në sistem.</p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/superadmin" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <Building size={16} /> Menaxho Kërkesat ({pendingCount})
            </Link>
          </div>
        </header>

        {/* Global Summary Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrap} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Building size={22} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Klinika Aktive</p>
              <h3 className={styles.statValue}>{totalClinics}</h3>
              <p className={styles.statTrend}>Master + Aprovuara</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrap} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Clock size={22} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Kërkesa në Pritje</p>
              <h3 className={styles.statValue} style={{ color: '#f59e0b' }}>{pendingCount}</h3>
              <p className={styles.statTrend}>Presin konfirmim</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrap} style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
              <Users size={22} />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Total Pacientë (Global)</p>
              <h3 className={styles.statValue} style={{ color: '#7c3aed' }}>
                {allClinics.reduce((acc, c) => acc + c.patients, 0)}
              </h3>
              <p className={styles.statTrend}>Në të gjitha klinikat</p>
            </div>
          </div>
        </div>

        {/* Search Clinics Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '500px', marginTop: '8px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text"
            placeholder="Kërko klinikë sipas emrit, doktorit ose qytetit..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '14px 16px 14px 46px', fontSize: '0.95rem', borderRadius: '12px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--surface-color)', color: 'var(--text-main)', transition: 'border-color 0.2s', boxShadow: 'var(--shadow-sm)' }}
            onFocus={e => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        {/* Clinics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px', marginTop: '8px' }}>
          {filteredClinics.length > 0 ? (
            filteredClinics.map(c => (
              <div 
                key={c.id} 
                style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{c.clinicName}</h3>
                    <span style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={10} /> {c.city}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, backgroundColor: c.statusBg, color: c.statusColor, padding: '4px 10px', borderRadius: '99px' }}>
                    {c.statusText}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={13} /> <strong>Pronari:</strong> {c.owner}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={13} /> <strong>Email:</strong> {c.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={13} /> <strong>Telefon:</strong> {c.phone}</div>
                </div>

                {/* Summarized Statistics */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Statistikat e Klinikës</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ backgroundColor: 'var(--background-color)', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: '#0ea5e9' }}><UserCog size={16} /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mjekë/Staf</span>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{c.doctors} mjekë</strong>
                      </div>
                    </div>
                    
                    <div style={{ backgroundColor: 'var(--background-color)', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: '#10b981' }}><Users size={16} /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pacientë</span>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{c.patients}</strong>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--background-color)', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: '#f59e0b' }}><Calendar size={16} /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rezervime</span>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{c.appointments} takime</strong>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--background-color)', padding: '10px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: '#7c3aed' }}><Banknote size={16} /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Të Ardhurat</span>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{c.income}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', padding: '40px', backgroundColor: 'var(--surface-color)', border: '1px dashed var(--border-color)', borderRadius: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Nuk u gjet asnjë klinikë me emrin apo qytetin "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}

      <header className={styles.pageHeader}>
        <div>
          <h1>Dashboard</h1>
          <p className={styles.date} suppressHydrationWarning>{todayStr}</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn-primary" onClick={() => setModal(MODAL_TYPES.VISIT)}>
            <Plus size={16} />
            Shto Vizitë
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ backgroundColor: 'rgba(5,150,105,0.1)', color: '#059669' }}>
            <Users size={22} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Pacientët e Sotëm</p>
            <h3 className={styles.statValue}>12</h3>
            <p className={styles.statTrend}>↑ 3 më shumë se dje</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ backgroundColor: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>
            <CalendarCheck size={22} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Vizitat e Ardhshme</p>
            <h3 className={styles.statValue}>5</h3>
            <p className={styles.statTrend}>Deri në fund të ditës</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
            <Banknote size={22} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Të Ardhurat (Sot)</p>
            <h3 className={styles.statValue}>45,000 L</h3>
            <p className={styles.statTrend}>↑ +12% nga javë e kaluar</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            <FlaskConical size={22} />
          </div>
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Porosi Lab Gati</p>
            <h3 className={styles.statValue}>2</h3>
            <Link href="/lab" style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: 600 }}>Shiko porositë →</Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2>Veprime të Shpejta</h2>
        <div className={styles.actionsGrid}>
          <button className={styles.quickBtn} onClick={() => setModal(MODAL_TYPES.PATIENT)}>
            <span className={styles.quickBtnIcon} style={{ backgroundColor: 'rgba(5,150,105,0.1)', color: '#059669' }}>
              <Plus size={18} />
            </span>
            <span>Shto Pacient</span>
          </button>
          <button className={styles.quickBtn} onClick={() => setModal(MODAL_TYPES.VISIT)}>
            <span className={styles.quickBtnIcon} style={{ backgroundColor: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>
              <CalendarPlus size={18} />
            </span>
            <span>Shto Vizitë</span>
          </button>
          <button className={styles.quickBtn} onClick={() => setModal(MODAL_TYPES.INVOICE)}>
            <span className={styles.quickBtnIcon} style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
              <FileText size={18} />
            </span>
            <span>Krijo Faturë</span>
          </button>
        </div>
      </div>

      {/* Recent appointments */}
      <div className={styles.recentActivity}>
        <div className={styles.sectionHeader}>
          <h2>Vizitat e Rradhës</h2>
          <Link href="/appointments" className={styles.viewAll}>
            Shiko të gjitha <ChevronRight size={14} />
          </Link>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ora</th><th>Pacienti</th><th>Trajtimi</th><th>Mjeku</th><th>Statusi</th>
              </tr>
            </thead>
            <tbody>
              {dashboardAppts.map((r, i) => (
                <tr key={r.id || i}>
                  <td><span className={styles.timeCell}><Clock size={14} />{r.time}</span></td>
                  <td><strong>{r.patient}</strong></td>
                  <td>{r.treatment}</td>
                  <td>{r.doctor}</td>
                  <td><span className={`${styles.status} ${styles[r.statusClass || 'statusScheduled']}`}>{r.status || 'Planifikuar'}</span></td>
                </tr>
              ))}
              {dashboardAppts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    Nuk ka vizita të planifikuara për sot.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistikat me Charta */}
      <div className="fade-in">
      <div style={{ marginTop: '32px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '16px', fontWeight: 600 }}>Statistikat e Klinikës</h2>
        <div className={styles.chartsGrid}>
          
          {/* Revenue Chart */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)' }}>
            <h3 style={{ fontSize: '1rem', color: '#475569', marginBottom: '20px', fontWeight: 600 }}>Të Ardhurat (Këtë Javë)</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `${value / 1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [`${Number(value || 0).toLocaleString()} L`, 'Të Ardhurat']}
                  />
                  <Area type="monotone" dataKey="te_ardhura" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Treatments Pie Chart */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)' }}>
            <h3 style={{ fontSize: '1rem', color: '#475569', marginBottom: '20px', fontWeight: 600 }}>Ndarja e Trajtimeve</h3>
            <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart style={{ outline: 'none' }}>
                  <Pie
                    data={TREATMENT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {TREATMENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [`${value} Vizita`, '']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Quick Actions */}
      </div>

      {/* ---- MODALS ---- */}
      {modal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>

            {/* ADD PATIENT */}
            {modal === MODAL_TYPES.PATIENT && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleRow}>
                    <div className={styles.modalIcon} style={{ backgroundColor: 'rgba(5,150,105,0.1)', color: '#059669' }}><User size={18} /></div>
                    <h2>Shto Pacient të Ri</h2>
                  </div>
                  <button className={styles.closeBtn} onClick={() => { closeModal(); setError(''); }}><X size={20} /></button>
                </div>
                {error && <div className={styles.errorAlert}><AlertTriangle size={16}/> {error}</div>}
                <form onSubmit={handlePatient} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label><User size={14} /> Emri</label>
                      <input type="text" placeholder="Emri" value={patientForm.firstName} onChange={e => setPatientForm({...patientForm, firstName: e.target.value})} required autoFocus />
                    </div>
                    <div className={styles.formGroup}>
                      <label><User size={14} /> Mbiemri</label>
                      <input type="text" placeholder="Mbiemri" value={patientForm.lastName} onChange={e => setPatientForm({...patientForm, lastName: e.target.value})} required />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label><Phone size={14} /> Numri i Telefonit *</label>
                    <input type="tel" placeholder="+355 69 000 0000" value={patientForm.phone} onChange={e => setPatientForm({...patientForm, phone: e.target.value})} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label><MessageCircle size={14} /> Nr. WhatsApp (nëse ndryshon)</label>
                    <input type="tel" placeholder="Nëse ndryshon nga nr. cel..." value={patientForm.whatsapp} onChange={e => setPatientForm({...patientForm, whatsapp: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label><Mail size={14} /> Email (opsional)</label>
                    <input type="email" placeholder="email@shembull.com" value={patientForm.email} onChange={e => setPatientForm({...patientForm, email: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label><Calendar size={14} /> Data e Lindjes</label>
                    <input type="date" value={patientForm.dob} onChange={e => setPatientForm({...patientForm, dob: e.target.value})} />
                  </div>
                  <div className={styles.formActions}>
                    <button type="button" className={styles.cancelBtn} onClick={closeModal}>Anulo</button>
                    <button type="submit" className="btn-primary"><Plus size={15} /> Regjistro</button>
                  </div>
                </form>
              </>
            )}

            {/* ADD VISIT */}
            {modal === MODAL_TYPES.VISIT && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleRow}>
                    <div className={styles.modalIcon} style={{ backgroundColor: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}><CalendarPlus size={18} /></div>
                    <h2>Shto Vizitë të Re</h2>
                  </div>
                  <button className={styles.closeBtn} onClick={closeModal}><X size={20} /></button>
                </div>
                <form onSubmit={handleVisit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label><User size={14} /> Emri Pacientit</label>
                    <select value={visitForm.patient} onChange={e => setVisitForm({...visitForm, patient: e.target.value})} required autoFocus>
                      <option value="">Zgjidh Pacientin...</option>
                      {patients.map(p => {
                        const fullName = `${p.firstName} ${p.lastName}`;
                        return <option key={p.id} value={fullName}>{fullName}</option>;
                      })}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label><Stethoscope size={14} /> Trajtimi</label>
                    <select value={visitForm.treatment} onChange={e => setVisitForm({...visitForm, treatment: e.target.value})} required>
                      <option value="">Zgjidh Shërbimin...</option>
                      {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Data</label>
                      <input type="date" value={visitForm.date} onChange={e => setVisitForm({...visitForm, date: e.target.value})} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Ora</label>
                      <select value={visitForm.time} onChange={e => setVisitForm({...visitForm, time: e.target.value})} required>
                        {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"].map(t => {
                          const isBooked = allAppts.some(a => a.date === visitForm.date && a.time === t);
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
                    <button type="button" className={styles.cancelBtn} onClick={closeModal}>Anulo</button>
                    <button type="submit" className="btn-primary"><CalendarPlus size={15} /> Shto Vizitën</button>
                  </div>
                </form>
              </>
            )}

            {/* CREATE INVOICE */}
            {modal === MODAL_TYPES.INVOICE && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleRow}>
                    <div className={styles.modalIcon} style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}><CreditCard size={18} /></div>
                    <h2>Krijo Faturë të Re</h2>
                  </div>
                  <button className={styles.closeBtn} onClick={closeModal}><X size={20} /></button>
                </div>
                <form onSubmit={handleInvoice} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label><User size={14} /> Pacienti</label>
                    <select value={invoiceForm.patient} onChange={e => setInvoiceForm({...invoiceForm, patient: e.target.value})} required autoFocus>
                      <option value="">Zgjidh Pacientin...</option>
                      {patients.map(p => {
                        const fullName = `${p.firstName} ${p.lastName}`;
                        return <option key={p.id} value={fullName}>{fullName}</option>;
                      })}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label><FileText size={14} /> Shërbimi / Trajtimi</label>
                    <select value={invoiceForm.service} onChange={e => {
                      const svc = services.find(s => s.name === e.target.value);
                      setInvoiceForm({...invoiceForm, service: e.target.value, amount: svc ? String(svc.price) : ''});
                    }} required>
                      <option value="">Zgjidh Shërbimin...</option>
                      {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label><Banknote size={14} /> Shuma (L)</label>
                    <input type="number" placeholder="0" value={invoiceForm.amount} onChange={e => setInvoiceForm({...invoiceForm, amount: e.target.value})} required />
                  </div>
                  <div className={styles.formActions}>
                    <button type="button" className={styles.cancelBtn} onClick={closeModal}>Anulo</button>
                    <button type="submit" className="btn-primary"><FileText size={15} /> Gjenero Faturën</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
