'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, MessageCircle, Bell, Mail, Phone,
  Check, X, Send, Settings, Clock, Save,
  AlertCircle, Smartphone
} from 'lucide-react';
import styles from './notifications.module.css';

const WHATSAPP_GREEN = '#25D366';

export default function NotificationsPage() {
  const [wa, setWa] = useState({
    enabled: true,
    apiKey: '',
    phoneNumberId: '',
    reminderHours: '24',
    reminderMessage: 'Pershendetje {emri}! Ju kujtojmë se keni takim në klinikën tonë dentare nesër në orën {ora}. Ju lutemi konfirmoni prezencën tuaj.',
    confirmationMsg: 'Pershendetje {emri}! Takimi juaj u konfirmua për datën {data} në orën {ora}. Shihemi shpejt! 😊',
  });

  const [telegram, setTelegram] = useState({
    enabled: false,
    botToken: '',
    chatId: '',
  });

  const [sms, setSms] = useState({ enabled: false });
  const [email, setEmail] = useState({ enabled: false });
  const [saved, setSaved] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testSent, setTestSent] = useState(false);
  const [showTest, setShowTest] = useState(false);

  const [testTelegramSent, setTestTelegramSent] = useState(false);
  const [showTelegramTest, setShowTelegramTest] = useState(false);

  useEffect(() => {
    const savedTelegram = localStorage.getItem('telegram_settings');
    if (savedTelegram) {
      try {
        setTelegram(JSON.parse(savedTelegram));
      } catch (e) {
        console.error('Failed to parse telegram settings', e);
      }
    }
    const savedWa = localStorage.getItem('whatsapp_settings');
    if (savedWa) {
      try {
        setWa(JSON.parse(savedWa));
      } catch (e) {
        console.error('Failed to parse whatsapp settings', e);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('telegram_settings', JSON.stringify(telegram));
    localStorage.setItem('whatsapp_settings', JSON.stringify(wa));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone) return;
    const msg = encodeURIComponent(wa.reminderMessage.replace('{emri}', 'Pacient Test').replace('{ora}', '10:00').replace('{data}', '22/06/2026'));
    window.open(`https://wa.me/${testPhone.replace(/\s+/g, '').replace('+', '')}?text=${msg}`, 'whatsappWindow', 'width=800,height=600,left=200,top=100');
    setTestSent(true);
    setTimeout(() => { setTestSent(false); setShowTest(false); }, 3000);
  };

  const handleSendTelegramTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegram.botToken || !telegram.chatId) return;
    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '🔔 <b>Provë Njoftimi</b>\nKjo është një provë për të verifikuar nëse lidhja e Telegram API me Denthub.al CRM funksionon si duhet! ✅',
          bot_token: telegram.botToken,
          chat_id: telegram.chatId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTestTelegramSent(true);
        setTimeout(() => { setTestTelegramSent(false); setShowTelegramTest(false); }, 3000);
      } else {
        alert('Gabim: ' + (data.error || 'Nuk u dërgua mesazhi!'));
      }
    } catch (err) {
      console.error(err);
      alert('Ndodhi një gabim gjatë verifikimit.');
    }
  };

  return (
    <div className={`${styles.page} fade-in`}>
      <Link href="/settings" className={styles.backLink}>
        <ArrowLeft size={16} /> Kthehu te Cilësimet
      </Link>

      <header className={styles.header}>
        <div>
          <h1>Njoftimet & Rikujtimet</h1>
          <p className={styles.subtitle}>Konfiguro si dhe kur t'u dërgoni njoftime pacientëve</p>
        </div>
      </header>

      <form onSubmit={handleSave} className={styles.form}>

        {/* WhatsApp Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ backgroundColor: WHATSAPP_GREEN + '20', color: WHATSAPP_GREEN }}>
              <MessageCircle size={20} />
            </div>
            <div className={styles.sectionTitle}>
              <h2>WhatsApp</h2>
              <p>Rikujtues automatik dhe konfirmime përmes WhatsApp</p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" checked={wa.enabled} onChange={e => setWa({...wa, enabled: e.target.checked})} />
              <span className={styles.toggleSlider} style={{ backgroundColor: wa.enabled ? WHATSAPP_GREEN : undefined }} />
            </label>
          </div>

          {wa.enabled && (
            <div className={styles.sectionBody}>
              {/* Status banner */}
              <div className={styles.infoBanner}>
                <AlertCircle size={16} />
                <div>
                  <strong>Si funksionon?</strong> Sistemi dërgon mesazhe direkt nga WhatsApp Business API ose
                  (për fillim) hap WhatsApp Web me mesazhin parapërgatitur. Plotësoni API Key-n kur ta keni gati
                  nga <a href="https://business.whatsapp.com/" target="_blank" rel="noreferrer">Meta Business</a>.
                </div>
              </div>

              <div className={styles.fields}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>WhatsApp Business API Key</label>
                    <input
                      type="password"
                      placeholder="Plotëso pas aktivizimit të API"
                      value={wa.apiKey}
                      onChange={e => setWa({...wa, apiKey: e.target.value})}
                    />
                    <span className={styles.hint}>Merret nga Meta Business Platform</span>
                  </div>
                  <div className={styles.field}>
                    <label>Phone Number ID</label>
                    <input
                      type="text"
                      placeholder="Numri i telefon të biznesit"
                      value={wa.phoneNumberId}
                      onChange={e => setWa({...wa, phoneNumberId: e.target.value})}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label><Clock size={14} /> Dërgo rikujtime para (orë)</label>
                  <select value={wa.reminderHours} onChange={e => setWa({...wa, reminderHours: e.target.value})}>
                    <option value="1">1 orë para</option>
                    <option value="2">2 orë para</option>
                    <option value="12">12 orë para</option>
                    <option value="24">24 orë para (1 ditë)</option>
                    <option value="48">48 orë para (2 ditë)</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Mesazhi i Rikujtuesit</label>
                  <textarea
                    rows={3}
                    value={wa.reminderMessage}
                    onChange={e => setWa({...wa, reminderMessage: e.target.value})}
                  />
                  <span className={styles.hint}>
                    Variablat: <code>{'{emri}'}</code> <code>{'{ora}'}</code> <code>{'{data}'}</code>
                  </span>
                </div>

                <div className={styles.field}>
                  <label>Mesazhi i Konfirmimit</label>
                  <textarea
                    rows={2}
                    value={wa.confirmationMsg}
                    onChange={e => setWa({...wa, confirmationMsg: e.target.value})}
                  />
                </div>

                {/* Test send */}
                <div className={styles.testSection}>
                  {!showTest ? (
                    <button type="button" className={styles.testBtn} onClick={() => setShowTest(true)}>
                      <Send size={14} /> Dërgo Mesazh Provë
                    </button>
                  ) : (
                    <div className={styles.testForm}>
                      <Smartphone size={16} className={styles.testIcon} />
                      <input
                        type="tel"
                        placeholder="+355 69 XXX XXXX"
                        value={testPhone}
                        onChange={e => setTestPhone(e.target.value)}
                        autoFocus
                      />
                      <button type="button" className={styles.sendTestBtn} onClick={handleSendTest}>
                        {testSent ? <><Check size={14} /> U Dërgua!</> : <><Send size={14} /> Dërgo</>}
                      </button>
                      <button type="button" className={styles.cancelTestBtn} onClick={() => setShowTest(false)}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Telegram Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ backgroundColor: 'rgba(0,136,204,0.15)', color: '#0088cc' }}>
              <Send size={20} />
            </div>
            <div className={styles.sectionTitle}>
              <h2>Telegram</h2>
              <p>Dërgo njoftime dhe statistika të klinikës direkt në Telegram</p>
            </div>
            <label className={styles.toggle}>
              <input type="checkbox" checked={telegram.enabled} onChange={e => setTelegram({...telegram, enabled: e.target.checked})} />
              <span className={styles.toggleSlider} style={{ backgroundColor: telegram.enabled ? '#0088cc' : undefined }} />
            </label>
          </div>

          {telegram.enabled && (
            <div className={styles.sectionBody}>
              <div className={styles.infoBanner}>
                <AlertCircle size={16} />
                <div>
                  <strong>Si funksionon?</strong> Mund të merrni njoftime për pacientët e rinj, takimet ose faturat në një grup ose kanal në Telegram.
                  Për të filluar, krijoni një bot përmes <a href="https://t.me/BotFather" target="_blank" rel="noreferrer">@BotFather</a> dhe shtojeni atë si administrator në kanalin ose grupin tuaj.
                </div>
              </div>

              <div className={styles.fields}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Telegram Bot Token</label>
                    <input
                      type="password"
                      placeholder="P.sh. 123456789:ABCdefGhIJKlmNoPQRsT..."
                      value={telegram.botToken}
                      onChange={e => setTelegram({...telegram, botToken: e.target.value})}
                      required={telegram.enabled}
                    />
                    <span className={styles.hint}>Token-i i marrë nga @BotFather</span>
                  </div>
                  <div className={styles.field}>
                    <label>Telegram Chat ID</label>
                    <input
                      type="text"
                      placeholder="P.sh. -100123456789 ose ID individuale"
                      value={telegram.chatId}
                      onChange={e => setTelegram({...telegram, chatId: e.target.value})}
                      required={telegram.enabled}
                    />
                    <span className={styles.hint}>ID e grupit, kanalit, ose përdoruesit</span>
                  </div>
                </div>

                {/* Test send */}
                <div className={styles.testSection}>
                  {!showTelegramTest ? (
                    <button type="button" className={styles.testBtn} onClick={() => setShowTelegramTest(true)} disabled={!telegram.botToken || !telegram.chatId}>
                      <Send size={14} /> Dërgo Mesazh Provë
                    </button>
                  ) : (
                    <div className={styles.testForm}>
                      <span style={{ fontSize: '0.85rem', color: '#64748b', marginRight: '10px' }}>Dërgo një mesazh provë në Telegram?</span>
                      <button type="button" className={styles.sendTestBtn} onClick={handleSendTelegramTest} style={{ backgroundColor: '#0088cc', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                        {testTelegramSent ? <><Check size={14} /> U Dërgua!</> : <><Send size={14} /> Konfirmo Dërgimin</>}
                      </button>
                      <button type="button" className={styles.cancelTestBtn} onClick={() => setShowTelegramTest(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px' }}>
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SMS Section - Coming soon */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ backgroundColor: 'rgba(14,165,233,0.15)', color: '#0ea5e9' }}>
              <Phone size={20} />
            </div>
            <div className={styles.sectionTitle}>
              <h2>SMS</h2>
              <p>Rikujtues me SMS (disponibël së shpejti)</p>
            </div>
            <div className={styles.comingSoon}>Së shpejti</div>
          </div>
        </div>

        {/* Email Section - Coming soon */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon} style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
              <Mail size={20} />
            </div>
            <div className={styles.sectionTitle}>
              <h2>Email</h2>
              <p>Konfirmime dhe rikujtues me email (disponibël së shpejti)</p>
            </div>
            <div className={styles.comingSoon}>Së shpejti</div>
          </div>
        </div>

        {/* Save */}
        <div className={styles.saveRow}>
          <button type="submit" className="btn-primary">
            {saved ? <><Check size={16} /> U Ruajt!</> : <><Save size={16} /> Ruaj Cilësimet</>}
          </button>
        </div>
      </form>
    </div>
  );
}
