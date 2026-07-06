'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Users, CalendarDays, FlaskConical, Stethoscope } from 'lucide-react';
import styles from './search.module.css';

// Krijojmë një bazë të dhënash mock më të zgjeruar
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchDataset, setSearchDataset] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 1. Build patients dataset
    let patients: any[] = [
      { id: '1', firstName: 'Agim', lastName: 'Ramadani', phone: '+355 69 123 4567', email: 'agim@email.com', whatsapp: '' },
      { id: '2', firstName: 'Teuta', lastName: 'Kelmendi', phone: '+355 69 222 3333', email: 'teuta@email.com', whatsapp: '' },
      { id: '3', firstName: 'Dritan', lastName: 'Hoxha', phone: '+355 69 444 5555', email: 'dritan@email.com', whatsapp: '' },
      { id: '4', firstName: 'Blerina', lastName: 'Koci', phone: '+355 69 666 7777', email: 'blerina@email.com', whatsapp: '' },
      { id: '5', firstName: 'Erion', lastName: 'Daci', phone: '+355 69 888 9999', email: 'erion@email.com', whatsapp: '' }
    ];
    try {
      const savedPatients = localStorage.getItem('patients_list');
      if (savedPatients) {
        const parsed = JSON.parse(savedPatients);
        if (Array.isArray(parsed)) {
          patients = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }

    const patientItems = patients.map(p => ({
      type: 'Pacient',
      text: `${p.firstName} ${p.lastName}`,
      desc: `Nr: ${p.phone || p.whatsapp || ''} ${p.email ? '| Email: ' + p.email : ''}`,
      link: `/patients/${p.id}`
    }));

    // 2. Build appointments/visits dataset
    let appts = [
      { id: '1', patient: 'Agim Ramadani', treatment: 'Pastrim Gurëzash', doctor: 'Dr. Agimi', date: '2026-06-24', time: '09:00', duration: '90', type: 'treatment' },
      { id: '2', patient: 'Teuta Kelmendi', treatment: 'Konsultë & Grafi', doctor: 'Dr. Agimi', date: '2026-06-24', time: '11:30', duration: '45', type: 'consultation' },
      { id: '3', patient: 'Dritan Hoxha', treatment: 'Implant (Dhëmbi 46)', doctor: 'Dr. Agimi', date: '2026-06-24', time: '14:00', duration: '120', type: 'surgery' },
    ];
    try {
      const savedAppts = localStorage.getItem('appointments_list');
      if (savedAppts) {
        const parsed = JSON.parse(savedAppts);
        if (Array.isArray(parsed)) {
          appts = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }

    const visitItems = appts.map((a: any) => ({
      type: 'Vizitë',
      text: a.treatment,
      desc: `${a.patient} - Data: ${a.date} ora ${a.time} - ${a.doctor || 'Dr. Agimi'}`,
      link: '/appointments'
    }));

    // 3. Static Doctors
    const staticDoctors = [
      { type: 'Doktor', text: 'Dr. Agim Hoxha', desc: 'Mjek Dentar - Orari 09:00 - 17:00', link: '/settings/staff' },
      { type: 'Doktor', text: 'Dr. Blerina Koci', desc: 'Mjeke Ortodonte - Orari 12:00 - 19:00', link: '/settings/staff' },
      { type: 'Doktor', text: 'Dr. Ermal Doci', desc: 'Kirurg Maksilofacial', link: '/settings/staff' },
    ];

    // 4. Lab items
    let labOrders = [
      { id: '1', patient: 'Agim Ramadani', phone: '+35569123456', type: 'Kurorë Zirkoni', teeth: '11, 12, 21', lab: 'Lab Prestige', orderDate: '10 Qer 2026', readyDate: '20 Qer 2026', status: 'Gati', notes: '3 kurora – ngjyra A2', notified: false },
      { id: '2', patient: 'Teuta Kelmendi', phone: '+35568987654', type: 'Implant', teeth: '46', lab: 'Lab Dental Art', orderDate: '15 Qer 2026', readyDate: '25 Qer 2026', status: 'Ne Prodhim', notes: 'Titan Grade 4', notified: false },
      { id: '3', patient: 'Dritan Hoxha', phone: '+35567456789', type: 'Protezë', teeth: 'Nofull e poshtme', lab: 'Lab Prestige', orderDate: '8 Qer 2026', readyDate: '18 Qer 2026', status: 'U Vendos', notes: 'Acrylic pink', notified: true },
    ];
    try {
      const savedLabs = localStorage.getItem('lab_orders');
      if (savedLabs) {
        const parsed = JSON.parse(savedLabs);
        if (Array.isArray(parsed)) {
          labOrders = parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const labItems = labOrders.map((o: any) => ({
      type: 'Porosi Lab',
      text: o.type,
      desc: `Pacienti: ${o.patient} - Statusi: ${o.status}${o.readyDate ? ' (Gati më ' + o.readyDate + ')' : ''}`,
      link: '/lab'
    }));

    setSearchDataset([...patientItems, ...visitItems, ...staticDoctors, ...labItems]);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const lowerQ = query.toLowerCase();
    const filtered = searchDataset.filter(item => 
      item.text.toLowerCase().includes(lowerQ) || 
      item.desc.toLowerCase().includes(lowerQ) ||
      item.type.toLowerCase().includes(lowerQ)
    );
    setResults(filtered);
  }, [query, searchDataset]);

  // Grouping results
  const patients = results.filter(r => r.type === 'Pacient');
  const visits = results.filter(r => r.type === 'Vizitë');
  const labs = results.filter(r => r.type === 'Porosi Lab');
  const doctors = results.filter(r => r.type === 'Doktor');

  if (!isMounted) {
    return (
      <div className={styles.searchPage}>
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Po ngarkohet kërkimi...</div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className={styles.searchPage}>
        <div className={styles.emptyState}>
          <SearchIcon size={48} className={styles.emptyStateIcon} />
          <h2>Kërko në DentaCRM</h2>
          <p>Shkruaj një emër pacienti, trajtimi ose porosie për të gjetur rezultate.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchHeader}>
        <h1>Rezultatet e Kërkimit</h1>
        <p>U gjetën <span className={styles.highlight}>{results.length}</span> rezultate për: "<span className={styles.highlight}>{query}</span>"</p>
      </div>

      {results.length === 0 ? (
        <div className={styles.emptyState}>
          <SearchIcon size={48} className={styles.emptyStateIcon} />
          <h2>Nuk u gjet asnjë rezultat</h2>
          <p>Provo të kërkosh me një fjalë tjetër ose kontrollo gabimet drejtshkrimore.</p>
        </div>
      ) : (
        <div className={styles.resultsGrid}>
          {patients.length > 0 && (
            <div className={styles.categorySection}>
              <h2 className={styles.categoryTitle}><Users size={20} /> Pacientë ({patients.length})</h2>
              <div className={styles.resultList}>
                {patients.map((p, idx) => (
                  <Link key={idx} href={p.link} className={styles.resultCard}>
                    <div className={`${styles.iconWrap} ${styles.patient}`}><Users size={18} /></div>
                    <div className={styles.resultInfo}>
                      <span className={styles.resultTitle}>{p.text}</span>
                      <span className={styles.resultDesc}>{p.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {visits.length > 0 && (
            <div className={styles.categorySection}>
              <h2 className={styles.categoryTitle}><CalendarDays size={20} /> Vizita / Trajtime ({visits.length})</h2>
              <div className={styles.resultList}>
                {visits.map((v, idx) => (
                  <Link key={idx} href={v.link} className={styles.resultCard}>
                    <div className={`${styles.iconWrap} ${styles.visit}`}><CalendarDays size={18} /></div>
                    <div className={styles.resultInfo}>
                      <span className={styles.resultTitle}>{v.text}</span>
                      <span className={styles.resultDesc}>{v.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {labs.length > 0 && (
            <div className={styles.categorySection}>
              <h2 className={styles.categoryTitle}><FlaskConical size={20} /> Laboratori ({labs.length})</h2>
              <div className={styles.resultList}>
                {labs.map((l, idx) => (
                  <Link key={idx} href={l.link} className={styles.resultCard}>
                    <div className={`${styles.iconWrap} ${styles.lab}`}><FlaskConical size={18} /></div>
                    <div className={styles.resultInfo}>
                      <span className={styles.resultTitle}>{l.text}</span>
                      <span className={styles.resultDesc}>{l.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {doctors.length > 0 && (
            <div className={styles.categorySection}>
              <h2 className={styles.categoryTitle}><Stethoscope size={20} /> Doktorë ({doctors.length})</h2>
              <div className={styles.resultList}>
                {doctors.map((d, idx) => (
                  <Link key={idx} href={d.link} className={styles.resultCard}>
                    <div className={`${styles.iconWrap} ${styles.doctor}`}><Stethoscope size={18} /></div>
                    <div className={styles.resultInfo}>
                      <span className={styles.resultTitle}>{d.text}</span>
                      <span className={styles.resultDesc}>{d.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Po ngarkohet kërkimi...</div>}>
      <SearchContent />
    </Suspense>
  );
}
