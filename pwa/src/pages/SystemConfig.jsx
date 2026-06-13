import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid, Map, Database, FileText, Settings,
  Search, Bell, SlidersHorizontal, ChevronRight,
} from 'lucide-react';

const C = {
  bg: '#faf8ff',
  surface: '#ffffff',
  surfaceLow: '#f2f3ff',
  surfaceContainer: '#eaedff',
  primary: '#380080',
  secondary: '#026a61',
  error: '#ba1a1a',
  onSurface: '#131b2e',
  onSurfaceVariant: '#4a4454',
  outlineVariant: '#ccc3d7',
  outline: '#7b7486',
};

const navItems = [
  { label: 'Overview',       icon: <LayoutGrid size={16} />, path: '/admin' },
  { label: 'Incident Map',   icon: <Map size={16} />,        path: '/admin/map' },
  { label: 'Advanced Intel', icon: <Database size={16} />,   path: '/admin/intel' },
  { label: 'Activity Logs',  icon: <FileText size={16} />,   path: '/admin/logs' },
  { label: 'System Config',  icon: <Settings size={16} />,   path: '/admin/config' },
];

function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{ width: '42px', height: '24px', borderRadius: '9999px', backgroundColor: on ? C.primary : '#d1d5db', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background-color 0.2s' }}>
      <div style={{ position: 'absolute', top: '3px', left: on ? '21px' : '3px', width: '18px', height: '18px', borderRadius: '9999px', backgroundColor: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </div>
  );
}

const users = [
  { initials: 'AT', name: 'Adrian Thorne',   role: 'CHIEF OPERATIONS OFFICER', access: 'ROOT ACCESS' },
  { initials: 'SM', name: 'Sarah Mitchell',  role: 'INCIDENT RESPONSE LEAD',   access: 'MANAGER' },
];

const integrations = [
  { label: 'GLOBAL TRANSIT GPS',  sub: 'LATENCY: 42MS / PULSE: STABLE',     enabled: true },
  { label: 'SURVEILLANCE HUB',    sub: 'UPTIME: 99.98% / PROTOCOL: TLS 1.3', enabled: true },
];

export default function SystemConfig() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [sensitivity, setSensitivity] = useState('MED');
  const [mfa, setMfa]                 = useState(true);
  const [ipRestrict, setIpRestrict]   = useState(false);
  const [autoWipe, setAutoWipe]       = useState(true);
  const [integrationStates, setIntegrationStates] = useState([true, true]);

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: C.bg, overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{
        width: '240px', flexShrink: 0, backgroundColor: C.surface,
        borderRight: `1px solid ${C.outlineVariant}`,
        display: 'flex', flexDirection: 'column', padding: '24px 0', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ padding: '0 20px 32px' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: C.onSurface, letterSpacing: '0.02em' }}>SAFEHER OS</p>
            <p style={{ margin: '2px 0 0', fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.06em' }}>CONTROL PANEL</p>
          </div>
          <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button key={item.label} onClick={() => navigate(item.path)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  backgroundColor: isActive ? C.surfaceContainer : 'transparent',
                  color: isActive ? C.onSurface : C.onSurfaceVariant,
                  fontFamily: "'Inter', sans-serif", fontSize: '14px',
                  fontWeight: isActive ? '600' : '400', textAlign: 'left',
                }}>
                  {item.icon}{item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ padding: '0 10px' }}>
          <div style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '9999px', backgroundColor: C.secondary }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: C.onSurface, letterSpacing: '0.04em' }}>SYSTEM LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{ height: '52px', backgroundColor: C.surface, borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '300px' }}>
            <Search size={14} color={C.outline} />
            <input placeholder="Search parameters..." style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontFamily: "'Inter', sans-serif", fontSize: '13px', color: C.onSurface, width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Bell size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <SlidersHorizontal size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: C.onSurface }}>A. ADMIN</p>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>SUPERUSER</p>
              </div>
              <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: C.onSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2"/><circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.05em' }}>CONTROL</span>
            <ChevronRight size={12} color={C.onSurfaceVariant} />
            <span style={{ fontSize: '12px', fontWeight: '500', color: C.onSurface, letterSpacing: '0.05em' }}>CONFIGURATION</span>
          </div>

          <h1 style={{ margin: '0 0 6px', fontSize: '28px', fontWeight: '700', color: C.onSurface, letterSpacing: '-0.02em' }}>System Parameters</h1>
          <p style={{ margin: '0 0 32px', fontSize: '13px', fontWeight: '400', color: C.onSurfaceVariant, maxWidth: '520px', lineHeight: 1.6 }}>
            Environment variables, security architecture, and nodal data integrations. All changes are logged and timestamped for audit compliance.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
            {/* Left */}
            <div>
              {/* User Access Control */}
              <div style={{ marginBottom: '36px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '700', color: C.onSurface, letterSpacing: '0.06em' }}>USER ACCESS CONTROL</p>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>AUTH LEVEL 4 REQUIRED</p>
                  </div>
                  <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface, color: C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.04em' }}>
                    CREATE ENTITY
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {users.map((u) => (
                    <div key={u.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: C.surfaceContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: C.onSurface, flexShrink: 0 }}>{u.initials}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: C.onSurface }}>{u.name}</p>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>{u.role}</p>
                      </div>
                      <button style={{ padding: '7px 14px', borderRadius: '6px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface, color: C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.04em' }}>
                        {u.access}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Node Integrations */}
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '700', color: C.onSurface, letterSpacing: '0.06em' }}>NODE INTEGRATIONS</p>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>ACTIVE EXTERNAL HANDSHAKES</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {integrations.map((intg, i) => (
                    <div key={intg.label} style={{ padding: '16px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: C.onSurface, letterSpacing: '0.05em' }}>{intg.label}</p>
                        <Toggle on={integrationStates[i]} onChange={() => setIntegrationStates(prev => prev.map((s, j) => j === i ? !s : s))} />
                      </div>
                      <p style={{ margin: 0, fontSize: '11px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.03em' }}>{intg.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <p style={{ margin: '0 0 20px', fontSize: '12px', fontWeight: '700', color: C.onSurface, letterSpacing: '0.07em' }}>SECURITY ARCHITECTURE</p>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.06em' }}>SENSITIVITY INDEX</p>
                  <div style={{ display: 'flex', border: `1px solid ${C.outlineVariant}`, borderRadius: '8px', overflow: 'hidden' }}>
                    {['LOW', 'MED', 'HIGH'].map((s) => (
                      <button key={s} onClick={() => setSensitivity(s)} style={{ flex: 1, padding: '10px', border: 'none', backgroundColor: sensitivity === s ? C.onSurface : C.surface, color: sensitivity === s ? '#fff' : C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.04em', borderRight: s !== 'HIGH' ? `1px solid ${C.outlineVariant}` : 'none' }}>{s}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {[
                    { label: 'Multi-Factor Auth',   state: mfa,       setter: setMfa },
                    { label: 'IP Restricted Login', state: ipRestrict, setter: setIpRestrict },
                    { label: 'Auto-Wipe Session',   state: autoWipe,   setter: setAutoWipe },
                  ].map(({ label, state, setter }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '14px', fontWeight: '400', color: C.onSurface }}>{label}</span>
                      <Toggle on={state} onChange={() => setter(!state)} />
                    </div>
                  ))}
                </div>
                <button style={{ width: '100%', padding: '13px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface, color: C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.07em' }}>
                  INITIATE GLOBAL LOCKDOWN
                </button>
              </div>

              <div>
                <p style={{ margin: '0 0 16px', fontSize: '12px', fontWeight: '700', color: C.onSurface, letterSpacing: '0.07em' }}>NODAL HEALTH</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'CPU LOAD',        value: '0.42',   pct: 42 },
                    { label: 'DATA THROUGHPUT', value: '1.1 GB/S', pct: 68 },
                  ].map((m) => (
                    <div key={m.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: C.onSurface, letterSpacing: '0.04em' }}>{m.label}</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: C.onSurface }}>{m.value}</span>
                      </div>
                      <div style={{ height: '3px', backgroundColor: C.outlineVariant, borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${m.pct}%`, backgroundColor: C.onSurface, borderRadius: '9999px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ height: '36px', backgroundColor: C.surface, borderTop: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: C.secondary }} />
            <span style={{ fontSize: '10px', fontWeight: '600', color: C.onSurface, letterSpacing: '0.05em' }}>CORE ONLINE</span>
            <span style={{ fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>V2.4.1.000_S</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>TIMESTAMP: 2024.11.23_14.00.02_UTC</span>
        </div>
      </div>
    </div>
  );
}