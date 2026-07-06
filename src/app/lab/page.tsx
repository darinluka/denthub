'use client';

import { useState, useEffect } from 'react';
import {
  Plus, X, MessageCircle, FlaskConical, Check, Clock,
  Truck, PackageCheck, AlertCircle, Pencil, Send
} from 'lucide-react';
import styles from './lab.module.css';
import { sendTelegramNotification } from '@/lib/telegram';

type OrderStatus = 'Ne Pritje' | 'Ne Prodhim' | 'Gati' | 'U Vendos';

type LabOrder = {
  id: string;
  patient: string;
  phone: string;
  type: string;
  teeth: string;
  lab: string;
  orderDate: string;
  readyDate: string;
  status: OrderStatus;
  notes: string;
  notified: boolean;
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  'Ne Pritje':   { label: 'Në Pritje',   color: '#f59e0b', icon: Clock },
  'Ne Prodhim':  { label: 'Në Prodhim',  color: '#0ea5e9', icon: FlaskConical },
  'Gati':        { label: 'Gati! ✓',     color: '#059669', icon: PackageCheck },
  'U Vendos':    { label: 'U Vendos',     color: '#7c3aed', icon: Check },
};

const ORDER_TYPES = ['Kurorë Porcelani', 'Kurorë Zirkoni', 'Implant', 'Urë Porcelani', 'Protezë', 'Aparate Ortodontike', 'Inlay/Onlay'];

const initialOrders: LabOrder[] = [
  { id: '1', patient: 'Agim Ramadani', phone: '+35569123456', type: 'Kurorë Zirkoni', teeth: '11, 12, 21', lab: 'Lab Prestige', orderDate: '10 Qer 2026', readyDate: '20 Qer 2026', status: 'Gati', notes: '3 kurora – ngjyra A2', notified: false },
  { id: '2', patient: 'Teuta Kelmendi', phone: '+35568987654', type: 'Implant', teeth: '32', lab: 'Lab Dental Art', orderDate: '15 Qer 2026', readyDate: '25 Qer 2026', status: 'Ne Prodhim', notes: 'Titan Grade 4', notified: false },
  { id: '3', patient: 'Dritan Hoxha', phone: '+35567456789', type: 'Protezë', teeth: 'Nofull e poshtme', lab: 'Lab Prestige', orderDate: '8 Qer 2026', readyDate: '18 Qer 2026', status: 'U Vendos', notes: 'Acrylic pink', notified: true },
];

export default function LabPage() {
  const [orders, setOrders] = useState<LabOrder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('Të gjitha');
  const [form, setForm] = useState({
    patient: '', phone: '', type: 'Kurorë Zirkoni', teeth: '',
    lab: '', orderDate: '', readyDate: '', notes: '',
  });
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

    try {
      const savedOrders = localStorage.getItem('lab_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
          return;
        }
      }
      localStorage.setItem('lab_orders', JSON.stringify(initialOrders));
      setOrders(initialOrders);
    } catch (e) {
      console.error('Failed to parse lab orders:', e);
      setOrders(initialOrders);
    }
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const filtered = filterStatus === 'Të gjitha' ? orders : orders.filter(o => o.status === filterStatus);

  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === id) {
          if (o.status !== 'Gati' && status === 'Gati') {
            const msg = `🔬 <b>Porosi Laboratori Gati</b>\nPacienti: ${o.patient}\nPunimi: ${o.type}\nDhëmbët: ${o.teeth || '—'}\nLaboratori: ${o.lab || '—'}\nShënime: ${o.notes || '—'}`;
            sendTelegramNotification(msg);
          }
          return { ...o, status };
        }
        return o;
      });
      localStorage.setItem('lab_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const handleNotify = (order: LabOrder) => {
    const msg = encodeURIComponent(
      `Pershendetje ${order.patient}! Porositë tuaja dentare (${order.type} për dhëmbët ${order.teeth}) janë gati dhe presin vendosjen. Ju lutemi caktoni një takim me klinikën tonë. Faleminderit! 😊`
    );
    window.open(`https://wa.me/${order.phone.replace(/[\s+]/g, '')}?text=${msg}`, 'whatsappWindow', 'width=800,height=600,left=200,top=100');
    setOrders(prev => {
      const updated = prev.map(o => o.id === order.id ? { ...o, notified: true } : o);
      localStorage.setItem('lab_orders', JSON.stringify(updated));
      return updated;
    });
    showToast(`✅ Njoftimi u dërgua te ${order.patient} përmes WhatsApp!`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: LabOrder = {
      ...form,
      id: String(Date.now()),
      status: 'Ne Pritje',
      notified: false,
    };
    setOrders(prev => {
      const updated = [...prev, newOrder];
      localStorage.setItem('lab_orders', JSON.stringify(updated));
      return updated;
    });

    sendTelegramNotification(
      `🔬 <b>Porosi e Re Laboratori</b>\nPacienti: ${newOrder.patient}\nPunimi: ${newOrder.type}\nDhëmbët: ${newOrder.teeth || '—'}\nLaboratori: ${newOrder.lab || '—'}\nShënime: ${newOrder.notes || '—'}`
    );

    setShowModal(false);
    setForm({ patient: '', phone: '', type: 'Kurorë Zirkoni', teeth: '', lab: '', orderDate: '', readyDate: '', notes: '' });
    showToast('✅ Porosia u shtua me sukses!');
  };

  const readyCount = orders.filter(o => o.status === 'Gati' && !o.notified).length;

  if (!isMounted) return null;

  return (
    <div className={`${styles.page} fade-in`}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <header className={styles.header}>
        <div>
          <h1>Porositë Laboratorike</h1>
          <p className={styles.subtitle}>Korona, implante, proteza dhe punime dentare</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Shto Porosi
        </button>
      </header>

      {/* Alert banner for ready orders */}
      {readyCount > 0 && (
        <div className={styles.alertBanner}>
          <PackageCheck size={20} />
          <div>
            <strong>{readyCount} porosi {readyCount === 1 ? 'është gati' : 'janë gati'}!</strong>
            {' '}Lajmëro pacientët përmes WhatsApp që të vijnë për vendosje.
          </div>
        </div>
      )}

      {/* Status tabs / filter */}
      <div className={styles.filterRow}>
        {['Të gjitha', 'Ne Pritje', 'Ne Prodhim', 'Gati', 'U Vendos'].map(s => (
          <button
            key={s}
            className={`${styles.filterBtn} ${filterStatus === s ? styles.filterActive : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s === 'Të gjitha' ? 'Të Gjitha' : STATUS_CONFIG[s as OrderStatus]?.label || s}
            <span className={styles.filterCount}>
              {s === 'Të gjitha' ? orders.length : orders.filter(o => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className={styles.ordersList}>
        {filtered.map(order => {
          const cfg = STATUS_CONFIG[order.status];
          const Icon = cfg.icon;
          const isReady = order.status === 'Gati';
          return (
            <div key={order.id} className={`${styles.orderCard} ${isReady && !order.notified ? styles.orderReady : ''}`}>
              <div className={styles.orderLeft}>
                <div className={styles.orderIcon} style={{ backgroundColor: cfg.color + '18', color: cfg.color }}>
                  <Icon size={20} />
                </div>
                <div className={styles.orderInfo}>
                  <div className={styles.orderPatient}>{order.patient}</div>
                  <div className={styles.orderType}>
                    <strong>{order.type}</strong>
                    {order.teeth && <span className={styles.teethTag}>Dhëmbët: {order.teeth}</span>}
                  </div>
                  <div className={styles.orderMeta}>
                    <span>📅 Porositur: {order.orderDate}</span>
                    <span>📦 Lab: {order.lab}</span>
                    {order.readyDate && <span>🎯 Gati: {order.readyDate}</span>}
                  </div>
                  {order.notes && <p className={styles.orderNotes}>{order.notes}</p>}
                </div>
              </div>

              <div className={styles.orderRight}>
                {/* Status selector */}
                <select
                  className={styles.statusSelect}
                  value={order.status}
                  onChange={e => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  style={{ borderColor: cfg.color, color: cfg.color }}
                >
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>

                {/* WhatsApp notify button */}
                {isReady && (
                  <button
                    className={`${styles.notifyBtn} ${order.notified ? styles.notified : ''}`}
                    onClick={() => handleNotify(order)}
                    title="Dërgo rikujtues WhatsApp"
                  >
                    <MessageCircle size={15} />
                    {order.notified ? 'U Lajmërua' : 'Lajmëro Pacientin'}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <FlaskConical size={40} className={styles.emptyIcon} />
            <p>Nuk ka porosi për këtë kategori</p>
          </div>
        )}
      </div>

      {/* Add Order Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Shto Porosi Laboratorike</h2>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Emri Pacientit *</label>
                  <select
                    value={form.patient}
                    onChange={e => {
                      const selectedName = e.target.value;
                      const patientObj = patients.find(p => `${p.firstName} ${p.lastName}` === selectedName);
                      setForm({
                        ...form,
                        patient: selectedName,
                        phone: patientObj ? (patientObj.whatsapp || patientObj.phone || '') : ''
                      });
                    }}
                    required
                    autoFocus
                  >
                    <option value="">Zgjidh Pacientin...</option>
                    {patients.map(p => {
                      const fullName = `${p.firstName} ${p.lastName}`;
                      return <option key={p.id} value={fullName}>{fullName}</option>;
                    })}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Nr. WhatsApp *</label>
                  <input type="tel" placeholder="+355 69..." value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Lloji i Punimit *</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    {ORDER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Dhëmbët</label>
                  <input type="text" placeholder="P.sh. 11, 12, 21" value={form.teeth} onChange={e => setForm({...form, teeth: e.target.value})} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Laboratori</label>
                  <input type="text" placeholder="Emri i laboratorit" value={form.lab} onChange={e => setForm({...form, lab: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Data e Gatishmërisë</label>
                  <input type="date" value={form.readyDate} onChange={e => setForm({...form, readyDate: e.target.value})} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Shënime</label>
                <textarea rows={2} placeholder="Ngjyra, materialet, instruksione..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>Anulo</button>
                <button type="submit" className="btn-primary"><FlaskConical size={15} /> Shto Porosinë</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
