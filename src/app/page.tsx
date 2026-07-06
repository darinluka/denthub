'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Stethoscope, Users, Calendar, FlaskConical, Banknote, MessageSquare,
  Phone, Mail, MapPin, ChevronDown, ChevronUp, ArrowRight, Lock, ShieldCheck, Check
} from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Contact Form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  const faqs = [
    {
      q: 'A funksionon Denthub.al në celular dhe pajisje mobile?',
      a: 'Po, absolutisht! Platforma është ndërtuar me teknologjinë më të fundit responsive. Ajo përshtatet automatikisht dhe punon në mënyrë të përsosur në çdo celular (iOS dhe Android), tablet, si dhe në kompjuterë apo laptopë pa pasur nevojë të instaloni asgjë.'
    },
    {
      q: 'Si mund ta regjistroj klinikën tim dentare?',
      a: 'Regjistrimi është shumë i thjeshtë: klikoni butonin "Hyr në Aplikacion", zgjidhni "Regjistro klinikën tënde", plotësoni emrin tuaj, email-in, telefonin dhe emrin e klinikës. Administratori i platformës sonë do ta aktivizojë llogarinë tuaj menjëherë dhe do të njoftoheni me email.'
    },
    {
      q: 'A janë të dhënat e pacientëve dhe klinikës time të sigurta?',
      a: 'Siguria është prioriteti ynë kryesor. Denthub.al përdor arkitekturën "Multi-Tenant" të izolimit të databazës në nivel klient-anësor. Të dhënat tuaja ruhen në mënyrë krejtësisht të ndarë dhe të izoluar nën çelësin tuaj të vetëm, duke garantuar që asnjë klinikë tjetër nuk ka akses tek ato.'
    },
    {
      q: 'A mund të konfiguroj çmimet e mia të shërbimeve dhe trajtimeve?',
      a: 'Po! Çdo klinikë ka panelin e saj të cilësimeve ku mund të shtojë, modifikojë ose fshijë shërbimet (trajtimet) dhe çmimet përkatëse. Këto trajtime dhe çmime merren automatikisht edhe gjatë krijimit të faturave të pacientit për të shmangur llogaritjet manuale.'
    },
    {
      q: 'Si funksionon integrimi me WhatsApp dhe Telegram?',
      a: 'Nga paneli i cilësimeve, ju mund të vendosni çelësat tuaj API për të lidhur platformën me kanalet tuaja. Aplikacioni dërgon njoftime automatike tek pacientët tuaj për takimet e tyre përmes WhatsApp-it dhe njoftime push në Telegram për mjekët.'
    }
  ];

  const features = [
    {
      icon: Users,
      title: 'Menaxhimi i Pacientëve',
      desc: 'Regjistroni pacientë të rinj, mbani kartela mjekësore të detajuara, shikoni historikun e vizitave dhe odontogramin e plotë për secilin.',
      color: '#059669'
    },
    {
      icon: Calendar,
      title: 'Kalendari i Takimeve',
      desc: 'Planifikoni vizitat në mënyrë vizuale me orare të qarta. Kontrolloni kohëzgjatjen dhe statusin e takimit në kohë reale.',
      color: '#0ea5e9'
    },
    {
      icon: FlaskConical,
      title: 'Laboratori & Porositë',
      desc: 'Dërgoni porosi direkte te laboratorët partnerë (kurora zirkoni, proteza, etj.) dhe ndiqni statusin e prodhimit të tyre.',
      color: '#f59e0b'
    },
    {
      icon: Banknote,
      title: 'Financat & Faturat',
      desc: 'Krijoni fatura të shpejta për pacientët duke zgjedhur trajtimet e kryera. Printoni faturat me një klikim dhe monitoroni të ardhurat.',
      color: '#7c3aed'
    },
    {
      icon: MessageSquare,
      title: 'Automatizimi i Njoftimeve',
      desc: 'Konfiguroni rikujtuesit automatikë për pacientët në WhatsApp për të reduktuar takimet e humbura dhe njoftimet e stafi në Telegram.',
      color: '#25D366'
    },
    {
      icon: Lock,
      title: 'Siguri e Lartë Multi-Tenant',
      desc: 'Databaza, çelësat API, dhe të dhënat tuaja mjekësore janë plotësisht të izoluara dhe të siguruara me kriptim modern.',
      color: '#4f46e5'
    }
  ];

  const screenshots = [
    {
      url: '/images/screenshot_1.png',
      title: 'Faqja e Hyrjes (Login)',
      desc: 'Paneli i sigurt i hyrjes në sistem për stafin dhe mjekët me udhëzues të integruar.'
    },
    {
      url: '/images/screenshot_2.png',
      title: 'Njoftimet & Rikujtimet (WhatsApp / Telegram)',
      desc: 'Konfigurimi i thjeshtë i mesazheve automatike rikujtuese për takimet e pacientëve tuaj.'
    },
    {
      url: '/images/screenshot_3.png',
      title: 'Menaxhimi i Laboratorit',
      desc: 'Ndiqni statusin e kurorave të zirkonit, implanteve dhe urave në kohë reale me laboratorët partnerë.'
    },
    {
      url: '/images/screenshot_4.png',
      title: 'Pasqyra Financiare e Klinikës',
      desc: 'Grafikë analitikë dhe raporte të të ardhurave javore/mujore, faturave dhe trajtimeve.'
    },
    {
      url: '/images/screenshot_5.png',
      title: 'Stafi & Rolet',
      desc: 'Menaxhimi i mjekëve, recepsionistëve dhe asistentëve dhe caktimi i niveleve të aksesit.'
    }
  ];

  return (
    <div className={styles.landing}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <a href="#" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Stethoscope size={20} />
          </div>
          <span>denthub.al</span>
        </a>
        <div className={styles.navLinks}>
          <a href="#vecorite" className={styles.navLink}>Veçoritë</a>
          <a href="#screenshotet" className={styles.navLink}>Galeria</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
          <a href="#kontakti" className={styles.navLink}>Kontakti</a>
          <Link href="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', padding: '10px 20px', fontSize: '0.88rem' }}>
            Hyr në Aplikacion <ArrowRight size={15} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <span className={styles.heroTag}>Zgjidhja Inteligjente CRM për Stomatologji</span>
        <h1 className={styles.heroTitle}>
          Sistemi Modern për Menaxhimin e <span>Klinikës Suaj Dentare</span>
        </h1>
        <p className={styles.heroSub}>
          Menaxhoni pacientët, takimet, laboratorin dhe financat e klinikës suaj në një vend të vetëm. Thjeshtë, shpejt dhe me izolim të plotë të të dhënave tuaja.
        </p>
        <div className={styles.heroButtons}>
          <Link href="/login" className={styles.heroBtnPrimary}>
            Provo Aplikacionin Falas <ArrowRight size={18} />
          </Link>
          <a href="#screenshotet" className={styles.heroBtnSecondary}>
            Shiko Demot
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="vecorite" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Çfarë Ofron Denthub.al?</h2>
          <p>Çdo gjë që ju nevojitet për të dixhitalizuar dhe automatizuar punën e përditshme në klinikë.</p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ backgroundColor: f.color + '15', color: f.color }}>
                  <Icon size={22} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Statistics Showcase */}
      <section className={styles.stats}>
        <div>
          <div className={styles.statVal}>+50%</div>
          <div className={styles.statDesc}>Kohë e Kursyer Çdo Ditë</div>
        </div>
        <div>
          <div className={styles.statVal}>100%</div>
          <div className={styles.statDesc}>Izolim & Siguri e të Dhënave</div>
        </div>
        <div>
          <div className={styles.statVal}>24/7</div>
          <div className={styles.statDesc}>Aksesueshmëri në Çdo Pajisje</div>
        </div>
      </section>

      {/* Screenshot Showcase Gallery */}
      <section id="screenshotet" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Eksploroni Platformën</h2>
          <p>Shikoni disa nga pamjet kryesore të sistemit tonë dentar CRM në kohë reale.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {screenshots.map((s, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              <div
                onClick={() => setActiveImage(s.url)}
                style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f1f5f9', borderBottom: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', cursor: 'zoom-in' }}
              >
                <img
                  src={s.url}
                  alt={s.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{s.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Pyetjet e Shpeshta (FAQ)</h2>
          <p>Keni pyetje për sistemin? Këtu janë disa nga përgjigjet kryesore për Denthub.al.</p>
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, i) => (
            <div key={i} className={styles.faqItem}>
              <button className={styles.faqQuestion} onClick={() => toggleFaq(i)}>
                <span>{faq.q}</span>
                {activeFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {activeFaq === i && (
                <div className={styles.faqAnswer}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakti" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Na Kontaktoni</h2>
          <p>Keni pyetje, sugjerime apo keni nevojë për ndihmë? Mos hezitoni të na shkruani.</p>
        </div>

        <div className={styles.contactGrid}>
          {/* Info */}
          <div className={styles.contactInfo}>
            <h3>Mbetemi në Kontakt</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>
              Ekipi ynë është i gatshëm t'ju ndihmojë për çdo paqartësi ose konfigurim teknik të platformës CRM në klinikën tuaj.
            </p>

            <div className={styles.contactDetails}>
              <div className={styles.contactDetailItem}>
                <div className={styles.contactDetailIcon}>
                  <Mail size={18} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>Na shkruani në email</span>
                  <a href="mailto:denthubal@gmail.com" style={{ fontSize: '0.92rem', color: '#0f172a', textDecoration: 'none', fontWeight: 'bold' }}>denthubal@gmail.com</a>
                </div>
              </div>

              <div className={styles.contactDetailItem}>
                <div className={styles.contactDetailIcon}>
                  <Phone size={18} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>Na telefononi</span>
                  <a href="tel:+355689901579" style={{ fontSize: '0.92rem', color: '#0f172a', textDecoration: 'none', fontWeight: 'bold' }}>+355 68 990 1579</a>
                </div>
              </div>

              <div className={styles.contactDetailItem}>
                <div className={styles.contactDetailIcon}>
                  <MapPin size={18} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b' }}>Adresa</span>
                  <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Tiranë, Shqipëri</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form className={styles.contactForm} onSubmit={handleContactSubmit}>
            <div className={styles.formGroup}>
              <label>Emri Juaj</label>
              <input
                type="text"
                placeholder="Shkruani emrin tuaj..."
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email i Kontaktit</label>
              <input
                type="email"
                placeholder="shembull@email.com"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Mesazhi</label>
              <textarea
                rows={4}
                placeholder="Shkruani mesazhin ose pyetjen tuaj këtu..."
                value={contactMessage}
                onChange={e => setContactMessage(e.target.value)}
                required
                style={{ resize: 'none' }}
              />
            </div>

            {submitted && (
              <div style={{ color: 'var(--success-color)', fontSize: '0.88rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> Faleminderit! Mesazhi juaj u dërgua me sukses.
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ padding: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Dërgo Mesazhin
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <a href="#" className={styles.logo} style={{ color: 'white' }}>
              <div className={styles.logoIcon} style={{ backgroundColor: '#10b981' }}>
                <Stethoscope size={20} />
              </div>
              <span>denthub.al</span>
            </a>
            <p>Sistemi më i avancuar CRM për menaxhimin inteligjent të klinikave stomatologjike në Shqipëri.</p>
          </div>

          <div className={styles.footerCol}>
            <h4>Platforma</h4>
            <div className={styles.footerLinks}>
              <a href="#vecorite" className={styles.footerLink}>Veçoritë</a>
              <a href="#screenshotet" className={styles.footerLink}>Galeria</a>
              <Link href="/login" className={styles.footerLink}>Hyr në CRM</Link>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4>Mbështetja</h4>
            <div className={styles.footerLinks}>
              <a href="#faq" className={styles.footerLink}>Pyetjet e Shpeshta</a>
              <a href="#kontakti" className={styles.footerLink}>Na Kontaktoni</a>
              <span className={styles.footerLink} style={{ cursor: 'default' }}>Statusi: Online</span>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div>&copy; {new Date().getFullYear()} denthub.al. Të gjitha të drejtat të rezervuara.</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" className={styles.footerLink}>Politika e Privatësisë</a>
            <a href="#" className={styles.footerLink}>Kushtet e Përdorimit</a>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal Overlay */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(8px)', cursor: 'zoom-out', transition: 'opacity 0.2s ease-in-out' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '1200px', width: '100%', maxHeight: '85vh', overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', backgroundColor: '#1e293b' }}
          >
            <img
              src={activeImage}
              alt="Fullscreen Preview"
              style={{ width: '100%', height: 'auto', maxHeight: '85vh', display: 'block', objectFit: 'contain' }}
            />
            <button
              onClick={() => setActiveImage(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', color: 'white', border: 'none', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.9)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.6)'}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
