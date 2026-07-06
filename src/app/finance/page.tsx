'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Download, Filter, TrendingUp, TrendingDown, Banknote,
  Clock, Plus, X, FileText, User, CheckCircle
} from 'lucide-react';
import styles from './finance.module.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
const COLORS = ['#0ea5e9', '#10b981', '#f43f5e', '#8b5cf6', '#f59e0b', '#14b8a6', '#6366f1'];


type Transaction = {
  id: string;
  date: string; // YYYY-MM-DD
  dateLabel: string;
  patient: string;
  service: string;
  amount: number;
  paid: number;
  method: 'Cash' | 'Kartë' | 'Transfer';
  status: 'Paguar' | 'Pjesërisht' | 'Pa Paguar';
};

const MONTHS = [
  'Janar','Shkurt','Mars','Prill','Maj','Qershor',
  'Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor'
];

const MOCK_PATIENTS = [
  { id: '1', name: 'Agim Ramadani' },
  { id: '2', name: 'Teuta Kelmendi' },
  { id: '3', name: 'Dritan Hoxha' },
];

const MOCK_SERVICES = [
  { id: '1', name: 'Pastrim Gurëzash', price: 4000 },
  { id: '2', name: 'Mbushje Kompozit (E Vogël)', price: 5000 },
  { id: '3', name: 'Mbushje Kompozit (E Madhe)', price: 6000 },
  { id: '4', name: 'Mjekim Kanali (Dhëmb Tek)', price: 8000 },
  { id: '5', name: 'Ekstraksion i Thjeshtë', price: 3000 },
  { id: '6', name: 'Kurorë Zirkoni', price: 20000 },
];

const allTransactions: Transaction[] = [
  { id:'1', date:'2026-06-10', dateLabel:'10 Qer 2026', patient:'Agim Ramadani', service:'Pastrim Gurëzash', amount:4000, paid:4000, method:'Cash', status:'Paguar' },
  { id:'2', date:'2026-06-12', dateLabel:'12 Qer 2026', patient:'Teuta Kelmendi', service:'Mjekim Kanali', amount:15000, paid:8000, method:'Kartë', status:'Pjesërisht' },
  { id:'3', date:'2026-06-14', dateLabel:'14 Qer 2026', patient:'Dritan Hoxha', service:'Kurorë Porcelani', amount:25000, paid:25000, method:'Transfer', status:'Paguar' },
  { id:'4', date:'2026-06-18', dateLabel:'18 Qer 2026', patient:'Blerina Koci', service:'Mbushje Kompozit', amount:6000, paid:0, method:'Cash', status:'Pa Paguar' },
  { id:'5', date:'2026-06-20', dateLabel:'20 Qer 2026', patient:'Erion Daci', service:'Pastrim + Konsultë', amount:5500, paid:5500, method:'Cash', status:'Paguar' },
  { id:'6', date:'2026-05-05', dateLabel:'5 Maj 2026', patient:'Agim Ramadani', service:'Implant (32)', amount:80000, paid:80000, method:'Transfer', status:'Paguar' },
  { id:'7', date:'2026-05-15', dateLabel:'15 Maj 2026', patient:'Vera Shala', service:'Protezë e Plotë', amount:35000, paid:20000, method:'Cash', status:'Pjesërisht' },
];

function exportToCSV(rows: Transaction[], label: string) {
  const BOM = '\uFEFF'; // UTF-8 BOM for Albanian characters in Excel
  const headers = ['ID', 'Data', 'Pacienti', 'Shërbimi', 'Shuma (L)', 'Paguar (L)', 'Metodë', 'Statusi'];
  const lines = rows.map(r => [
    r.id, r.dateLabel, r.patient, r.service, r.amount, r.paid, r.method, r.status
  ].map(v => `"${v}"`).join(','));
  const csv = BOM + [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Financat_${label.replace(/\s/g, '_')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FinancePage() {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patient: '', service: '', amount: '', method: 'Cash' as const, date: '' });
  const [transactions, setTransactions] = useState<Transaction[]>(allTransactions);
  const [toast, setToast] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

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
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse patients:', e);
    }
    setPatients(initialPatients);
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = useMemo(() => {
    if (showAll) return transactions;
    const mm = String(selectedMonth + 1).padStart(2, '0');
    return transactions.filter(t => t.date.startsWith(`${selectedYear}-${mm}`));
  }, [transactions, selectedMonth, selectedYear, showAll]);

  const totalRevenue = filtered.reduce((s, t) => s + t.amount, 0);
  const totalPaid = filtered.reduce((s, t) => s + t.paid, 0);
  const totalBalance = totalRevenue - totalPaid;
  const monthLabel = showAll ? 'Të Gjitha' : `${MONTHS[selectedMonth]} ${selectedYear}`;

  // Generate chart data dynamically
  const revenueByDate = useMemo(() => {
    const map = new Map<string, number>();
    [...filtered].reverse().forEach(t => {
      map.set(t.dateLabel, (map.get(t.dateLabel) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, te_ardhura]) => ({ name, te_ardhura }));
  }, [filtered]);

  const revenueByService = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(t => {
      map.set(t.service, (map.get(t.service) || 0) + t.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filtered]);


  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const d = form.date || new Date().toISOString().split('T')[0];
    const t: Transaction = {
      id: String(Date.now()),
      date: d,
      dateLabel: new Date(d + 'T12:00:00').toLocaleDateString('sq-AL', { day: 'numeric', month: 'short', year: 'numeric' }),
      patient: form.patient,
      service: form.service,
      amount: Number(form.amount),
      paid: Number(form.amount),
      method: form.method,
      status: 'Paguar',
    };
    setTransactions(prev => [t, ...prev]);
    setShowModal(false);
    setForm({ patient: '', service: '', amount: '', method: 'Cash', date: '' });
    showToast(`✅ Fatura për "${form.patient}" u shtua!`);
  };

  if (!isMounted) return null;

  return (
    <div className={`${styles.page} fade-in`}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <header className={styles.header}>
        <div>
          <h1>Financat</h1>
          <p className={styles.subtitle}>Pasqyra financiare e klinikës</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={() => exportToCSV(filtered, monthLabel)}>
            <Download size={16} /> Eksporto Excel ({monthLabel})
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Shto Faturë
          </button>
        </div>
      </header>

      {/* Filter row */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <Filter size={14} className={styles.filterIcon} />
          <label>Periudha:</label>
          <select value={selectedMonth} onChange={e => { setSelectedMonth(+e.target.value); setShowAll(false); }}>
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={e => { setSelectedYear(+e.target.value); setShowAll(false); }}>
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </select>
          <button
            className={`${styles.allBtn} ${showAll ? styles.allBtnActive : ''}`}
            onClick={() => setShowAll(v => !v)}
          >
            {showAll ? '✓ Të Gjitha' : 'Të Gjitha'}
          </button>
        </div>
        <span className={styles.resultCount}>{filtered.length} transaksione</span>
      </div>

      {/* Summary cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(5,150,105,0.1)', color: '#059669' }}>
            <Banknote size={22} />
          </div>
          <div>
            <p className={styles.summaryLabel}>Total i Faturuar</p>
            <h3 className={styles.summaryValue}>{totalRevenue.toLocaleString()} L</h3>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <p className={styles.summaryLabel}>Të Arkëtuara</p>
            <h3 className={styles.summaryValue} style={{ color: 'var(--primary-color)' }}>{totalPaid.toLocaleString()} L</h3>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
            <Clock size={22} />
          </div>
          <div>
            <p className={styles.summaryLabel}>Balancë e Papaguar</p>
            <h3 className={styles.summaryValue} style={{ color: totalBalance > 0 ? 'var(--danger-color)' : 'var(--primary-color)' }}>
              {totalBalance.toLocaleString()} L
            </h3>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon} style={{ backgroundColor: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <p className={styles.summaryLabel}>Nr. Pacientësh</p>
            <h3 className={styles.summaryValue}>{new Set(filtered.map(t => t.patient)).size}</h3>
          </div>
        </div>
      </div>

      
      {/* Charts section */}
      {filtered.length > 0 && (
        <div style={{ marginTop: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)' }}>
              <h3 style={{ fontSize: '1rem', color: '#475569', marginBottom: '20px', fontWeight: 600 }}>Të Ardhurat ndër Kohë</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueByDate} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} style={{ outline: 'none' }}>
                    <defs>
                      <linearGradient id="colorFinRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `${value / 1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      formatter={(value) => [`${Number(value).toLocaleString()} L`, 'Të Ardhurat']}
                    />
                    <Area type="monotone" dataKey="te_ardhura" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorFinRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)' }}>
              <h3 style={{ fontSize: '1rem', color: '#475569', marginBottom: '20px', fontWeight: 600 }}>Të Ardhurat sipas Trajtimeve</h3>
              <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart style={{ outline: 'none' }}>
                    <Pie
                      data={revenueByService}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {revenueByService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      formatter={(value, name) => [`${Number(value).toLocaleString()} L`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Pacienti</th>
              <th>Shërbimi</th>
              <th>Shuma</th>
              <th>Paguar</th>
              <th>Metodë</th>
              <th>Statusi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td className={styles.dateCell}>{t.dateLabel}</td>
                <td><strong>{t.patient}</strong></td>
                <td>{t.service}</td>
                <td><strong>{t.amount.toLocaleString()} L</strong></td>
                <td>{t.paid.toLocaleString()} L</td>
                <td>
                  <span className={styles.methodBadge}>{t.method}</span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[`status_${t.status.replace(/\s/g,'')}`]}`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className={styles.emptyRow}>Nuk ka të dhëna për këtë periudhë.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Invoice Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Shto Faturë të Re</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className={styles.form}>
              <div className={styles.formGroup}>
                <label><User size={14} /> Pacienti</label>
                <select value={form.patient} onChange={e => setForm({...form, patient: e.target.value})} required autoFocus>
                  <option value="">Zgjidh Pacientin...</option>
                  {patients.map(p => {
                    const fullName = `${p.firstName} ${p.lastName}`;
                    return <option key={p.id} value={fullName}>{fullName}</option>;
                  })}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label><FileText size={14} /> Shërbimi</label>
                <select value={form.service} onChange={e => {
                  const svc = MOCK_SERVICES.find(s => s.name === e.target.value);
                  setForm({...form, service: e.target.value, amount: svc ? String(svc.price) : ''});
                }} required>
                  <option value="">Zgjidh Shërbimin...</option>
                  {MOCK_SERVICES.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label><Banknote size={14} /> Shuma (L)</label>
                  <input type="number" placeholder="0" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required min="0" />
                </div>
                <div className={styles.formGroup}>
                  <label>Metoda Pagesës</label>
                  <select value={form.method} onChange={e => setForm({...form, method: e.target.value as any})}>
                    <option value="Cash">Cash</option>
                    <option value="Kartë">Kartë Bankare</option>
                    <option value="Transfer">Transfer Bankar</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Data</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Anulo</button>
                <button type="submit" className="btn-primary"><FileText size={15} /> Krijo Faturën</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
