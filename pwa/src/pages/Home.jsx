// src/pages/Home.jsx

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Shield, History, Map, HeadphonesIcon, User, LogOut,
  Bell, Wifi, MapPin, Users, ChevronRight,
  Smartphone, Mic, Power, Lock
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { triggerSOS } from '../services/api';

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

export default function Home() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const currentPath = routeLocation.pathname;
  const { location, error: gpsError, getLocation } = useGeolocation();
  const [sosLoading, setSosLoading] = useState(false);
  const [sosError, setSosError] = useState(null);
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [activeNav, setActiveNav] = useState('Home/Safety');

  useEffect(() => {
    let interval;
    if (holding) {
      interval = setInterval(() => {
        setHoldProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            handleSOS();
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [holding]);

  const handleSOS = async () => {
    setHolding(false);
    setSosLoading(true);
    setSosError(null);
    getLocation();
  };

  useEffect(() => {
    if (!location || !sosLoading) return;
    const send = async () => {
      try {
        const data = await triggerSOS(location.lat, location.lng);
        navigate('/active', { state: { incidentId: data.incident_id, location } });
      } catch (err) {
        setSosError('Failed to send SOS. Try again.');
        setSosLoading(false);
      }
    };
    send();
  }, [location]);

const navItems = [
  { label: 'Home/Safety', icon: <Shield size={17} />, path: '/' },
  { label: 'SafeHer AI', icon: <HeadphonesIcon size={17} />, path: '/resources' },
  { label: 'Resource Map', icon: <Map size={17} />, path: '/resources-map' },
  { label: 'Profile', icon: <User size={17} />, path: '/profile' },
];

  const [powerPressCount, setPowerPressCount] = useState(0);
  const [powerTimer, setPowerTimer] = useState(null);

  const handlePowerPattern = () => {
    setPowerPressCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        handleSOS();
        return 0;
      }
      return next;
    });
    if (powerTimer) clearTimeout(powerTimer);
    setPowerTimer(setTimeout(() => setPowerPressCount(0), 2000));
  };

  const triggers = [
    {
      icon: <Smartphone size={24} color={C.secondary} />,
      label: 'Shake to Help',
      sub: 'Automatic trigger on high-frequency movement detection.',
      status: 'READY',
    },
    {
      icon: <Mic size={24} color={C.secondary} />,
      label: 'Voice Keyword',
      sub: '"Guardian" phrase monitoring active in background.',
      status: 'LISTENING',
    },
    {
      icon: <Power size={24} color={C.secondary} />,
      label: 'Power Pattern',
      sub: '5 quick presses triggers silent emergency protocol.',
      status: 'ACTIVE',
    },
  ];

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
        width: '220px',
        flexShrink: 0,
        backgroundColor: C.surface,
        borderRight: `1px solid ${C.outlineVariant}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
      }}>
        {/* Logo */}
        <div style={{ padding: '0 18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={22} color={C.primary} fill={C.primary} />
            <div>
              <p style={{ margin: 0, fontWeight: '500', fontSize: '17px', color: C.onSurface, lineHeight: 1.2, letterSpacing: '-0.02em' }}>SafeHer</p>
              <p style={{ margin: 0, fontSize: '10px', color: C.onSurfaceVariant, fontWeight: '400', letterSpacing: '0.04em' }}>Personal Command Center</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const isActive = item.path === currentPath;
            return (
              <button
                key={item.label}
                onClick={() => { setActiveNav(item.label); navigate(item.path); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px',
                  padding: '9px 12px',
                  borderRadius: '0.625rem',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? C.primary : 'transparent',
                  color: isActive ? '#fff' : C.onSurfaceVariant,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px',
                  fontWeight: isActive ? '500' : '400',
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

        {/* Activate SOS */}
        <div style={{ padding: '14px 10px 8px' }}>
          <button
            onMouseDown={() => !sosLoading && setHolding(true)}
            onMouseUp={() => setHolding(false)}
            onMouseLeave={() => setHolding(false)}
            disabled={sosLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: C.error,
              border: 'none',
              borderRadius: '0.625rem',
              color: '#fff',
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
              transform: holding ? 'scale(0.97)' : 'scale(1)',
            }}
          >
            ACTIVATE SOS
          </button>
        </div>

        {/* Bottom links */}
        <div style={{ padding: '6px 10px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { icon: <Lock size={15} />, label: 'Security' },
            { icon: <LogOut size={15} />, label: 'Logout' },
          ].map((item) => (
            <button key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '9px 12px',
              borderRadius: '0.625rem',
              border: 'none', cursor: 'pointer',
              backgroundColor: 'transparent',
              color: C.onSurfaceVariant,
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px', fontWeight: '400',
            }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Bar */}
        <div style={{
          height: '52px',
          backgroundColor: C.surface,
          borderBottom: `1px solid ${C.outlineVariant}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px',
              borderRadius: '9999px',
              border: `1px solid ${C.outlineVariant}`,
              fontSize: '12px', fontWeight: '400', color: C.onSurface,
            }}>
              <MapPin size={12} color={C.onSurfaceVariant} />
              San Francisco, CA
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px',
              borderRadius: '9999px',
              backgroundColor: C.surfaceContainer,
              fontSize: '12px', fontWeight: '500', color: C.primary,
              letterSpacing: '0.04em',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '9999px',
                backgroundColor: C.secondary,
                animation: 'pulseDot 2s infinite',
              }} />
              LIVE MONITORING
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Bell size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <Wifi size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '3px 3px 3px 10px',
              borderRadius: '9999px',
              border: `1px solid ${C.outlineVariant}`,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '500', color: C.onSurface, lineHeight: 1.2 }}>Elena Rodriguez</p>
              </div>
              <div style={{
                width: '32px', height: '32px', borderRadius: '9999px',
                backgroundColor: C.primaryContainer,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={15} color="#fff" />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 36px' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '30px', fontWeight: '300',
              color: C.onSurface, margin: '0 0 6px',
              letterSpacing: '-0.02em',
            }}>You are safe.</h1>
            <p style={{
              fontSize: '14px', fontWeight: '300',
              color: C.onSurfaceVariant, margin: 0,
            }}>
              Active monitoring is protecting you in San Francisco.
            </p>
          </div>

          {/* SOS Button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{
              position: 'relative',
              width: '300px', height: '300px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Outer glow */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: '9999px',
                backgroundColor: 'rgba(186,26,26,0.07)',
                animation: 'pulseRing 2.5s ease-in-out infinite',
              }} />
              {/* Middle ring */}
              <div style={{
                position: 'absolute', inset: '20px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(186,26,26,0.10)',
              }} />

              {/* Progress SVG */}
              <svg style={{
                position: 'absolute', inset: '28px',
                width: 'calc(100% - 56px)', height: 'calc(100% - 56px)',
              }} viewBox="0 0 244 244">
                {holding && (
                  <circle
                    cx="122" cy="122" r="114"
                    fill="none"
                    stroke={C.error}
                    strokeWidth="3"
                    strokeDasharray={`${(holdProgress / 100) * (2 * Math.PI * 114)} ${2 * Math.PI * 114}`}
                    strokeLinecap="round"
                    transform="rotate(-90 122 122)"
                  />
                )}
              </svg>

              {/* Button */}
              <button
                onMouseDown={() => !sosLoading && setHolding(true)}
                onMouseUp={() => setHolding(false)}
                onMouseLeave={() => setHolding(false)}
                onTouchStart={() => !sosLoading && setHolding(true)}
                onTouchEnd={() => setHolding(false)}
                disabled={sosLoading}
                style={{
                  position: 'absolute', inset: '36px',
                  borderRadius: '9999px',
                  backgroundColor: C.error,
                  border: 'none',
                  cursor: sosLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: '5px',
                  transform: holding ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.1s ease',
                  boxShadow: '0 10px 40px rgba(186,26,26,0.35)',
                }}
              >
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  color: '#fff', fontSize: '46px',
                  fontWeight: '600', letterSpacing: '-0.02em', lineHeight: 1,
                }}>
                  {sosLoading ? '···' : 'SOS'}
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '10px', fontWeight: '500', letterSpacing: '0.1em',
                }}>
                  {sosLoading ? 'SENDING' : 'HOLD TO TRIGGER'}
                </span>
              </button>
            </div>
          </div>

          {sosError && (
            <p style={{ color: C.error, textAlign: 'center', fontSize: '13px', marginTop: '-20px', marginBottom: '20px', fontWeight: '400' }}>
              {sosError}
            </p>
          )}

          {/* Trigger Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '14px',
          }}>
            {triggers.map((t) => (
              <div key={t.label} style={{
                backgroundColor: C.surface,
                borderRadius: '1.25rem',
                padding: '18px',
                border: `1px solid ${C.outlineVariant}`,
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '14px',
                }}>
                  <div style={{
                    width: '44px', height: '44px',
                    borderRadius: '0.875rem',
                    backgroundColor: C.secondaryContainer,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {t.icon}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '9999px',
                      backgroundColor: C.secondary,
                      animation: 'pulseDot 2s infinite',
                    }} />
                    <span style={{
                      fontSize: '10px', fontWeight: '500',
                      color: C.secondary, letterSpacing: '0.06em',
                    }}>
                      {t.status}
                    </span>
                  </div>
                </div>
                <p style={{
                  margin: '0 0 5px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px', fontWeight: '400', color: C.onSurface,
                }}>
                  {t.label}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '12px', fontWeight: '300', color: C.onSurfaceVariant,
                  lineHeight: '17px',
                }}>
                  {t.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}>
            {/* SafeRoute */}
            <div style={{
              backgroundColor: C.surface,
              borderRadius: '1.25rem',
              border: `1px solid ${C.outlineVariant}`,
              padding: '18px',
              display: 'flex', alignItems: 'center', gap: '14px',
              cursor: 'pointer',
            }}>
              <div style={{
                width: '64px', height: '64px',
                borderRadius: '0.875rem',
                backgroundColor: C.surfaceContainer,
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Map size={28} color={C.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
                  <p style={{ margin: 0, fontWeight: '400', fontSize: '14px', color: C.onSurface }}>
                    SafeRoute Tracking
                  </p>
                  <span style={{
                    fontSize: '9px', fontWeight: '500',
                    backgroundColor: C.surfaceContainer,
                    color: C.primary,
                    padding: '2px 7px', borderRadius: '9999px',
                    letterSpacing: '0.05em',
                  }}>PREMIUM</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '300', color: C.onSurfaceVariant, lineHeight: '17px' }}>
                  Optimal paths based on real-time lighting and traffic data.
                </p>
              </div>
              <ChevronRight size={16} color={C.onSurfaceVariant} />
            </div>

            {/* Guardian Network */}
            <div style={{
              backgroundColor: C.primaryContainer,
              borderRadius: '1.25rem',
              border: 'none',
              padding: '18px',
              display: 'flex', alignItems: 'center', gap: '14px',
              cursor: 'pointer',
            }}>
              <div style={{
                width: '64px', height: '64px',
                borderRadius: '0.875rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Users size={28} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 4px', fontWeight: '400', fontSize: '14px', color: '#fff' }}>
                  Guardian Network
                </p>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '300', color: 'rgba(255,255,255,0.7)', lineHeight: '17px' }}>
                  4 trusted contacts receiving your active status updates.
                </p>
              </div>
              <ChevronRight size={16} color="rgba(255,255,255,0.6)" />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center', marginTop: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
          }}>
            <Lock size={11} color={C.onSurfaceVariant} />
            <span style={{
              fontSize: '10px', color: C.onSurfaceVariant,
              letterSpacing: '0.06em', fontWeight: '300',
            }}>
              ENCRYPTED END-TO-END · SOC2 COMPLIANT · SAFEHER PREMIUM V4.5
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.7; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}