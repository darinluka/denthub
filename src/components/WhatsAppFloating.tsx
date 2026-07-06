'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Check } from 'lucide-react';
import { useEffect } from 'react';

export default function WhatsAppFloating() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [showOnLanding, setShowOnLanding] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const enabled = localStorage.getItem('show_wa_on_landing') === 'true';
      setShowOnLanding(enabled);
    }
  }, [pathname]);

  if (pathname === '/login') return null;
  if (pathname === '/' && !showOnLanding) return null;

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
      {/* Chat Window */}
      {isOpen && (
        <div style={{ width: '350px', height: '500px', backgroundColor: '#efeae2', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', border: '1px solid #d1d5db', animation: 'slideUp 0.3s ease', position: 'relative' }}>
          {/* Header */}
          <div style={{ backgroundColor: '#075e54', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#128c7e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                <MessageCircle size={20} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Mesazhet</h3>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Biseda të hapura</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }}><X size={20}/></button>
          </div>

          {/* Chat List View */}
          <div style={{ flex: 1, backgroundColor: 'white', overflowY: 'auto' }}>
            {/* Contact 1 */}
            <div onClick={() => setActiveChat('Arben Kola')} style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor='white'}>
               <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#0ea5e9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
               <div style={{ flex: 1, minWidth: 0 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                   <span style={{ fontWeight: 600, color: '#1e293b' }}>Arben Kola</span>
                   <span style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>15:42</span>
                 </div>
                 <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>A keni ndonjë orar të lirë sot?</p>
               </div>
               <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#22c55e', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', alignSelf: 'center', flexShrink: 0 }}>1</div>
            </div>

            {/* Contact 2 */}
            <div onClick={() => setActiveChat('Ermal Doci')} style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '12px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor='white'}>
               <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>E</div>
               <div style={{ flex: 1, minWidth: 0 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                   <span style={{ fontWeight: 600, color: '#1e293b' }}>Ermal Doci</span>
                   <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Dje</span>
                 </div>
                 <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Kur ta keni gati faturën, ma dërgoni.</p>
               </div>
            </div>
          </div>

          {/* Active Chat Overlay */}
          {activeChat && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: '#efeae2', display: 'flex', flexDirection: 'column', zIndex: 20, animation: 'slideInRight 0.2s ease' }}>
              <div style={{ backgroundColor: '#075e54', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', color: 'white' }}>
                <button onClick={() => setActiveChat(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'white', padding: 0, display: 'flex', alignItems: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#128c7e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {activeChat[0]}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>{activeChat}</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online</span>
                </div>
              </div>
              
              <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 <div style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '0 12px 12px 12px', maxWidth: '85%', boxShadow: '0 1px 1px rgba(0,0,0,0.1)' }}>
                  <p style={{ margin: 0, color: '#111b21', fontSize: '0.9rem' }}>Përshëndetje! Unë jam {activeChat}. Kam një pyetje rreth takimit tim të radhës.</p>
                  <span style={{ fontSize: '0.65rem', color: '#667781', display: 'block', textAlign: 'right', marginTop: '4px' }}>Dje 14:30</span>
                </div>
                
                {activeChat === 'Arben Kola' && (
                  <div style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', padding: '10px 14px', borderRadius: '0 12px 12px 12px', maxWidth: '85%', boxShadow: '0 1px 1px rgba(0,0,0,0.1)', marginTop: '5px' }}>
                    <p style={{ margin: 0, color: '#111b21', fontSize: '0.9rem' }}>A keni ndonjë orar të lirë sot?</p>
                    <span style={{ fontSize: '0.65rem', color: '#667781', display: 'block', textAlign: 'right', marginTop: '4px' }}>15:42</span>
                  </div>
                )}
              </div>
              
              {/* Input Area */}
              <div style={{ backgroundColor: '#f0f2f5', padding: '12px 15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Shkruaj një mesazh..." 
                  style={{ flex: 1, padding: '12px 15px', borderRadius: '24px', border: 'none', outline: 'none', fontSize: '0.9rem' }} 
                />
                <button style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#00a884', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                  <span style={{ transform: 'rotate(-45deg)', marginLeft: '3px', marginTop: '-2px', fontSize: '1rem' }}>➤</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#25D366', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)', transition: 'transform 0.2s', transform: isOpen ? 'scale(0.9)' : 'scale(1)' }}
      >
        <MessageCircle size={30} />
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
