'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, ChevronDown, User, Settings, LogOut, Menu } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchDataset, setSearchDataset] = useState<any[]>([]);

  useEffect(() => {
    // 1. Build patients dataset
    let patients = [
      { id: '1', firstName: 'Agim', lastName: 'Ramadani', phone: '+355 69 123 4567', email: 'agim@email.com' },
      { id: '2', firstName: 'Teuta', lastName: 'Kelmendi', phone: '+355 68 987 6543', email: 'teuta@email.com' },
      { id: '3', firstName: 'Dritan', lastName: 'Hoxha', phone: '+355 67 456 7890', email: '' }
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
      desc: `Nr: ${p.phone} ${p.email ? '| Email: ' + p.email : ''}`,
      link: `/patients/${p.id}`
    }));

    // 2. Build visits dataset
    let appts: any[] = [];
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

    // 3. Static Doctors and others
    const staticDoctors = [
      { type: 'Doktor', text: 'Dr. Agim Hoxha', desc: 'Mjek Dentar - Orari 09:00 - 17:00', link: '/settings/staff' },
      { type: 'Doktor', text: 'Dr. Blerina Koci', desc: 'Mjeke Ortodonte - Orari 12:00 - 19:00', link: '/settings/staff' },
    ];

    setSearchDataset([...patientItems, ...visitItems, ...staticDoctors]);
  }, [searchQuery, isSearchFocused]);

  const [userName, setUserName] = useState('Dr. Agimi');
  const [userRoleText, setUserRoleText] = useState('Mjek Dentar');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role === 'super_admin') {
      setUserName('Super Admin');
      setUserRoleText('Menaxheri i Programit');

      // Load pending requests as admin notifications
      try {
        const savedReqs = localStorage.getItem('registration_requests');
        const reqs = savedReqs ? JSON.parse(savedReqs) : [];
        const pending = reqs.filter((r: any) => r.status === 'pending');
        
        const notifs = pending.map((r: any) => ({
          title: 'Kërkesë Regjistrimi',
          message: `Klinika <strong>${r.clinicName}</strong> ka dërguar kërkesë për regjistrim.`,
          time: r.createdAt || 'Para pak çastesh'
        }));
        
        if (notifs.length === 0) {
          notifs.push({
            title: 'Ska Njoftime',
            message: 'Nuk ka kërkesa të reja për regjistrim.',
            time: 'Sot'
          });
        }
        setNotifications(notifs);
      } catch (e) {
        console.error(e);
      }
    } else {
      setUserName('Dr. Agimi');
      setUserRoleText('Mjek Dentar');
      setNotifications([
        { title: 'Takim', message: '<strong>Agim Ramadani</strong> ka takim nesër në orën 10:00.', time: 'Para 2 orësh' },
        { title: 'Porosi Lab', message: '<strong>Porosi Lab:</strong> Kurora zirkoni për Teuta Kelmendi janë gati.', time: 'Sot' }
      ]);
    }
  }, []);

  const searchResults = searchQuery.trim() === '' ? [] : searchDataset.filter(item => 
    item.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <header className={styles.header}>
      <div className={styles.searchWrapper}>
        {onToggleSidebar && (
          <button className={styles.menuBtn} onClick={onToggleSidebar} aria-label="Toggle Sidebar">
            <Menu size={20} />
          </button>
        )}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Kërko pacientë..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim() !== '') {
                setIsSearchFocused(false);
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
          />
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div className={styles.searchDropdown}>
              {searchResults.length > 0 ? (
                searchResults.map((res, i) => (
                  <a key={i} href={res.link} className={styles.searchResultItem}>
                    <div className={styles.searchResultType}>{res.type}</div>
                    <div className={styles.searchResultInfo}>
                      <span className={styles.searchResultText}>{res.text}</span>
                      <span className={styles.searchResultDesc}>{res.desc}</span>
                    </div>
                  </a>
                ))
              ) : (
                <div className={styles.searchResultEmpty}>Nuk u gjet asnjë rezultat.</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.actionWrap}>
          <button className={styles.iconBtn} aria-label="Njoftime" onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}>
            <Bell size={20} />
            {notifications.length > 0 && notifications[0].title !== 'Ska Njoftime' && (
              <span className={styles.badge}>{notifications.length}</span>
            )}
          </button>
          {showNotif && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>Njoftimet</div>
              {notifications.map((n, i) => (
                <div key={i} className={styles.dropdownItem}>
                  <p dangerouslySetInnerHTML={{ __html: n.message }}></p>
                  <span>{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actionWrap}>
          <div className={styles.profile} onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}>
            <div className={styles.avatar}>{userName === 'Super Admin' ? 'SA' : 'DR'}</div>
            <div className={styles.info}>
              <span className={styles.name}>{userName}</span>
              <span className={styles.role}>{userRoleText}</span>
            </div>
            <ChevronDown size={14} className={styles.chevron} />
          </div>
          {showProfile && (
            <div className={`${styles.dropdownMenu} ${styles.profileMenu}`}>
              <a href="/settings/staff" className={styles.dropdownLink}><User size={14}/> Profili im</a>
              <a href="/settings" className={styles.dropdownLink}><Settings size={14}/> Cilësimet</a>
              <hr className={styles.divider} />
              <button 
                className={`${styles.dropdownLink} ${styles.logout}`}
                onClick={() => {
                  localStorage.removeItem('user_role');
                  localStorage.removeItem('user_email');
                  window.location.href = '/login';
                }}
              >
                <LogOut size={14}/> Dil
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
