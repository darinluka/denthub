'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2, Check, X, Stethoscope } from 'lucide-react';
import styles from './services.module.css';

export default function ServicesSettings() {
  const [services, setServices] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempService, setTempService] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newService, setNewService] = useState({ name: '', category: 'Tjetër', price: '' });

  useEffect(() => {
    setIsMounted(true);
    const defaultServices = [
      { id: '1', name: 'Pastrim Gurëzash', category: 'Higjiena', price: 4000 },
      { id: '2', name: 'Mbushje Kompozit (E Vogël)', category: 'Terapi', price: 5000 },
      { id: '3', name: 'Mbushje Kompozit (E Madhe)', category: 'Terapi', price: 6000 },
      { id: '4', name: 'Mjekim Kanali (Dhëmb Tek)', category: 'Endodonti', price: 8000 },
      { id: '5', name: 'Ekstraksion i Thjeshtë', category: 'Kirurgji', price: 3000 },
      { id: '6', name: 'Kurorë Zirkoni', category: 'Protetikë', price: 20000 },
    ];
    try {
      const saved = localStorage.getItem('services_list');
      if (saved) {
        const parsed = JSON.parse(saved);
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

  if (!isMounted) return null;

  const startEdit = (s: any) => {
    setEditingId(s.id);
    setTempService({ ...s });
  };

  const saveEdit = () => {
    const updated = services.map(s => s.id === tempService.id ? tempService : s);
    setServices(updated);
    localStorage.setItem('services_list', JSON.stringify(updated));
    setEditingId(null);
    setTempService(null);
  };

  const deleteService = (id: string) => {
    if (confirm('Jeni të sigurt që doni të fshini këtë shërbim?')) {
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      localStorage.setItem('services_list', JSON.stringify(updated));
    }
  };

  const addService = (e: React.FormEvent) => {
    e.preventDefault();
    const service = {
      id: Date.now().toString(),
      name: newService.name,
      category: newService.category,
      price: Number(newService.price)
    };
    const updated = [...services, service];
    setServices(updated);
    localStorage.setItem('services_list', JSON.stringify(updated));
    setShowAdd(false);
    setNewService({ name: '', category: 'Tjetër', price: '' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/settings" className={styles.backBtn}>
            <ArrowLeft size={16} /> Kthehu te Cilësimet
          </Link>
          <h1>Menaxhimi i Shërbimeve</h1>
          <p>Shto, edito dhe vendos çmimet për shërbimet e klinikës.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Shto Shërbim
        </button>
      </div>

      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Shërbimi</th>
              <th>Kategoria</th>
              <th>Çmimi (Lekë)</th>
              <th className={styles.actionsCol}>Veprime</th>
            </tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                {editingId === s.id ? (
                  <>
                    <td><input type="text" value={tempService.name} onChange={e => setTempService({...tempService, name: e.target.value})} className={styles.editInput} /></td>
                    <td>
                      <select value={tempService.category} onChange={e => setTempService({...tempService, category: e.target.value})} className={styles.editInput}>
                        <option value="Higjiena">Higjiena</option>
                        <option value="Terapi">Terapi</option>
                        <option value="Endodonti">Endodonti</option>
                        <option value="Kirurgji">Kirurgji</option>
                        <option value="Protetikë">Protetikë</option>
                        <option value="Ortodonti">Ortodonti</option>
                        <option value="Tjetër">Tjetër</option>
                      </select>
                    </td>
                    <td><input type="number" value={tempService.price} onChange={e => setTempService({...tempService, price: e.target.value})} className={styles.editInput} /></td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.iconBtnPos} onClick={saveEdit}><Check size={16}/></button>
                        <button className={styles.iconBtnNeg} onClick={() => setEditingId(null)}><X size={16}/></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td><strong>{s.name}</strong></td>
                    <td><span className={styles.categoryBadge}>{s.category}</span></td>
                    <td>{s.price.toLocaleString()} L</td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button className={styles.iconBtn} onClick={() => startEdit(s)}><Edit2 size={16}/></button>
                        <button className={styles.iconBtnNeg} onClick={() => deleteService(s.id)}><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className={styles.modalOverlay} onClick={() => setShowAdd(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleRow}>
                <div className={styles.modalIcon}><Stethoscope size={18} /></div>
                <h2>Shto Shërbim të Ri</h2>
              </div>
              <button className={styles.closeBtn} onClick={() => setShowAdd(false)}><X size={20} /></button>
            </div>
            <form onSubmit={addService} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Emri i Shërbimit</label>
                <input type="text" placeholder="P.sh. Zbardhim Dhëmbësh" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} required autoFocus />
              </div>
              <div className={styles.formGroup}>
                <label>Kategoria</label>
                <select value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}>
                  <option value="Higjiena">Higjiena</option>
                  <option value="Terapi">Terapi</option>
                  <option value="Endodonti">Endodonti</option>
                  <option value="Kirurgji">Kirurgji</option>
                  <option value="Protetikë">Protetikë</option>
                  <option value="Ortodonti">Ortodonti</option>
                  <option value="Tjetër">Tjetër</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Çmimi (Lekë)</label>
                <input type="number" placeholder="0" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required />
              </div>
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAdd(false)}>Anulo</button>
                <button type="submit" className="btn-primary">Ruaj Shërbimin</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
