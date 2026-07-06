'use client';

import { useState } from 'react';
import { Stethoscope, Lock, Mail, Eye, EyeOff, ArrowRight, User, Phone, Building, MapPin, CheckCircle, X } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [show2fa, setShow2fa] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [error2fa, setError2fa] = useState('');
  const [error, setError] = useState('');

  // Registration States
  const [isRegistering, setIsRegistering] = useState(false);
  const [regForm, setRegForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    clinicName: '',
    clinicCity: '',
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      // Super Admin Login Verification
      let superAdmins = [];
      try {
        const savedAdmins = localStorage.getItem('super_admins_list');
        if (savedAdmins) {
          let parsed = JSON.parse(savedAdmins);
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
          superAdmins = parsed;
        } else {
          superAdmins = [{ email: 'superadmin@denthub.al', password: '12Palidhje34' }];
          localStorage.setItem('super_admins_list', JSON.stringify(superAdmins));
        }
      } catch (err) {
        console.error(err);
      }

      const isSuperAdminEmail = superAdmins.some(
        (admin: any) => admin.email.toLowerCase() === email.toLowerCase()
      );

      if (isSuperAdminEmail) {
        const matchedAdmin = superAdmins.find(
          (admin: any) => admin.email.toLowerCase() === email.toLowerCase() && admin.password === password
        );
        if (matchedAdmin) {
          localStorage.setItem('user_role', 'super_admin');
          localStorage.setItem('user_email', matchedAdmin.email);
          window.location.href = '/dashboard';
          return;
        } else {
          setError('Kredencialet nuk janë të sakta!');
          return;
        }
      }
      
      // Simple Mock Validation
      if (email !== 'demo@denthub.al' && email !== 'admin@denthub.al') {
        setError('Ky email nuk ekziston në sistem!');
        return;
      }
      if (password !== 'demo123') {
        setError('Kredencialet nuk janë të sakta!');
        return;
      }

      // User specific 2FA check
      const is2fa = localStorage.getItem(`2fa_enabled_${email}`) === 'true';
      if (is2fa) {
        setShow2fa(true);
      } else {
        localStorage.setItem('user_role', 'admin');
        localStorage.setItem('user_email', email);
        window.location.href = '/dashboard';
      }
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      const newRequest = {
        id: 'req_' + Date.now(),
        ...regForm,
        status: 'pending',
        createdAt: new Date().toLocaleDateString('sq-AL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };

      try {
        const existing = localStorage.getItem('registration_requests');
        const requests = existing ? JSON.parse(existing) : [];
        requests.push(newRequest);
        localStorage.setItem('registration_requests', JSON.stringify(requests));
      } catch (err) {
        console.error(err);
      }

      // Reset form and show success
      setRegForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        clinicName: '',
        clinicCity: '',
      });
      setShowSuccessPopup(true);
      setIsRegistering(false);
    }, 1000);
  };

  const handle2faSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError2fa('');
    setLoading(true);
    try {
      const res = await fetch('/api/verify-totp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: twoFaCode })
      });
      const data = await res.json();
      
      setLoading(false);
      if (data.success) {
        window.location.href = '/dashboard';
      } else {
        setError2fa('Kodi është i pasaktë ose ka skaduar!');
      }
    } catch (err) {
      setLoading(false);
      setError2fa('Gabim në verifikim!');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Stethoscope size={32} />
          </div>
          <h1 style={{ color: 'white' }}>Denthub.al</h1>
        </div>
        
        <div className={styles.heroContent}>
          <h2 style={{ color: 'white' }}>Menaxhimi i Klinikës Dentare.</h2>
          <p style={{ color: 'white' }}>Sistemi më i avancuar për menaxhimin e pacientëve, takimeve dhe financave.</p>
        </div>
        
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <strong>+500</strong>
            <span>Klinika Dentare</span>
          </div>
          <div className={styles.statItem}>
            <strong>100%</strong>
            <span>Të dhëna të sigurta</span>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          {/* REGISTRATION VIEW */}
          {isRegistering ? (
            <>
              <div className={styles.loginHeader}>
                <h2>Regjistro Klinikën Tënde</h2>
                <p>Plotësoni të dhënat për të dërguar kërkesën për regjistrim.</p>
              </div>

              <form className={styles.form} onSubmit={handleRegister}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className={styles.inputGroup}>
                    <label>Emri</label>
                    <div className={styles.inputWrapper}>
                      <User size={16} className={styles.inputIcon} />
                      <input 
                        type="text" 
                        placeholder="Emri" 
                        value={regForm.firstName}
                        onChange={e => setRegForm({...regForm, firstName: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Mbiemri</label>
                    <div className={styles.inputWrapper}>
                      <User size={16} className={styles.inputIcon} />
                      <input 
                        type="text" 
                        placeholder="Mbiemri" 
                        value={regForm.lastName}
                        onChange={e => setRegForm({...regForm, lastName: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Email Profesional</label>
                  <div className={styles.inputWrapper}>
                    <Mail size={16} className={styles.inputIcon} />
                    <input 
                      type="email" 
                      placeholder="adresa@email.com" 
                      value={regForm.email}
                      onChange={e => setRegForm({...regForm, email: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Numri i Telefonit</label>
                  <div className={styles.inputWrapper}>
                    <Phone size={16} className={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="+355 6X XXX XXXX" 
                      value={regForm.phone}
                      onChange={e => setRegForm({...regForm, phone: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Emri i Klinikës</label>
                  <div className={styles.inputWrapper}>
                    <Building size={16} className={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="Klinika Dentare..." 
                      value={regForm.clinicName}
                      onChange={e => setRegForm({...regForm, clinicName: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Qyteti</label>
                  <div className={styles.inputWrapper}>
                    <MapPin size={16} className={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="P.sh. Tiranë, Durrës..." 
                      value={regForm.clinicCity}
                      onChange={e => setRegForm({...regForm, clinicCity: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.spinner}></span> : (
                    <>
                      Dërgo Kërkesën <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <button type="button" onClick={() => setIsRegistering(false)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginTop: '15px', width: '100%', fontSize: '0.9rem', fontWeight: 600 }}>
                  Kthehu te Login
                </button>
              </form>
            </>
          ) : !show2fa ? (
            <>
              <div className={styles.loginHeader}>
                <h2>Mirësevini!</h2>
                <p>Hyni në llogarinë tuaj për të vazhduar.</p>
              </div>

              <form className={styles.form} onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                  <label>Email ose Numri i Telefonit</label>
                  <div className={styles.inputWrapper}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input 
                      type="text" 
                      placeholder="shembull@shembull.com" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.labelRow}>
                    <label>Fjalëkalimi</label>
                    <a href="#" className={styles.forgotLink}>Keni harruar fjalëkalimin?</a>
                  </div>
                  <div className={styles.inputWrapper}>
                    <Lock size={18} className={styles.inputIcon} />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required 
                    />
                    <button 
                      type="button" 
                      className={styles.eyeBtn}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span>Më mbaj të loguar</span>
                  </label>
                </div>

                {error && <div className={styles.errorMsg}>{error}</div>}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? <span className={styles.spinner}></span> : (
                    <>
                      Hyr në Sistem <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Nuk keni llogari? </span>
                <button 
                  onClick={() => setIsRegistering(true)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  Regjistro klinikën tënde
                </button>
              </div>

              <div className={styles.demoNote}>
                <strong>Klinikë Prova:</strong> demo@denthub.al (pass: demo123)
              </div>
            </>
          ) : (
            <>
              <div className={styles.loginHeader}>
                <h2>Google Authenticator 🔒</h2>
                <p>Hap aplikacionin në celularin tënd dhe vendos kodin 6-shifror.</p>
              </div>

              <form className={styles.form} onSubmit={handle2faSubmit}>
                <div className={styles.inputGroup}>
                  <label style={{ textAlign: 'center', display: 'block', marginBottom: '15px' }}>Kodi nga Authenticator</label>
                  <input 
                    type="text" 
                    placeholder="" 
                    value={twoFaCode}
                    onChange={e => setTwoFaCode(e.target.value)}
                    maxLength={6}
                    style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '8px', padding: '15px', borderRadius: '12px', border: error2fa ? '2px solid #ef4444' : '2px solid #cbd5e1', outline: 'none', width: '100%', backgroundColor: '#f8fafc' }}
                    required 
                    autoFocus
                  />
                  {error2fa && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', fontWeight: 500 }}>{error2fa}</p>}
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading || twoFaCode.length !== 6}>
                  {loading ? <span className={styles.spinner}></span> : (
                    <>
                      Verifiko dhe Hyr <ArrowRight size={18} />
                    </>
                  )}
                </button>
                <button type="button" onClick={() => setShow2fa(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginTop: '15px', width: '100%', fontSize: '0.9rem', fontWeight: 500 }}>
                  Kthehu mbrapa
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Registration Success Modal Popup */}
      {showSuccessPopup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '450px', width: '100%', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', animation: 'scaleUp 0.3s ease' }}>
            <div style={{ color: 'var(--primary-color)', marginBottom: '16px' }}>
              <CheckCircle size={60} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Kërkesa u Dërgua!</h2>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Kërkesa juaj për regjistrimin e klinikës u krye me sukses. Ekipi ynë i mbështetjes do t'ju kontaktojë brenda pak orësh për aktivizimin e llogarisë.
            </p>
            <button 
              onClick={() => setShowSuccessPopup(false)}
              style={{ width: '100%', padding: '12px 24px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)', transition: 'background-color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
            >
              Kuptova
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
