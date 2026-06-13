// src/pages/Profile.jsx

import { useNavigate, useLocation } from 'react-router-dom';
import {
  Shield, History, Map, HeadphonesIcon, User, LogOut, Lock,
  Bell, Wifi, Settings, Star, CreditCard, Image, Users,
  Fingerprint, ShieldCheck, Trash2, ChevronRight, PlusCircle, MoreVertical,
} from 'lucide-react';

const C = {
  bg: '#f0f0f8',
  surface: '#ffffff',
  surfaceLow: '#f2f3ff',
  surfaceContainer: '#eaedff',
  primary: '#380080',
  primaryContainer: '#6d28d9',
  secondary: '#016a61',
  secondaryContainer: '#86f2e4',
  onSecondaryContainer: '#0d6f66',
  error: '#ba1a1a',
  onSurface: '#131b2e',
  onSurfaceVariant: '#4a4454',
  outlineVariant: '#ccc3d7',
};

const navItems = [
  { label: 'Home/Safety', icon: <Shield size={17} />, path: '/' },
  { label: 'SafeHer AI', icon: <HeadphonesIcon size={17} />, path: '/resources' },
  { label: 'Resource Map', icon: <Map size={17} />, path: '/resources-map' },
  { label: 'Profile', icon: <User size={17} />, path: '/profile' },
];

const contacts = [
  {
    name: 'David Vance',
    relation: 'Father',
    phone: '(555) 987-6543',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  },
  {
    name: 'Sarah Jenkins',
    relation: 'Best Friend',
    phone: '(555) 444-2211',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  },
];

const guardianAvatars = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=faces',
];

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

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
        <div style={{ padding: '0 18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: C.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={17} color="#fff" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: '500', fontSize: '17px', color: C.onSurface, lineHeight: 1.2, letterSpacing: '-0.02em' }}>SafeHer</p>
              <p style={{ margin: 0, fontSize: '10px', color: C.onSurfaceVariant, fontWeight: '400', letterSpacing: '0.04em' }}>Command Center</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const isActive = item.path === currentPath;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
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
          <button style={{
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
          justifyContent: 'space-between',
          padding: '0 24px', flexShrink: 0,
        }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: C.primary, letterSpacing: '-0.01em' }}>
            Profile
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '9999px',
              backgroundColor: C.secondaryContainer,
              fontSize: '12px', fontWeight: '500', color: C.onSecondaryContainer,
              letterSpacing: '0.04em',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '9999px',
                backgroundColor: C.secondary,
                animation: 'pulseDot 2s infinite',
              }} />
              Live Secure
            </div>
            <Bell size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <Wifi size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <Settings size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <div style={{
              width: '32px', height: '32px', borderRadius: '9999px',
              overflow: 'hidden', flexShrink: 0, cursor: 'pointer',
              border: `1px solid ${C.outlineVariant}`,
            }}>
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 36px' }}>

          {/* Header card */}
          <div style={{
            backgroundColor: C.surface, borderRadius: '1.25rem',
            border: `1px solid ${C.outlineVariant}`,
            padding: '24px', marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '24px',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '110px', height: '110px', borderRadius: '1rem',
                overflow: 'hidden', border: `1px solid ${C.outlineVariant}`,
              }}>
                <img
                  src="https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=faces"
                  alt="Elena Vance"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                position: 'absolute', bottom: '-6px', right: '-6px',
                width: '32px', height: '32px', borderRadius: '0.625rem',
                backgroundColor: C.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `2px solid ${C.surface}`,
                cursor: 'pointer',
              }}>
                <Settings size={15} color="#fff" />
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: C.onSurface, letterSpacing: '-0.02em' }}>
                  Elena Vance
                </h2>
              
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '400', color: C.onSurfaceVariant }}>
                San Francisco, CA &bull; Member since Jan 2024
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{
                  padding: '11px 22px', borderRadius: '0.625rem',
                  border: 'none', backgroundColor: C.primary,
                  color: '#fff', fontFamily: "'Inter', sans-serif",
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>
                  Edit Profile
                </button>
                <button style={{
                  padding: '11px 22px', borderRadius: '0.625rem',
                  border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface,
                  color: C.onSurface, fontFamily: "'Inter', sans-serif",
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}>
                  Download Safety Report
                </button>
              </div>
            </div>
          </div>

          {/* Lower grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' }}>

            {/* Personal details */}
            <div style={{
              backgroundColor: C.surface, borderRadius: '1.25rem',
              border: `1px solid ${C.outlineVariant}`,
              padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '0.75rem',
                  backgroundColor: C.secondaryContainer,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Image size={18} color={C.onSecondaryContainer} />
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: C.onSurface }}>
                  Personal Details
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                {[
                  { label: 'FULL NAME', value: 'Elena Maricela Vance' },
                  { label: 'EMAIL ADDRESS', value: 'elena.v@safeher.io' },
                  { label: 'PHONE NUMBER', value: '+1 (555) 012-3456' },
                  { label: 'HOME BASE', value: 'SOMA, San Francisco' },
                ].map((f) => (
                  <div key={f.label}>
                    <p style={{ margin: '0 0 5px', fontSize: '10px', fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: '0.08em' }}>
                      {f.label}
                    </p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: C.onSurface }}>
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: `1px solid ${C.outlineVariant}`, paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: C.onSurface }}>
                    Trusted Emergency Contacts
                  </h4>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    border: 'none', backgroundColor: 'transparent',
                    color: C.primary, fontWeight: '600', fontSize: '13px',
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                  }}>
                    <PlusCircle size={16} />
                    Add New
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {contacts.map((c) => (
                    <div key={c.name} style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px', borderRadius: '0.875rem',
                      backgroundColor: C.surfaceLow,
                    }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '9999px',
                        overflow: 'hidden', flexShrink: 0,
                      }}>
                        <img src={c.photo} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '700', color: C.onSurface }}>
                          {c.name}
                        </p>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '400', color: C.onSurfaceVariant }}>
                          {c.relation} &bull; {c.phone}
                        </p>
                      </div>
                      <MoreVertical size={16} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Guardian Network */}
              <div style={{
                backgroundColor: C.surfaceLow, borderRadius: '1.25rem',
                padding: '22px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '0.875rem',
                    backgroundColor: C.surfaceContainer,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Users size={20} color={C.primary} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: C.onSurface, lineHeight: 1.2 }}>
                    Guardian<br />Network
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: C.onSurface }}>Network Visibility</span>
                  <div style={{
                    width: '38px', height: '21px', borderRadius: '9999px',
                    backgroundColor: C.primary, position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute', top: '2.5px', left: '19px',
                      width: '16px', height: '16px', borderRadius: '9999px',
                      backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }} />
                  </div>
                </div>

                <div style={{
                  backgroundColor: C.surface, borderRadius: '1rem',
                  padding: '16px', textAlign: 'center',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                    {guardianAvatars.map((src, i) => (
                      <div key={i} style={{
                        width: '36px', height: '36px', borderRadius: '9999px',
                        overflow: 'hidden', border: `2px solid ${C.surface}`,
                        marginLeft: i === 0 ? 0 : '-10px',
                      }}>
                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '9999px',
                      backgroundColor: C.surfaceContainer,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginLeft: '-10px', border: `2px solid ${C.surface}`,
                      fontSize: '12px', fontWeight: '700', color: C.primary,
                    }}>
                      +12
                    </div>
                  </div>
                  <p style={{ margin: '0 0 14px', fontSize: '13px', fontWeight: '500', color: C.onSurfaceVariant }}>
                    Active Guardians Nearby
                  </p>
                  <button style={{
                    width: '100%', padding: '11px',
                    borderRadius: '0.75rem', border: 'none',
                    backgroundColor: C.surfaceContainer,
                    color: C.primary, fontFamily: "'Inter', sans-serif",
                    fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                  }}>
                    Manage Network
                  </button>
                </div>
              </div>

              {/* Security & Privacy */}
              <div style={{
                backgroundColor: C.surface, borderRadius: '1.25rem',
                border: `1px solid ${C.outlineVariant}`,
                padding: '22px',
              }}>
                <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: '0.08em' }}>
                  SECURITY &amp; PRIVACY
                </p>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 0', borderBottom: `1px solid ${C.outlineVariant}`,
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Fingerprint size={18} color={C.onSurface} />
                      <span style={{ fontSize: '14px', fontWeight: '500', color: C.onSurface }}>Biometric Auth</span>
                    </div>
                    <ChevronRight size={16} color={C.onSurfaceVariant} />
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 0', borderBottom: `1px solid ${C.outlineVariant}`,
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Lock size={18} color={C.onSurface} />
                      <span style={{ fontSize: '14px', fontWeight: '500', color: C.onSurface }}>Privacy Shield</span>
                    </div>
                    <ShieldCheck size={18} color={C.secondary} />
                  </div>

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 0',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Trash2 size={18} color={C.error} />
                      <span style={{ fontSize: '14px', fontWeight: '500', color: C.error }}>Delete Account</span>
                    </div>
                    <ChevronRight size={16} color={C.error} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}