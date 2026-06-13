import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid, Map, Database, FileText, Settings,
  Search, Bell, Settings2, ChevronRight,
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

const logs = [
  { time: '14:22:08.242', event: 'SOS_TRIGGER', desc: 'Panic alarm: Central District, Node #824.', priority: 'CRIT', status: 'ACTIVE', statusActive: true },
  { time: '14:15:30.118', event: 'AI_DETECT',   desc: 'Irregular perimeter movement: Sector G4.',  priority: 'HIGH', status: 'TRCK',   statusActive: true },
  { time: '14:05:12.894', event: 'SYS_SYNC',    desc: 'Node #42 firmware sync successful.',         priority: 'LOW',  status: 'DONE',   statusActive: false },
  { time: '13:58:44.002', event: 'USR_AUTH',    desc: 'Admin_Sarah: Sector 7 Access granted.',      priority: 'LOW',  status: 'LOGD',   statusActive: false },
];

const stats = [
  { label: 'EVENTS (24H)',   value: '12,482' },
  { label: 'CRITICAL',       value: '03' },
  { label: 'NODES ACTIVE',   value: '158' },
  { label: 'SYSTEM UPTIME',  value: '99.98%' },
];

export default function ActivityLogs() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const priorityColor = (p) => {
    if (p === 'CRIT') return { bg: '#fef2f2', color: C.error, border: C.error };
    if (p === 'HIGH') return { bg: '#fffbeb', color: '#92400e', border: '#d97706' };
    return { bg: C.surfaceLow, color: C.onSurfaceVariant, border: C.outlineVariant };
  };

  const statusColor = (s) => {
    if (s === 'ACTIVE') return C.error;
    if (s === 'TRCK')   return C.onSurface;
    return C.onSurfaceVariant;
  };

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: C.surface, overflow: 'hidden' }}>

      {/* Sidebar */}
      <div style={{
        width: '240px', flexShrink: 0, backgroundColor: C.surface,
        borderRight: `1px solid ${C.outlineVariant}`,
        display: 'flex', flexDirection: 'column', padding: '24px 0', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ padding: '0 20px 32px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: C.onSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 7l8 5 8-5-8-5z" stroke="#fff" strokeWidth="2"/><path d="M4 12l8 5 8-5" stroke="#fff" strokeWidth="2"/></svg>
            </div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: C.onSurface, letterSpacing: '-0.01em' }}>SafeHer</p>
          </div>
          <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button key={item.label} onClick={() => navigate(item.path)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', border: 'none', cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: isActive ? C.onSurface : C.onSurfaceVariant,
                  fontFamily: "'Inter', sans-serif", fontSize: '14px',
                  fontWeight: isActive ? '600' : '400', textAlign: 'left',
                  borderLeft: isActive ? `3px solid ${C.onSurface}` : '3px solid transparent',
                  borderRadius: isActive ? '0 8px 8px 0' : '8px',
                }}>
                  {item.icon}{item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {['Support', 'Account'].map((label) => (
            <button key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '400' }}>
              {label === 'Support' ? (
                <div style={{ width: '18px', height: '18px', borderRadius: '9999px', border: `1.5px solid ${C.onSurfaceVariant}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700' }}>?</div>
              ) : (
                <div style={{ width: '18px', height: '18px', borderRadius: '9999px', backgroundColor: C.onSurfaceVariant, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2.5"/><circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2.5"/></svg>
                </div>
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{ height: '52px', backgroundColor: C.surface, borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: '0.06em' }}>SYSTEM TERMINAL</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: C.surfaceLow, borderRadius: '9999px', padding: '6px 14px', minWidth: '240px' }}>
              <Search size={13} color={C.outline} />
              <input placeholder="Filter parameters..." style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontFamily: "'Inter', sans-serif", fontSize: '13px', color: C.onSurface, width: '100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Bell size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <Settings2 size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <div style={{ width: '32px', height: '32px', borderRadius: '9999px', overflow: 'hidden', border: `1px solid ${C.outlineVariant}` }}>
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=faces" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px', display: 'flex', flexDirection: 'column' }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: C.onSurface, letterSpacing: '-0.02em' }}>Activity Logs</h1>
              <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: '400', color: C.onSurfaceVariant }}>Real-time surveillance telemetry. Sector 7-G actively monitoring.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ padding: '9px 18px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface, color: C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '500', cursor: 'pointer', letterSpacing: '0.02em' }}>FILTER</button>
              <button style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: C.onSurface, color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.04em' }}>EXPORT</button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: `1px solid ${C.outlineVariant}`, borderRadius: '8px', marginBottom: '24px', overflow: 'hidden' }}>
            {stats.map((s, i) => (
              <div key={s.label} style={{ padding: '20px 24px', borderRight: i < 3 ? `1px solid ${C.outlineVariant}` : 'none' }}>
                <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: '0.07em' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: C.onSurface, letterSpacing: '-0.02em' }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div style={{ border: `1px solid ${C.outlineVariant}`, borderRadius: '8px', overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 130px 1fr 100px 120px 32px', padding: '12px 20px', backgroundColor: C.surfaceLow, borderBottom: `1px solid ${C.outlineVariant}` }}>
              {['Timestamp', 'Event', 'Description', 'Priority', 'Status', ''].map((h) => (
                <p key={h} style={{ margin: 0, fontSize: '13px', fontWeight: '500', color: C.onSurface }}>{h}</p>
              ))}
            </div>
            {logs.map((log, i) => {
              const pc = priorityColor(log.priority);
              const sc = statusColor(log.status);
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 130px 1fr 100px 120px 32px', padding: '18px 20px', borderBottom: i < logs.length - 1 ? `1px solid ${C.outlineVariant}` : 'none', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '400', color: C.onSurfaceVariant, fontVariantNumeric: 'tabular-nums' }}>{log.time}</p>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: C.onSurface, letterSpacing: '0.02em' }}>{log.event}</p>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '400', color: C.onSurfaceVariant }}>{log.desc}</p>
                  <div>
                    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '4px', border: `1px solid ${pc.border}`, backgroundColor: pc.bg, fontSize: '11px', fontWeight: '700', color: pc.color, letterSpacing: '0.04em' }}>{log.priority}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '9999px', backgroundColor: log.statusActive ? sc : C.outlineVariant }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: sc, letterSpacing: '0.04em' }}>{log.status}</span>
                  </div>
                  <ChevronRight size={15} color={C.outlineVariant} style={{ cursor: 'pointer' }} />
                </div>
              );
            })}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
              <span style={{ fontSize: '12px', fontWeight: '400', color: C.onSurfaceVariant }}>Page 01 // 499</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '400', color: C.onSurfaceVariant, cursor: 'pointer' }}>Previous</span>
                <span style={{ fontSize: '12px', fontWeight: '400', color: C.onSurfaceVariant }}>/</span>
                <span style={{ fontSize: '12px', fontWeight: '500', color: C.onSurface, cursor: 'pointer' }}>Next</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{ height: '36px', backgroundColor: C.onSurface, display: 'flex', alignItems: 'center', padding: '0 20px', gap: '16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: C.secondary }} />
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#fff', letterSpacing: '0.05em' }}>GUARDIAN_OS: ONLINE</span>
          </div>
          <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <span style={{ fontSize: '11px', fontWeight: '400', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
            NODE_STATUS: ALL SECTORS NOMINAL // LATENCY: 4MS // MEMORY: 14% // ACTIVE_THREADS: 1,422
          </span>
        </div>
      </div>
    </div>
  );
}