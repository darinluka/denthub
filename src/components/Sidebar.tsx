'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  CreditCard,
  LogOut,
  Stethoscope,
  Settings,
  UserCog,
  FlaskConical,
  Building2,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/patients', label: 'Pacientët', icon: Users },
  { href: '/appointments', label: 'Kalendari', icon: CalendarDays },
  { href: '/lab', label: 'Lab & Porosi', icon: FlaskConical },
  { href: '/finance', label: 'Financat', icon: CreditCard },
];

const bottomNavItems = [
  { href: '/settings/staff', label: 'Stafi & Rolet', icon: UserCog },
  { href: '/settings', label: 'Cilësimet', icon: Settings },
];

export default function Sidebar({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  const [clinicName, setClinicName] = useState('Denthub.al');
  const [clinicLogo, setClinicLogo] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const loadInfo = () => {
      const role = localStorage.getItem('user_role');
      const superAdmin = role === 'super_admin';
      setIsSuperAdmin(superAdmin);
      
      if (superAdmin) {
        setClinicName('denthub.al');
        setClinicLogo(null);
      } else {
        const savedInfo = localStorage.getItem('clinicInfo');
        if (savedInfo) setClinicName(JSON.parse(savedInfo).name || 'Denthub.al');
        const savedLogo = localStorage.getItem('clinicLogo');
        if (savedLogo) setClinicLogo(savedLogo);
      }
    };
    loadInfo();
    window.addEventListener('clinicInfoUpdated', loadInfo);
    return () => window.removeEventListener('clinicInfoUpdated', loadInfo);
  }, []);


  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon} style={{ overflow: 'hidden' }}>
          {clinicLogo ? <img src={clinicLogo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Stethoscope size={20} />}
        </div>
        {!isCollapsed && <h2>{clinicName}</h2>}
      </div>

      <nav className={styles.nav}>
        <p className={styles.navLabel}>Kryesore</p>
        <ul>
          {(isSuperAdmin ? navItems.filter(i => i.href === '/dashboard') : navItems).map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.link} ${isActive ? styles.active : ''}`}
                >
                  <span className={styles.iconWrap}>
                    <Icon size={18} />
                  </span>
                  <span className={styles.label}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className={styles.navLabel} style={{ marginTop: '12px' }}>Menaxhimi</p>
        <ul>
          {(isSuperAdmin ? bottomNavItems.filter(i => i.href === '/settings') : bottomNavItems).map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.link} ${isActive ? styles.active : ''}`}
                >
                  <span className={styles.iconWrap}>
                    <Icon size={18} />
                  </span>
                  <span className={styles.label}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {isSuperAdmin && (
          <>
            <p className={styles.navLabel} style={{ marginTop: '12px', color: '#dc2626' }}>Super Admin</p>
            <ul>
              <li>
                <Link
                  href="/superadmin"
                  className={`${styles.link} ${pathname.startsWith('/superadmin') ? styles.active : ''}`}
                >
                  <span className={styles.iconWrap}>
                    <Building2 size={18} style={{ color: '#dc2626' }} />
                  </span>
                  <span className={styles.label} style={{ color: '#dc2626', fontWeight: 600 }}>Menaxhimi i Klinikave</span>
                </Link>
              </li>
            </ul>
          </>
        )}
      </nav>

      <div className={styles.bottom}>
        <button className={styles.logoutBtn} onClick={() => {
          localStorage.removeItem('user_role');
          localStorage.removeItem('user_email');
          window.location.href = '/login';
        }}>
          <LogOut size={18} />
          <span>Dalja</span>
        </button>
      </div>
    </aside>
  );
}
