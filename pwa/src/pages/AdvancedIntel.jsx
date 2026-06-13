import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid, Map, Database, FileText, Settings,
  Search, Bell, SlidersHorizontal, TrendingUp, Download,
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

const sectorRisks = [
  { zone: 'ALPHA-9 / CENTRAL',   name: 'COMMERCIAL DISTRICT', score: 84.0  },
  { zone: 'GAMMA-2 / TRANSIT',   name: 'PARKLAND HUB',        score: 32.14 },
  { zone: 'BETA-4 / INDUSTRIAL', name: 'NORTH ZONE',          score: 58.92 },
];

const anomalies = [
  { id: 'LOG_001', type: 'SOS_TRIGGER', location: 'Central District', time: '14:22:08', confidence: 0.97 },
  { id: 'LOG_002', type: 'AI_DETECT',   location: 'Sector G4',        time: '14:15:30', confidence: 0.84 },
  { id: 'LOG_003', type: 'PERIMETER',   location: 'North Zone',        time: '14:05:12', confidence: 0.76 },
];

function DarkMap() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0a0a0a', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 580 420" style={{ width: '100%', height: '100%', opacity: 0.85 }}>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return <line key={i} x1="290" y1="210" x2={290 + Math.cos(angle) * 280} y2={210 + Math.sin(angle) * 280} stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />;
        })}
        {[40, 80, 130, 185, 245, 280].map((r) => (
          <circle key={r} cx="290" cy="210" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        ))}
        {[
          'M10,105 Q130,90 290,210 Q450,330 570,315',
          'M10,315 Q130,330 290,210 Q450,90 570,105',
          'M145,10 Q200,110 290,210 Q380,310 435,410',
          'M435,10 Q380,110 290,210 Q200,310 145,410',
          'M10,210 L570,210', 'M290,10 L290,410',
          'M50,50 Q170,130 290,210 Q410,290 530,370',
          'M530,50 Q410,130 290,210 Q170,290 50,370',
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        ))}
        <radialGradient id="cityGlow" cx="50%" cy="50%" r="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.12)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <circle cx="290" cy="210" r="120" fill="url(#cityGlow)" />
        {[
          { x: 290, y: 210, r: 18, intensity: 0.9 }, { x: 320, y: 195, r: 10, intensity: 0.7 },
          { x: 270, y: 225, r: 8,  intensity: 0.6 }, { x: 305, y: 230, r: 6,  intensity: 0.5 },
          { x: 260, y: 200, r: 5,  intensity: 0.4 }, { x: 340, y: 215, r: 4,  intensity: 0.35 },
          { x: 175, y: 155, r: 5,  intensity: 0.3 }, { x: 400, y: 270, r: 4,  intensity: 0.25 },
        ].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={`rgba(255,255,255,${p.intensity})`} />
        ))}
        {[
          [180,120],[220,140],[250,170],[310,175],[340,160],[360,190],
          [230,240],[260,250],[300,245],[330,235],[210,195],[280,185],
          [150,200],[400,190],[350,240],[240,160],[290,155],[320,220],
        ].map(([x,y], i) => (
          <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(255,255,255,0.3)" />
        ))}
      </svg>
      <div style={{ position: 'absolute', bottom: '24px', left: '24px', backgroundColor: 'rgba(10,10,10,0.85)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '16px 20px', minWidth: '200px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em' }}>INTENSITY SCALE</span>
          <div style={{ display: 'flex', gap: '2px' }}>
            {[0.1,0.25,0.45,0.65,0.85,1].map((o, i) => (
              <div key={i} style={{ width: '12px', height: '4px', borderRadius: '2px', backgroundColor: `rgba(255,255,255,${o})` }} />
            ))}
          </div>
        </div>
        <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: '500', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>TOTAL ACTIVE SENSORS</p>
        <p style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>1,402,881</p>
      </div>
      <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
        <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em' }}>MAP_INTEL_V4</p>
      </div>
    </div>
  );
}

export default function AdvancedIntel() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [timeWindow, setTimeWindow] = useState('24H');

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
            <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: C.onSurface, letterSpacing: '0.04em' }}>SAFEHER OS</p>
            <p style={{ margin: '2px 0 0', fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.06em' }}>OPERATIONAL INTEL</p>
          </div>
          <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button key={item.label} onClick={() => navigate(item.path)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  backgroundColor: isActive ? C.onSurface : 'transparent',
                  color: isActive ? '#fff' : C.onSurfaceVariant,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px', fontWeight: isActive ? '700' : '400',
                  textAlign: 'left', letterSpacing: isActive ? '0.05em' : '0.04em',
                  textTransform: 'uppercase',
                }}>
                  {item.icon}{item.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ margin: '0 10px', padding: '12px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '9999px', overflow: 'hidden', flexShrink: 0 }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=faces" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: C.onSurface }}>OPERATOR 01</p>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>LVL 4 CLEARANCE</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <div style={{ height: '52px', backgroundColor: C.surface, borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <Search size={14} color={C.outline} />
            <input placeholder="IDENTIFY SECTOR / ANALYST..." style={{ border: 'none', outline: 'none', backgroundColor: 'transparent', fontFamily: "'Inter', sans-serif", fontSize: '12px', color: C.onSurfaceVariant, letterSpacing: '0.04em', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Bell size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <SlidersHorizontal size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '9999px', backgroundColor: C.secondary }} />
              <span style={{ fontSize: '12px', fontWeight: '500', color: C.onSurface, letterSpacing: '0.04em' }}>LOCAL SYSTEM SYNCED</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: C.onSurface, letterSpacing: '0.02em', textTransform: 'uppercase' }}>Predictive Analysis</h1>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                <div style={{ width: '3px', height: '14px', backgroundColor: C.onSurface, marginRight: '10px' }} />
                <p style={{ margin: 0, fontSize: '13px', fontWeight: '400', color: C.onSurfaceVariant }}>Sector density modeling and algorithmic threat assessment.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {['24H', '7D', '30D'].map((t) => (
                <button key={t} onClick={() => setTimeWindow(t)} style={{
                  padding: '8px 16px', borderRadius: '6px', border: `1px solid ${C.outlineVariant}`,
                  backgroundColor: timeWindow === t ? C.onSurface : C.surface,
                  color: timeWindow === t ? '#fff' : C.onSurface,
                  fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '700', cursor: 'pointer', letterSpacing: '0.04em',
                }}>{t}</button>
              ))}
              <button style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '6px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface, color: C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.04em' }}>
                <Download size={13} />EXPORT_LOG
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: '0.06em' }}>METROPOLITAN DENSITY HEATMAP</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '1px', height: '14px', backgroundColor: C.outlineVariant }} />
              <span style={{ fontSize: '11px', fontWeight: '400', color: C.onSurfaceVariant }}>GRID: 51.5074° N, 0.1278° W</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px', marginBottom: '24px' }}>
            <div style={{ borderRadius: '10px', overflow: 'hidden', height: '420px' }}>
              <DarkMap />
            </div>
            <div>
              <p style={{ margin: '0 0 20px', fontSize: '11px', fontWeight: '700', color: C.onSurfaceVariant, letterSpacing: '0.08em' }}>SECTOR_RISK_INDEX</p>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {sectorRisks.map((s, i) => (
                  <div key={s.name} style={{ paddingBottom: '24px', marginBottom: '24px', borderBottom: i < sectorRisks.length - 1 ? `1px solid ${C.outlineVariant}` : 'none' }}>
                    <p style={{ margin: '0 0 6px', fontSize: '10px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.06em' }}>{s.zone}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: C.onSurface, letterSpacing: '0.02em' }}>{s.name}</p>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: C.onSurface }}>{s.score}</p>
                    </div>
                    <div style={{ marginTop: '8px', height: '2px', backgroundColor: C.outlineVariant, borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.score}%`, backgroundColor: s.score > 70 ? C.error : s.score > 45 ? '#d97706' : C.secondary, borderRadius: '9999px' }} />
                    </div>
                  </div>
                ))}
                <button style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${C.outlineVariant}`, backgroundColor: C.surface, color: C.onSurface, fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: '600', cursor: 'pointer', letterSpacing: '0.06em' }}>
                  FULL_SECTOR_AUDIT.PDF
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ border: `1px solid ${C.outlineVariant}`, borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: C.onSurface, letterSpacing: '0.04em' }}>TREND_PULSE</p>
                <TrendingUp size={16} color={C.onSurfaceVariant} />
              </div>
              <div style={{ height: '60px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                {[20,35,28,45,38,55,42,60,52,72,58,80].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i === 11 ? C.onSurface : C.outlineVariant, borderRadius: '2px 2px 0 0' }} />
                ))}
              </div>
            </div>

            <div style={{ border: `1px solid ${C.outlineVariant}`, borderRadius: '10px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: '700', color: C.onSurface, letterSpacing: '0.04em' }}>ACTIVITY_STREAM_ANOMALY</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '10px', color: C.onSurfaceVariant }}>
                  <span>■ 03 HIGH_PRIORITY</span>
                  <span>○ 12 TOTAL_LOGS</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr auto', gap: '6px 12px' }}>
                {['LOG_ID', 'EVENT_TYPE', 'LOCATION', 'CONFIDENCE_SC'].map(h => (
                  <p key={h} style={{ margin: 0, fontSize: '9px', fontWeight: '600', color: C.onSurfaceVariant, letterSpacing: '0.06em' }}>{h}</p>
                ))}
                {anomalies.map((a) => (
                  <>
                    <p key={`id-${a.id}`}   style={{ margin: 0, fontSize: '11px', color: C.onSurfaceVariant }}>{a.id}</p>
                    <p key={`type-${a.id}`} style={{ margin: 0, fontSize: '11px', fontWeight: '600', color: C.onSurface }}>{a.type}</p>
                    <p key={`loc-${a.id}`}  style={{ margin: 0, fontSize: '11px', color: C.onSurfaceVariant }}>{a.location}</p>
                    <p key={`conf-${a.id}`} style={{ margin: 0, fontSize: '11px', fontWeight: '700', color: a.confidence > 0.9 ? C.error : C.onSurface }}>{(a.confidence * 100).toFixed(0)}%</p>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '32px', backgroundColor: C.surface, borderTop: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>
              <b style={{ fontWeight: '600', color: C.onSurface }}>SYSTEM_INTEGRITY</b> &nbsp; 13.06.2026 // 09:50:49.886 UTC
            </span>
            <span style={{ fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>
              <b style={{ fontWeight: '600', color: C.onSurface }}>ACTIVE_NODES</b> &nbsp; 1,024/1,024
            </span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>
            SYNC_LAST_REFRESH: 14.02.2024 // 14:32:01.002 UTC
          </span>
        </div>
      </div>
    </div>
  );
}