// src/pages/Admin.jsx

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  LayoutGrid, Map, Database, FileText, Settings,
  Search, Bell, ChevronUp, Upload, Shield, Plus, Minus,
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
  outlineVariant: '#e0e0e8',
};

const THREAT_COLORS = {
  physical_assault: '#E24B4A',
  stalking: '#EF9F27',
  domestic_situation: '#D4537E',
  medical_emergency: '#378ADD',
  unknown: '#9aa0a6',
  pending: '#9aa0a6',
};

const navGroups = [
  {
    label: 'NAVIGATION',
    items: [
      { label: 'Overview', icon: <LayoutGrid size={16} /> },
      { label: 'Incident Map', icon: <Map size={16} /> },
      { label: 'Advanced Intel', icon: <Database size={16} /> },
      { label: 'Activity Logs', icon: <FileText size={16} /> },
    ],
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'System Config', icon: <Settings size={16} /> },
    ],
  },
];

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;
    let layer;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js';
    script.onload = () => {
      const heatPoints = points.map((p) => [p.lat, p.lng, p.weight ?? 1]);
      layer = L.heatLayer(heatPoints, {
        radius: 35,
        blur: 25,
        maxZoom: 10,
        gradient: { 0.3: '#378ADD', 0.6: '#EF9F27', 1.0: '#E24B4A' },
      }).addTo(map);
    };
    document.head.appendChild(script);
    return () => { if (layer) map.removeLayer(layer); };
  }, [points, map]);

  return null;
}

function ZoomControls() {
  const map = useMap();
  return (
    <div style={{
      position: 'absolute', bottom: '90px', left: '16px', zIndex: 999,
      display: 'flex', flexDirection: 'column',
      backgroundColor: '#1a1a1a', borderRadius: '0.75rem',
      border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden',
    }}>
      <button onClick={() => map.zoomIn()} style={zoomBtnStyle}><Plus size={16} color="#fff" /></button>
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
      <button onClick={() => map.zoomOut()} style={zoomBtnStyle}><Minus size={16} color="#fff" /></button>
    </div>
  );
}

const zoomBtnStyle = {
  width: '44px', height: '44px', border: 'none',
  backgroundColor: 'transparent', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function Toggle({ on, onChange }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: '38px', height: '21px', borderRadius: '9999px',
        backgroundColor: on ? C.onSurface : '#d0d0d8',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
        transition: 'background-color 0.2s',
      }}>
      <div style={{
        position: 'absolute', top: '2.5px',
        left: on ? '19px' : '2.5px',
        width: '16px', height: '16px', borderRadius: '9999px',
        backgroundColor: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

export default function Admin() {
  const [activeNav, setActiveNav] = useState('Incident Map');
  const [data, setData] = useState({ points: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [categoryToggles, setCategoryToggles] = useState({
    physical_disturbance: true,
    harassment_protocols: true,
    emergency_support: false,
  });
  const [viewModes, setViewModes] = useState({
    nodeClustering: true,
    densityHeatmap: true,
  });
  const [activeWindow, setActiveWindow] = useState('Last 24 Hours');
  const [severityPos, setSeverityPos] = useState(55);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({
      window: activeWindow,
      severity: severityPos,
      physical_disturbance: categoryToggles.physical_disturbance,
      harassment_protocols: categoryToggles.harassment_protocols,
      emergency_support: categoryToggles.emergency_support,
    });
    fetch(`${API}/api/admin/heatmap?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [activeWindow, severityPos, categoryToggles]);

  function handleExport() {
    window.open(`${API}/api/admin/export?window=${encodeURIComponent(activeWindow)}`, '_blank');
  }

  const stats = data.stats || {};
  const byThreat = stats.by_threat || {};
  const points = data.points || [];

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      fontFamily: "'Inter', system-ui, sans-serif",
      backgroundColor: C.surface,
      overflow: 'hidden',
    }}>

      {/* Sidebar */}
      <div style={{
        width: '220px', flexShrink: 0,
        backgroundColor: C.surface,
        borderRight: `1px solid ${C.outlineVariant}`,
        display: 'flex', flexDirection: 'column',
        padding: '20px 0', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ padding: '0 18px 28px', display: 'flex', alignItems: 'center', gap: '9px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              backgroundColor: C.onSurface,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={15} color="#fff" />
            </div>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: C.onSurface, letterSpacing: '-0.02em' }}>
              SafeHer OS
            </p>
          </div>

          {navGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: '18px' }}>
              <p style={{
                margin: '0 0 5px', padding: '0 18px',
                fontSize: '10px', fontWeight: '500',
                color: C.onSurfaceVariant, letterSpacing: '0.08em',
              }}>{group.label}</p>
              <div style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {group.items.map((item) => {
                  const isActive = item.path === currentPath;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveNav(item.label)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '9px',
                        padding: '9px 12px', borderRadius: '0.625rem',
                        border: 'none', cursor: 'pointer',
                        backgroundColor: isActive ? C.surfaceContainer : 'transparent',
                        color: isActive ? C.onSurface : C.onSurfaceVariant,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '13px', fontWeight: isActive ? '500' : '400',
                        textAlign: 'left',
                      }}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          margin: '0 10px',
          padding: '10px 12px',
          borderRadius: '0.75rem',
          border: `1px solid ${C.outlineVariant}`,
          display: 'flex', alignItems: 'center', gap: '10px',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '9999px',
            backgroundColor: C.onSurface,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '10px', fontWeight: '500', color: '#fff' }}>AU</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: '500', color: C.onSurface }}>Admin User</p>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: '300', color: C.onSurfaceVariant }}>Enterprise Node 04</p>
          </div>
          <ChevronUp size={14} color={C.onSurfaceVariant} />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <h2 style={{
              margin: 0, fontSize: '14px', fontWeight: '500',
              color: C.onSurface, letterSpacing: '-0.01em',
            }}>Real-time Incident Monitoring</h2>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '4px 10px', borderRadius: '9999px',
              border: `1px solid ${C.outlineVariant}`,
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '9999px',
                backgroundColor: loading ? '#EF9F27' : C.secondary,
                animation: 'pulseDot 2s infinite',
              }} />
              <span style={{ fontSize: '10px', fontWeight: '500', color: C.onSurface, letterSpacing: '0.05em' }}>
                {loading ? 'SYNCING...' : 'OPERATIONAL SYNC'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <Search size={15} color={C.onSurfaceVariant} />
              <span style={{ fontSize: '12px', fontWeight: '300', color: C.onSurfaceVariant }}>Search assets...</span>
            </div>
            <Bell size={16} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Content: map + right panel */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Map area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', backgroundColor: '#0a0a0a' }}>

            {/* Stat cards overlay */}
            <div style={{
              position: 'absolute', top: '16px', left: '16px', zIndex: 999,
              display: 'flex', gap: '10px',
            }}>
              {[
                { label: 'ACTIVATIONS (24H)', value: stats.activations_24h ?? stats.total ?? 0, delta: stats.activations_delta },
                { label: 'RESPONSE LATENCY', value: stats.response_latency ?? '—', delta: stats.latency_delta },
              ].map((s) => (
                <div key={s.label} style={{
                  backgroundColor: 'rgba(255,255,255,0.97)',
                  borderRadius: '0.75rem',
                  padding: '12px 18px',
                  minWidth: '160px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                }}>
                  <p style={{ margin: '0 0 5px', fontSize: '9px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.07em' }}>
                    {s.label}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <p style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: C.onSurface, letterSpacing: '-0.02em', lineHeight: 1 }}>
                      {s.value}
                    </p>
                    {s.delta != null && (
                      <span style={{
                        fontSize: '12px', fontWeight: '500',
                        color: String(s.delta).startsWith('-') ? C.secondary : C.error,
                      }}>
                        {String(s.delta).startsWith('-') || String(s.delta).startsWith('+') ? s.delta : `+${s.delta}`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Threat type pills */}
            {Object.keys(byThreat).length > 0 && (
              <div style={{
                position: 'absolute', top: '92px', left: '16px', zIndex: 999,
                display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '500px',
              }}>
                {Object.entries(byThreat).map(([type, count]) => (
                  <span key={type} style={{
                    fontSize: '11px', fontWeight: '500',
                    padding: '4px 10px', borderRadius: '9999px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    color: THREAT_COLORS[type] || '#888',
                    border: `0.5px solid ${THREAT_COLORS[type] || '#888'}`,
                  }}>
                    {type.replace('_', ' ')}: {count}
                  </span>
                ))}
              </div>
            )}

            {/* Map */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <MapContainer
                center={[37.7749, -122.4194]}
                zoom={12}
                zoomControl={false}
                style={{ height: '100%', width: '100%', backgroundColor: '#0a0a0a' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; OpenStreetMap &copy; CARTO'
                />
                {viewModes.densityHeatmap && <HeatmapLayer points={points} />}
                {viewModes.nodeClustering && points.map((p, i) => (
                  <CircleMarker
                    key={i}
                    center={[p.lat, p.lng]}
                    radius={6}
                    pathOptions={{
                      color: '#fff',
                      weight: 2,
                      fillColor: THREAT_COLORS[p.threat_type] || THREAT_COLORS.unknown,
                      fillOpacity: 0.9,
                    }}
                  />
                ))}
                <ZoomControls />
              </MapContainer>
            </div>

            {/* Legend */}
            <div style={{
              position: 'absolute', bottom: '52px', left: '16px', zIndex: 999,
              backgroundColor: 'rgba(255,255,255,0.97)',
              borderRadius: '0.875rem', padding: '14px 18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
            }}>
              <p style={{ margin: '0 0 10px', fontSize: '9px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.07em' }}>
                ANALYSIS LEGEND
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Critical Event', color: '#E24B4A' },
                  { label: 'Active Monitoring', color: '#1a1a1a' },
                  { label: 'Nominal Activity', color: '#9aa0a6' },
                ].map((l) => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '9px', height: '9px', borderRadius: '9999px', backgroundColor: l.color }} />
                    <span style={{ fontSize: '12px', fontWeight: '500', color: C.onSurface }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status bar */}
            <div style={{
              height: '36px', backgroundColor: C.surface,
              borderTop: `1px solid ${C.outlineVariant}`,
              display: 'flex', alignItems: 'center',
              padding: '0 16px', gap: '20px', flexShrink: 0,
            }}>
              {[
                { dot: C.secondary, text: 'SYSTEM: NOMINAL' },
                { text: `REFRESH: ${stats.refresh_ms ?? 120}MS` },
                { text: 'SAN FRANCISCO: 37.7749° N, 122.4194° W' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {s.dot && <div style={{ width: '5px', height: '5px', borderRadius: '9999px', backgroundColor: s.dot }} />}
                  <span style={{ fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.05em' }}>{s.text}</span>
                </div>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={10} color={C.onSurfaceVariant} />
                <span style={{ fontSize: '10px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.04em' }}>SECURE ENTERPRISE NODE</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{
            width: '272px', flexShrink: 0,
            backgroundColor: C.surface,
            borderLeft: `1px solid ${C.outlineVariant}`,
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '14px 18px',
              borderBottom: `1px solid ${C.outlineVariant}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: C.onSurface }}>Map Filters</span>
              <button
                onClick={() => {
                  setCategoryToggles({ physical_disturbance: true, harassment_protocols: true, emergency_support: false });
                  setViewModes({ nodeClustering: true, densityHeatmap: true });
                  setActiveWindow('Last 24 Hours');
                  setSeverityPos(55);
                }}
                style={{
                  border: 'none', backgroundColor: 'transparent',
                  fontSize: '12px', fontWeight: '400', color: C.onSurfaceVariant,
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}>Reset</button>
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

              {/* Incident categories */}
              <div>
                <p style={{ margin: '0 0 11px', fontSize: '10px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.07em' }}>
                  INCIDENT CATEGORY
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {[
                    { key: 'physical_disturbance', label: 'Physical Disturbance' },
                    { key: 'harassment_protocols', label: 'Harassment Protocols' },
                    { key: 'emergency_support', label: 'Emergency Support' },
                  ].map(({ key, label }) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '400', color: C.onSurface }}>{label}</span>
                      <Toggle on={categoryToggles[key]} onChange={() => setCategoryToggles(prev => ({ ...prev, [key]: !prev[key] }))} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Severity threshold */}
              <div>
                <p style={{ margin: '0 0 11px', fontSize: '10px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.07em' }}>
                  SEVERITY THRESHOLD
                </p>
                <input
                  type="range" min="0" max="100" value={severityPos}
                  onChange={(e) => setSeverityPos(Number(e.target.value))}
                  style={{ width: '100%', accentColor: C.onSurface, cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  {['LOW PRIORITY', 'ELEVATED', 'CRITICAL'].map((l) => (
                    <span key={l} style={{ fontSize: '9px', fontWeight: '400', color: C.onSurfaceVariant, letterSpacing: '0.03em' }}>{l}</span>
                  ))}
                </div>
              </div>

              {/* Temporal window */}
              <div>
                <p style={{ margin: '0 0 11px', fontSize: '10px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.07em' }}>
                  TEMPORAL WINDOW
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
                  {['Last 24 Hours', 'Last 7 Days', 'Current Month', 'Historical...'].map((w) => (
                    <button
                      key={w}
                      onClick={() => setActiveWindow(w)}
                      style={{
                        padding: '8px 6px',
                        borderRadius: '0.625rem',
                        border: `1px solid ${activeWindow === w ? C.onSurface : C.outlineVariant}`,
                        backgroundColor: activeWindow === w ? C.onSurface : C.surface,
                        color: activeWindow === w ? '#fff' : C.onSurface,
                        fontSize: '11px', fontWeight: '400',
                        cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* View modes */}
              <div style={{
                backgroundColor: C.bg, borderRadius: '0.875rem', padding: '14px 15px',
              }}>
                <p style={{ margin: '0 0 11px', fontSize: '13px', fontWeight: '500', color: C.onSurface }}>View Modes</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px' }}>
                  {[
                    { key: 'nodeClustering', label: 'Node Clustering' },
                    { key: 'densityHeatmap', label: 'Density Heatmap' },
                  ].map(({ key, label }) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '400', color: C.onSurface }}>{label}</span>
                      <Toggle on={viewModes[key]} onChange={() => setViewModes(prev => ({ ...prev, [key]: !prev[key] }))} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Export */}
              <button onClick={handleExport} style={{
                width: '100%', padding: '12px',
                backgroundColor: C.onSurface, border: 'none',
                borderRadius: '0.75rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px', fontWeight: '500', color: '#fff',
              }}>
                <Upload size={14} color="#fff" />
                Export Dataset
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .leaflet-container { background: #0a0a0a !important; }
      `}</style>
    </div>
  );
}