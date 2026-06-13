// src/pages/Resources.jsx

import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Shield, History, Map, HeadphonesIcon, User, LogOut, Lock, Search,
  Sparkles, Plus, ArrowUp, Home, Scale, Heart, Flag, ExternalLink,
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const C = {
  bg: '#f2f3ff',
  surface: '#ffffff',
  surfaceContainer: '#eaedff',
  primary: '#380080',
  primaryContainer: '#6d28d9',
  secondary: '#016a61',
  error: '#ba1a1a',
  onSurface: '#131b2e',
  onSurfaceVariant: '#4a4454',
  outlineVariant: '#ccc3d7',
};

const navItems = [
  { label: 'Home/Safety', icon: <Shield size={17} />, path: '/' },
  { label: 'SafeHer AI', icon: <HeadphonesIcon size={17} />, path: '/resources' },
  { label: 'Profile', icon: <User size={17} />, path: '/profile' },
];

const quickActions = [
  { label: 'Find Shelter', icon: <Home size={14} />, prompt: 'Help me find a shelter near me.' },
  { label: 'Legal Aid', icon: <Scale size={14} />, prompt: 'I need information about legal aid services.' },
  { label: 'Support Services', icon: <Heart size={14} />, prompt: 'What support services are available to me?' },
  { label: 'Report Concern', icon: <Flag size={14} />, prompt: 'I would like to report a concern.' },
];

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function Resources() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [activeNav, setActiveNav] = useState('Support');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hello. I am your SafeHer concierge. How may I assist you today? You can inquire about professional resources, legal aid, or support networks.",
      time: new Date(),
      links: [],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
      time: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          mode: 'resources',
          history: messages.map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();

      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.reply || data.message || "I'm sorry, I couldn't find an answer to that right now.",
        links: data.links || data.resources || [],
        time: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: "I'm having trouble connecting right now. Please try again, or use the SOS feature if this is an emergency.",
        links: [],
        time: new Date(),
        isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      fontFamily: "'Inter', system-ui, sans-serif",
      backgroundColor: C.bg,
      overflow: 'hidden',
    }}>

      {/* Sidebar */}
      <div style={{
        width: '220px', flexShrink: 0,
        backgroundColor: C.surface,
        borderRight: `1px solid ${C.outlineVariant}`,
        display: 'flex', flexDirection: 'column',
        padding: '20px 0',
      }}>
        <div style={{ padding: '0 18px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: C.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={17} color="#fff" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '500', fontSize: '16px', color: C.onSurface, lineHeight: 1.2, letterSpacing: '-0.02em' }}>SafeHer</p>
              <p style={{ margin: 0, fontSize: '10px', color: C.onSurfaceVariant, fontWeight: '400', letterSpacing: '0.04em' }}>PREMIUM</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const isActive = item.path === currentPath;
            return (
              <button
                key={item.label}
                onClick={() => { setActiveNav(item.label); navigate(item.path); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px',
                  padding: '10px 12px', borderRadius: '0.625rem',
                  border: 'none', cursor: 'pointer',
                  backgroundColor: isActive ? C.primary : 'transparent',
                  color: isActive ? '#fff' : C.onSurfaceVariant,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px', fontWeight: isActive ? '500' : '400',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '14px 10px 8px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%', padding: '12px',
              backgroundColor: C.error, border: 'none',
              borderRadius: '0.625rem', color: '#fff',
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px', fontWeight: '600',
              letterSpacing: '0.06em', cursor: 'pointer',
            }}>
            ACTIVATE SOS
          </button>
        </div>

        <div style={{ padding: '6px 10px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { icon: <Lock size={15} />, label: 'Security Settings' },
            { icon: <LogOut size={15} />, label: 'Logout' },
          ].map((item) => (
            <button key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '9px 12px', borderRadius: '0.625rem',
              border: 'none', cursor: 'pointer',
              backgroundColor: 'transparent', color: C.onSurfaceVariant,
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px', fontWeight: '400',
            }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{
          height: '52px', backgroundColor: C.surface,
          borderBottom: `1px solid ${C.outlineVariant}`,
          display: 'flex', alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 24px', flexShrink: 0, gap: '14px',
        }}>
          <Search size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
          <div style={{
            width: '32px', height: '32px', borderRadius: '9999px',
            backgroundColor: C.primaryContainer,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <User size={15} color="#fff" />
          </div>
        </div>

        {/* Scrollable content area */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '0 40px' }}>

          {/* Page header */}
          <div style={{ textAlign: 'center', padding: '28px 24px 24px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              backgroundColor: C.surfaceContainer,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
            }}>
              <Sparkles size={24} color={C.primary} />
            </div>
            <h1 style={{
              margin: '0 0 5px', fontSize: '20px', fontWeight: '400',
              color: C.onSurface, letterSpacing: '-0.02em',
            }}>Service Assistant</h1>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '300', color: C.onSurfaceVariant }}>
              Concierge-level support for your safety and well-being.
            </p>
          </div>

          {/* Messages */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '18px',
            maxWidth: '900px', margin: '0 auto', paddingBottom: '24px',
          }}>
            {messages.map((msg) => (
              msg.role === 'assistant' ? (
                <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '0.75rem',
                    backgroundColor: C.surface, border: `1px solid ${C.outlineVariant}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Sparkles size={16} color={C.primary} />
                  </div>
                  <div style={{
                    backgroundColor: C.surface,
                    borderRadius: '1rem',
                    padding: '16px 20px',
                    flex: 1,
                    border: msg.isError ? `1px solid ${C.error}` : 'none',
                  }}>
                    <p style={{
                      margin: 0, fontSize: '14px', fontWeight: '400',
                      color: C.onSurface, lineHeight: 1.55,
                      whiteSpace: 'pre-wrap',
                    }}>
                      {msg.text}
                    </p>

                    {msg.links && msg.links.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                        {msg.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '12px 16px', borderRadius: '0.75rem',
                              backgroundColor: C.bg, border: `1px solid ${C.outlineVariant}`,
                              textDecoration: 'none', color: 'inherit',
                            }}
                          >
                            <div>
                              <p style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: C.onSurface }}>
                                {link.name || link.title}
                              </p>
                              {(link.distance || link.hours) && (
                                <p style={{ margin: '2px 0 0', fontSize: '12px', fontWeight: '300', color: C.onSurfaceVariant }}>
                                  {link.distance ? `${link.distance}` : ''}{link.distance && link.hours ? ' • ' : ''}{link.hours || ''}
                                </p>
                              )}
                            </div>
                            <ExternalLink size={14} color={C.primaryContainer} />
                          </a>
                        ))}
                      </div>
                    )}

                    <p style={{ margin: '12px 0 0', fontSize: '11px', fontWeight: '300', color: C.onSurfaceVariant }}>
                      {formatTime(msg.time)}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', gap: '12px' }}>
                  <div style={{
                    backgroundColor: C.surfaceContainer,
                    borderRadius: '1rem',
                    padding: '16px 20px',
                    maxWidth: '70%',
                  }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '400', color: C.onSurface, lineHeight: 1.55 }}>
                      {msg.text}
                    </p>
                    <p style={{ margin: '12px 0 0', fontSize: '11px', fontWeight: '300', color: C.onSurfaceVariant, textAlign: 'right' }}>
                      {formatTime(msg.time)}
                    </p>
                  </div>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '0.75rem',
                    backgroundColor: C.primary,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <User size={16} color="#fff" />
                  </div>
                </div>
              )
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '0.75rem',
                  backgroundColor: C.surface, border: `1px solid ${C.outlineVariant}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Sparkles size={16} color={C.primary} />
                </div>
                <div style={{
                  backgroundColor: C.surface, borderRadius: '1rem',
                  padding: '16px 20px', display: 'flex', gap: '5px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: '6px', height: '6px', borderRadius: '9999px',
                      backgroundColor: C.outlineVariant,
                      animation: `typingDot 1.2s ${i * 0.15}s infinite ease-in-out`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar: quick actions + input */}
        <div style={{ padding: '12px 40px 14px', flexShrink: 0 }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>

            {/* Quick action chips */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => sendMessage(qa.prompt)}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    padding: '9px 16px', borderRadius: '9999px',
                    border: `1px solid ${C.outlineVariant}`,
                    backgroundColor: C.surface,
                    color: C.onSurface,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '12px', fontWeight: '400',
                    cursor: loading ? 'default' : 'pointer',
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {qa.icon}
                  {qa.label}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <form onSubmit={handleSubmit} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              backgroundColor: C.surface, borderRadius: '0.875rem',
              border: `1px solid ${C.outlineVariant}`,
              padding: '8px 10px 8px 16px',
            }}>
              <button type="button" style={{
                width: '28px', height: '28px', flexShrink: 0,
                borderRadius: '9999px', border: `1px solid ${C.outlineVariant}`,
                backgroundColor: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Plus size={15} color={C.onSurfaceVariant} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Inquire here..."
                disabled={loading}
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px', fontWeight: '400', color: C.onSurface,
                  padding: '6px 0',
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  width: '36px', height: '36px', flexShrink: 0,
                  borderRadius: '0.625rem', border: 'none',
                  backgroundColor: C.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: (loading || !input.trim()) ? 'default' : 'pointer',
                  opacity: (loading || !input.trim()) ? 0.5 : 1,
                }}
              >
                <ArrowUp size={16} color="#fff" />
              </button>
            </form>
          </div>

          <p style={{
            margin: '12px 0 0', fontSize: '10px', fontWeight: '300',
            color: C.onSurfaceVariant, letterSpacing: '0.05em', textAlign: 'center',
          }}>
            IN CASE OF IMMEDIATE DANGER, PLEASE USE THE SOS FEATURE.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30% { opacity: 1; transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}