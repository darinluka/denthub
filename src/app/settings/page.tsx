'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserCog, Bell, Shield, Building2, ChevronRight, Stethoscope, Code, Key, UserPlus, Trash2, MessageSquare } from 'lucide-react';

const settingsItems = [
  { href: '/settings/staff', icon: UserCog, title: 'Stafi & Rolet', desc: 'Shto, edito ose fshi mjekë dhe punonjës', color: '#059669' },
  { href: '/settings/clinic', icon: Building2, title: 'Informacioni i Klinikës', desc: 'Emri, adresa dhe kontaktet e klinikës', color: '#0ea5e9' },
  { href: '/settings/services', icon: Stethoscope, title: 'Shërbimet & Çmimet', desc: 'Shto ose edito trajtimet dentare dhe çmimet', color: '#f59e0b' },
  { href: '/settings/notifications', icon: Bell, title: 'Njoftimet & WhatsApp', desc: 'Konfiguro rikujtimet: WhatsApp, SMS dhe Email', color: '#25D366' },
  { href: '/settings/security', icon: Shield, title: 'Siguria & Privatësia', desc: 'Fjalëkalimet, 2FA dhe akseset', color: '#7c3aed' },
  { href: '/settings/api', icon: Code, title: 'API & Integrimet', desc: 'Gjeneroni çelësa API dhe shikoni dokumentacionin e lidhjes', color: '#2563eb' },
];

export default function SettingsPage() {
  const [role, setRole] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [superAdmins, setSuperAdmins] = useState<any[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  
  // Form states for password change
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Form states for new admin creation
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const [showWaOnLanding, setShowWaOnLanding] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const userRole = localStorage.getItem('user_role');
    const userEmail = localStorage.getItem('user_email') || '';
    setRole(userRole);
    setCurrentEmail(userEmail);

    // Load Super Admins
    try {
      const saved = localStorage.getItem('super_admins_list');
      if (saved) {
        let parsed = JSON.parse(saved);
        let updated = false;
        parsed = parsed.map((admin: any) => {
          if (admin.email.toLowerCase() === 'superadmin@denthub.al' && admin.password === 'superadmin') {
            updated = true;
            return { ...admin, password: '12Palidhje34' };
          }
          return admin;
        });
        if (updated) {
          localStorage.setItem('super_admins_list', JSON.stringify(parsed));
        }
        setSuperAdmins(parsed);
      } else {
        const defaultAdmins = [{ email: 'superadmin@denthub.al', password: '12Palidhje34' }];
        localStorage.setItem('super_admins_list', JSON.stringify(defaultAdmins));
        setSuperAdmins(defaultAdmins);
      }
    } catch (e) {
      console.error(e);
    }

    // Load Landing Page WhatsApp status
    if (typeof window !== 'undefined') {
      setShowWaOnLanding(localStorage.getItem('show_wa_on_landing') === 'true');
    }
  }, []);

  const handleToggleWaOnLanding = (checked: boolean) => {
    setShowWaOnLanding(checked);
    localStorage.setItem('show_wa_on_landing', checked ? 'true' : 'false');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPass.length < 5) {
      setPassError('Fjalëkalimi duhet të jetë të paktën 5 karaktere!');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('Fjalëkalimet nuk përputhen!');
      return;
    }

    const updated = superAdmins.map(admin => {
      if (admin.email.toLowerCase() === currentEmail.toLowerCase()) {
        return { ...admin, password: newPass };
      }
      return admin;
    });

    localStorage.setItem('super_admins_list', JSON.stringify(updated));
    setSuperAdmins(updated);
    setNewPass('');
    setConfirmPass('');
    setPassSuccess('Fjalëkalimi u ndryshua me sukses!');
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    if (!newAdminEmail.includes('@') || !newAdminEmail.includes('.')) {
      setCreateError('Ju lutem vendosni një email të vlefshëm!');
      return;
    }
    if (newAdminPass.length < 5) {
      setCreateError('Fjalëkalimi duhet të jetë të paktën 5 karaktere!');
      return;
    }

    const exists = superAdmins.some(admin => admin.email.toLowerCase() === newAdminEmail.toLowerCase());
    if (exists) {
      setCreateError('Ky email i Super Adminit ekziston tashmë!');
      return;
    }

    const updated = [...superAdmins, { email: newAdminEmail, password: newAdminPass }];
    localStorage.setItem('super_admins_list', JSON.stringify(updated));
    setSuperAdmins(updated);
    setNewAdminEmail('');
    setNewAdminPass('');
    setCreateSuccess('Super Admini i ri u krijua me sukses!');
  };

  const handleDeleteAdmin = (emailToDelete: string) => {
    if (emailToDelete.toLowerCase() === 'superadmin@denthub.al') {
      alert('Nuk mund të fshini llogarinë kryesore të Super Adminit!');
      return;
    }
    if (emailToDelete.toLowerCase() === currentEmail.toLowerCase()) {
      alert('Nuk mund të fshini llogarinë tuaj aktive!');
      return;
    }

    if (confirm(`A jeni të sigurt që dëshironi të fshini Super Adminin "${emailToDelete}"?`)) {
      const updated = superAdmins.filter(admin => admin.email.toLowerCase() !== emailToDelete.toLowerCase());
      localStorage.setItem('super_admins_list', JSON.stringify(updated));
      setSuperAdmins(updated);
    }
  };

  if (!isMounted) return null;

  // Render Super Admin Settings
  if (role === 'super_admin') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }} className="fade-in">
        <header>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(220, 38, 38, 0.08)', color: '#dc2626', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '4px 10px', borderRadius: '99px', marginBottom: '8px', border: '1px solid rgba(220, 38, 38, 0.15)' }}>
            <Shield size={12} /> Super Admin Config
          </div>
          <h1>Cilësimet Globale</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Menaxhoni fjalëkalimet dhe krijoni administratorë të tjerë globalë për denthub.al.</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          {/* Section 1: Change Current Admin Password */}
          <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <Key size={18} style={{ color: 'var(--primary-color)' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Ndrysho Fjalëkalimin</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Ndryshoni fjalëkalimin e llogarisë suaj active <strong>({currentEmail})</strong>.</p>
            
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>Fjalëkalimi i Ri</label>
                <input 
                  type="password"
                  placeholder="Shkruani fjalëkalimin e ri..."
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--background-color)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>Konfirmo Fjalëkalimin</label>
                <input 
                  type="password"
                  placeholder="Rishkruani fjalëkalimin..."
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--background-color)', color: 'var(--text-main)' }}
                />
              </div>

              {passError && <div style={{ color: 'var(--danger-color)', fontSize: '0.8rem', fontWeight: 500 }}>❌ {passError}</div>}
              {passSuccess && <div style={{ color: 'var(--success-color)', fontSize: '0.8rem', fontWeight: 500 }}>✅ {passSuccess}</div>}

              <button type="submit" className="btn-primary" style={{ padding: '10px', fontSize: '0.85rem', width: '100%' }}>Përditëso Fjalëkalimin</button>
            </form>
          </div>

          {/* Section 2: Create New Super Admin */}
          <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <UserPlus size={18} style={{ color: '#dc2626' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Shto Super Admin të Ri</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Krijoni një përdorues tjetër të ri me të drejta të plota administrimi.</p>

            <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>Email i Administratorit</label>
                <input 
                  type="email"
                  placeholder="admin@denthub.al"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--background-color)', color: 'var(--text-main)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>Fjalëkalimi i Ri</label>
                <input 
                  type="password"
                  placeholder="Fjalëkalimi..."
                  value={newAdminPass}
                  onChange={e => setNewAdminPass(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', backgroundColor: 'var(--background-color)', color: 'var(--text-main)' }}
                />
              </div>

              {createError && <div style={{ color: 'var(--danger-color)', fontSize: '0.8rem', fontWeight: 500 }}>❌ {createError}</div>}
              {createSuccess && <div style={{ color: 'var(--success-color)', fontSize: '0.8rem', fontWeight: 500 }}>✅ {createSuccess}</div>}

              <button type="submit" className="btn-primary" style={{ padding: '10px', fontSize: '0.85rem', width: '100%', backgroundColor: '#dc2626', borderColor: '#dc2626' }}>Krijo Super Admin</button>
            </form>
          </div>

          {/* Section 3: Landing Page Configurations */}
          <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <MessageSquare size={18} style={{ color: '#25D366' }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Cilësimet e Landing Page</h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Menaxhoni elementet që do të shfaqen në faqen prezantuese publike denthub.al.</p>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--background-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>WhatsApp Chat Widget</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Shfaq ikonën lëvizëse të WhatsApp në Landing Page</span>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={showWaOnLanding}
                  onChange={e => handleToggleWaOnLanding(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span 
                  style={{ 
                    position: 'absolute', 
                    cursor: 'pointer', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundColor: showWaOnLanding ? '#22c55e' : '#cbd5e1', 
                    transition: '0.3s', 
                    borderRadius: '24px' 
                  }}
                >
                  <span 
                    style={{ 
                      position: 'absolute', 
                      content: '""', 
                      height: '18px', width: '18px', 
                      left: showWaOnLanding ? '22px' : '3px', 
                      bottom: '3px', 
                      backgroundColor: 'white', 
                      transition: '0.3s', 
                      borderRadius: '50%' 
                    }}
                  />
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Registered Super Admins Table */}
        <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Super Adminët e Regjistruar</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Roli</th>
                  <th style={{ padding: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Statusi</th>
                  <th style={{ padding: '10px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>Aksione</th>
                </tr>
              </thead>
              <tbody>
                {superAdmins.map(admin => {
                  const isCurrent = admin.email.toLowerCase() === currentEmail.toLowerCase();
                  const isMaster = admin.email.toLowerCase() === 'superadmin@denthub.al';
                  return (
                    <tr key={admin.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 600, color: 'var(--text-main)' }}>{admin.email}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>Super Admin</td>
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '99px', backgroundColor: isCurrent ? '#ecfdf5' : '#f1f5f9', color: isCurrent ? '#059669' : '#475569' }}>
                          {isCurrent ? 'Aktualisht i Lidhur' : 'Aktiv'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        {!isMaster && !isCurrent && (
                          <button 
                            onClick={() => handleDeleteAdmin(admin.email)}
                            style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', padding: '4px' }}
                            title="Fshi"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Render normal Clinician Settings
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="fade-in">
      <header>
        <h1>Cilësimet</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Konfiguro sistemin CRM sipas nevojave të klinikës</p>
      </header>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        {settingsItems.map(({ href, icon: Icon, title, desc, color }) => (
          <Link key={title} href={href} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 20px', borderBottom: '1px solid var(--border-color)', transition: 'background-color 150ms', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: color + '15', color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '2px' }}>{title}</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{desc}</p>
            </div>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
