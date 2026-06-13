import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid, Map, Database, FileText, Settings,
  Search, Bell, SlidersHorizontal, TrendingUp, TrendingDown,
  CheckCircle, Upload,
} from 'lucide-react';

const C = {
  bg: '#faf8ff',
  surface: '#ffffff',
  surfaceLow: '#f2f3ff',
  surfaceContainer: '#eaedff',
  surfaceHigh: '#e1e7ff',
  primary: '#380080',
  primaryContainer: '#4f2696',
  secondary: '#026a61',
  secondaryContainer: '#9defe3',
  onSecondaryContainer: '#0d6f66',
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

const chartPoints = [
  { x: 0, y: 65 }, { x: 1, y: 55 }, { x: 2, y: 60 }, { x: 3, y: 80 },
  { x: 4, y: 70 }, { x: 5, y: 130 }, { x: 6, y: 110 },
];
const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function MiniChart() {
  const w = 500, h = 180;
  const xs = chartPoints.map(p => (p.x / 6) * w);
  const ys = chartPoints.map(p => h - ((p.y - 50) / 90) * h);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '180px' }}>
      <path d={d} fill="none" stroke={C.onSurface} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

const guardianAvatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=faces',
];

export default function Overview() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const alerts = [
    { title: 'SOS Triggered',       sub: 'District 4 • Sector 12B',    time: '2M',  active: true },
    { title: 'Guardian Dispatched', sub: 'District 1 • Central Hub',   time: '14M', active: false },
    { title: 'Incident Resolved',   sub: 'District 7 • Transit Center', time: '45M', active: false },
  ];

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
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: C.onSurface, letterSpacing: '-0.02em' }}>SafeHer OS</p>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.08em', marginTop: '2px' }}>ADMIN CONSOLE</p>
          </div>
          <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              // Exact match for all routes; /admin only matches Overview
              const isActive = currentPath === item.path;
              return (
                <button key={item.label} onClick={() => navigate(item.path)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  backgroundColor: isActive ? C.onSurface : 'transparent',
                  color: isActive ? '#fff' : C.onSurfaceVariant,
                  fontFamily: "'Inter', sans-serif", fontSize: '14px',
                  fontWeight: isActive ? '600' : '400', textAlign: 'left',
                  transition: 'background-color 0.2s',
                }}>
                  {item.icon}{item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[{ label: 'Support' }, { label: 'Account' }].map((item) => (
            <button key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              backgroundColor: 'transparent', color: C.onSurfaceVariant,
              fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '400',
            }}>
              {item.label === 'Support' ? (
                <div style={{ width: '20px', height: '20px', borderRadius: '9999px', border: `1.5px solid ${C.onSurfaceVariant}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>?</div>
              ) : (
                <div style={{ width: '20px', height: '20px', borderRadius: '9999px', backgroundColor: C.onSurface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#fff" strokeWidth="2"/><circle cx="12" cy="7" r="4" stroke="#fff" strokeWidth="2"/></svg>
                </div>
              )}
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
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '360px' }}>
            <Search size={15} color={C.outline} />
            <input placeholder="Search system logs..." style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontFamily: "'Inter', sans-serif", fontSize: '13px', color: C.onSurface, width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Bell size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <SlidersHorizontal size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <div style={{ width: '1px', height: '20px', backgroundColor: C.outlineVariant }} />
            <span style={{ fontSize: '13px', fontWeight: '500', color: C.onSurface }}>City Admin</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 28px' }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: C.onSurface, letterSpacing: '-0.02em' }}>System Overview</h1>
              <p style={{ margin: '4px 0 0', fontSize: '13px', fontWeight: '400', color: C.onSurfaceVariant }}>Metropolitan SafeHer Network Performance</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{ padding: '9px 18px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface, color: C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                Last 24 Hours
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '8px', border: 'none', backgroundColor: C.onSurface, color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                <Upload size={14} color="#fff" />Export Data
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {[
              { label: 'TOTAL ACTIVATIONS', value: '1,284', delta: '+12% since yesterday', deltaUp: true },
              { label: 'ACTIVE GUARDIANS',  value: '842',   note: '98.2% Coverage' },
              { label: 'AVG. RESPONSE TIME', value: '3.4', unit: 'min', delta: '0.5s improvement', deltaUp: false },
            ].map((kpi) => (
              <div key={kpi.label} style={{ backgroundColor: C.surface, borderRadius: '12px', padding: '24px', border: `1px solid ${C.outlineVariant}` }}>
                <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: '0.07em' }}>{kpi.label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                  <p style={{ margin: 0, fontSize: '40px', fontWeight: '800', color: C.onSurface, lineHeight: 1, letterSpacing: '-0.02em' }}>{kpi.value}</p>
                  {kpi.unit && <span style={{ fontSize: '16px', fontWeight: '400', color: C.onSurfaceVariant }}>{kpi.unit}</span>}
                </div>
                {kpi.delta && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {kpi.deltaUp ? <TrendingUp size={13} color={C.secondary} /> : <TrendingDown size={13} color={C.error} />}
                    <span style={{ fontSize: '12px', fontWeight: '500', color: kpi.deltaUp ? C.secondary : C.error }}>{kpi.delta}</span>
                  </div>
                )}
                {kpi.note && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle size={13} color={C.onSurfaceVariant} />
                    <span style={{ fontSize: '12px', fontWeight: '400', color: C.onSurfaceVariant }}>{kpi.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chart + Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: C.surface, borderRadius: '12px', padding: '24px', border: `1px solid ${C.outlineVariant}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: C.onSurface }}>Incident Volume</h3>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: '400', color: C.onSurfaceVariant }}>Weekly analytical trend</p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['TREND', 'LOG'].map((t, i) => (
                    <button key={t} style={{ padding: '6px 14px', borderRadius: '6px', border: `1px solid ${C.outlineVariant}`, backgroundColor: i === 0 ? C.surface : 'transparent', color: C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.04em' }}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ borderBottom: `1px solid ${C.outlineVariant}`, paddingBottom: '8px' }}>
                <MiniChart />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px' }}>
                {days.map(d => <span key={d} style={{ fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>{d}</span>)}
              </div>
            </div>

            <div style={{ backgroundColor: C.surface, borderRadius: '12px', padding: '24px', border: `1px solid ${C.outlineVariant}` }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '700', color: C.onSurface }}>Recent Alerts</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {alerts.map((alert, i) => (
                  <div key={alert.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 0', borderBottom: i < alerts.length - 1 ? `1px solid ${C.outlineVariant}` : 'none' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: alert.active ? C.onSurface : C.outlineVariant, marginTop: '5px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '500', color: C.onSurface }}>{alert.title}</p>
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: '400', color: C.onSurfaceVariant }}>{alert.sub}</p>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '400', color: C.onSurfaceVariant, flexShrink: 0 }}>{alert.time}</span>
                  </div>
                ))}
              </div>
              <button style={{ marginTop: '20px', width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface, color: C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.07em' }}>
                AUDIT TRAIL
              </button>
            </div>
          </div>

          {/* Infrastructure Status */}
          <div style={{ backgroundColor: C.surface, borderRadius: '12px', padding: '24px', border: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ flexShrink: 0 }}>
              <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: '0.07em' }}>UPTIME</p>
              <p style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: C.onSurface, letterSpacing: '-0.02em' }}>99.9%</p>
            </div>
            <div style={{ width: '1px', height: '40px', backgroundColor: C.outlineVariant }} />
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '14px', fontWeight: '600', color: C.onSurface }}>Infrastructure Status</p>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '400', color: C.onSurfaceVariant }}>24 relay centers operational</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              {guardianAvatars.map((src, i) => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '9999px', overflow: 'hidden', border: `2px solid ${C.surface}`, marginLeft: i === 0 ? 0 : '-8px' }}>
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: C.surfaceContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px', border: `2px solid ${C.surface}`, fontSize: '11px', fontWeight: '700', color: C.primary }}>+12</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}