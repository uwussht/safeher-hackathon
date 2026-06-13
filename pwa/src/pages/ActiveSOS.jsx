import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  Shield, History, Map, HeadphonesIcon, User, LogOut,
  Bell, Wifi, Settings, MapPin, Users, Upload,
  ChevronDown, AlertTriangle, Send, Phone
} from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const C = {
  bg: '#f0f0f8',
  surface: '#ffffff',
  surfaceLow: '#f2f3ff',
  primary: '#380080',
  primaryContainer: '#6d28d9',
  secondary: '#016a61',
  secondaryContainer: '#86f2e4',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onSurface: '#131b2e',
  onSurfaceVariant: '#4a4454',
  outlineVariant: '#ccc3d7',
};

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);
  return null;
}

export default function ActiveSOS() {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const incidentId = state?.incidentId;

  const [activeNav, setActiveNav] = useState('Home/Safety');
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const setupDoneRef = useRef(false);
  const audioChunksRef = useRef([]);

  const RESPONDER_LABELS = {
    trusted_contacts: 'your trusted contacts',
    city_emergency: 'city emergency services (112/police)',
    crisis_center: 'a crisis support center',
  };

  const [userLat, setUserLat] = useState(state?.lat ?? null);
  const [userLng, setUserLng] = useState(state?.lng ?? null);
  const [address, setAddress] = useState('Locating...');
  const [locationReady, setLocationReady] = useState(false);

  const [threatType, setThreatType] = useState('Analyzing...');
  const [confidence, setConfidence] = useState(null);
  const [audioStatus, setAudioStatus] = useState('recording');

  const [actions] = useState([
    {
      id: 1,
      icon: <Users size={18} color={C.secondary} />,
      iconBg: C.secondaryContainer,
      title: 'Contacts Notified',
      sub: 'Trusted contacts alerted.',
      status: 'DELIVERED',
      statusColor: C.secondary,
    },
    {
      id: 2,
      icon: <Shield size={18} color={C.error} />,
      iconBg: C.errorContainer,
      title: 'Dispatch Status',
      sub: 'Emergency services notified.',
      status: 'EN ROUTE',
      statusColor: C.error,
    },
    {
      id: 3,
      icon: <Upload size={18} color={C.error} />,
      iconBg: C.errorContainer,
      title: 'Evidence Vault',
      sub: 'Live audio recording.',
      status: 'ACTIVE',
      statusColor: C.error,
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'system',
      text: 'SOS received. Recording audio for classification. Type silently if you need help.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // get real GPS + reverse geocode
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);
        setLocationReady(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address;
          const readable = [
            addr.road,
            addr.suburb || addr.neighbourhood,
            addr.city || addr.town || addr.village,
          ].filter(Boolean).join(', ');
          setAddress(readable || data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } catch {
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      },
      () => {
        setUserLat(43.2220);
        setUserLng(76.8512);
        setAddress('Location unavailable');
        setLocationReady(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // audio recording + classification
  useEffect(() => {
    if (!incidentId) {
      setTimeout(() => {
        setThreatType('Unknown');
        setConfidence(null);
        setAudioStatus('done');
      }, 2000);
      return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const options = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
          ? { mimeType: 'audio/ogg;codecs=opus' }
          : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? { mimeType: 'audio/webm;codecs=opus' }
          : {};

        const recorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = e => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          setAudioStatus('processing');

          const mimeType = audioChunksRef.current[0]?.type || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type: mimeType });

          if (blob.size < 500) {
            setThreatType('Audio too short');
            setConfidence(null);
            setAudioStatus('done');
            return;
          }

          try {
            const form = new FormData();
            const ext = mimeType.includes('ogg') ? 'ogg' : mimeType.includes('mp4') ? 'mp4' : 'webm';
            form.append('audio', blob, `clip.${ext}`);
            form.append('incident_id', String(incidentId));

            const res = await fetch('http://localhost:8000/api/sos/classify-audio', {
              method: 'POST',
              body: form,
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const result = await res.json();

            setThreatType(result.threat_type?.replace(/_/g, ' ') ?? 'Unknown');
            setConfidence(result.confidence ?? null);
            setAudioStatus('done');

            if (result.brief) {
              setMessages(prev => [...prev, {
                id: Date.now(),
                from: 'system',
                text: `AI brief: ${result.brief}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }]);
            }

            if (Array.isArray(result.responders) && result.responders.length > 0) {
              const labels = result.responders
                .map(r => RESPONDER_LABELS[r] || r)
                .join(', ');

              setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'system',
                text: `Sending alert to: ${labels}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              }]);
            }
          } catch (err) {
            console.error('classify-audio error:', err);
            setThreatType('Classification failed');
            setConfidence(null);
            setAudioStatus('done');
          }
        };

        recorder.start(100);
        setTimeout(() => {
          if (recorder.state === 'recording') recorder.stop();
        }, 8000);
      })
      .catch(() => {
        setThreatType('Microphone access denied');
        setConfidence(null);
        setAudioStatus('done');
      });
  }, [incidentId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMsg = {
      id: Date.now(), from: 'user', text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    const currentMessage = message;
    setMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          mode: 'emergency',
          incident_id: incidentId,
          history: messages.map(m => ({
            role: m.from === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: Date.now(), from: 'system', text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now(), from: 'system',
        text: 'Connection error. Stay calm and stay safe.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  };

  const navItems = [
  { label: 'Home/Safety', icon: <Shield size={17} />, path: '/' },
  { label: 'SafeHer AI', icon: <HeadphonesIcon size={17} />, path: '/resources' },
  { label: 'Resource Map', icon: <Map size={17} />, path: '/resources-map' },
  { label: 'Profile', icon: <User size={17} />, path: '/profile' },
];


  const vitals = [
    { icon: <MapPin size={16} color={C.secondary} />, label: 'ADDRESS', value: address },
    { icon: <span style={{ fontSize: '16px', color: C.error }}>♥</span>, label: 'STATUS', value: 'Active SOS' },
    { icon: <span style={{ fontSize: '15px' }}>📍</span>, label: 'COORDS', value: userLat ? `${userLat.toFixed(4)}, ${userLng.toFixed(4)}` : 'Locating...' },
  ];

  const displayThreat = audioStatus === 'recording'
    ? 'Recording audio...'
    : audioStatus === 'processing'
    ? 'Classifying threat...'
    : threatType;

  const displayConfidence = confidence !== null
    ? `${Math.round(confidence * 100)}%`
    : audioStatus === 'done' ? '—' : '···';

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
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
            <Shield size={22} color={C.error} fill={C.error} />
            <div>
              <p style={{ margin: 0, fontWeight: '500', fontSize: '17px', color: C.onSurface, lineHeight: 1.2, letterSpacing: '-0.02em' }}>SafeHer</p>
              <p style={{ margin: 0, fontSize: '10px', color: C.onSurfaceVariant, fontWeight: '400', letterSpacing: '0.05em' }}>COMMAND CENTER</p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => { setActiveNav(item.label); navigate(item.path); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '9px',
                  padding: '9px 12px', borderRadius: '0.625rem',
                  border: 'none', cursor: 'pointer',
                  backgroundColor: isActive ? C.error : 'transparent',
                  color: isActive ? '#fff' : C.onSurfaceVariant,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13px', fontWeight: isActive ? '500' : '400',
                  textAlign: 'left', transition: 'background-color 0.15s ease',
                }}
              >
                {item.icon}{item.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '14px 10px 8px' }}>
          <button style={{
            width: '100%', padding: '12px',
            backgroundColor: C.error, border: 'none', borderRadius: '0.625rem',
            color: '#fff', fontFamily: "'Inter', sans-serif",
            fontSize: '13px', fontWeight: '600', letterSpacing: '0.06em', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '9999px', backgroundColor: '#fff', animation: 'pulseDot 1s infinite' }} />
            SOS ACTIVE
          </button>
        </div>

        <div style={{ padding: '6px 10px 0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[{ icon: <Settings size={15} />, label: 'Security Settings' }, { icon: <LogOut size={15} />, label: 'Logout' }].map((item) => (
            <button key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              padding: '9px 12px', borderRadius: '0.625rem',
              border: 'none', cursor: 'pointer', backgroundColor: 'transparent',
              color: C.onSurfaceVariant, fontFamily: "'Inter', sans-serif",
              fontSize: '13px', fontWeight: '400',
            }}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Bar */}
        <div style={{
          height: '52px', backgroundColor: C.surface,
          borderBottom: `1px solid ${C.outlineVariant}`,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 24px', flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '9999px',
            border: `1px solid ${C.outlineVariant}`,
            fontSize: '12px', fontWeight: '500', color: C.secondary,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: C.secondary, animation: 'pulseDot 1.2s infinite' }} />
            Live Monitoring Active
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Bell size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <Wifi size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <Settings size={18} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            <div style={{ width: '32px', height: '32px', borderRadius: '9999px', backgroundColor: C.primaryContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <User size={15} color="#fff" />
            </div>
          </div>
        </div>

        {/* Threat Banner */}
        <div style={{
          backgroundColor: C.error, padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={18} color="#fff" />
            <div>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: '500', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em' }}>LIVE THREAT ANALYSIS</p>
              <p style={{ margin: 0, fontSize: '15px', fontWeight: '400', color: '#fff', letterSpacing: '-0.01em' }}>Classification: {displayThreat}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '26px', fontWeight: '300', color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>{displayConfidence}</p>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: '500', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em' }}>CONFIDENCE</p>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr 300px', overflow: 'hidden' }}>

          {/* Left */}
          <div style={{ backgroundColor: C.surface, borderRight: `1px solid ${C.outlineVariant}`, padding: '18px', overflowY: 'auto' }}>
            <p style={{ margin: '0 0 14px', fontSize: '11px', fontWeight: '500', color: C.onSurface, letterSpacing: '0.04em' }}>AUTOMATED RESPONSE ACTIONS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {actions.map((action) => (
                <div key={action.id} style={{ backgroundColor: C.bg, borderRadius: '0.875rem', padding: '14px', border: `1px solid ${C.outlineVariant}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '0.625rem', backgroundColor: action.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {action.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontWeight: '400', fontSize: '13px', color: C.onSurface }}>{action.title}</p>
                      <p style={{ margin: '0 0 7px', fontSize: '12px', fontWeight: '300', color: C.onSurfaceVariant }}>{action.sub}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: action.statusColor, animation: 'pulseDot 1.5s infinite' }} />
                        <span style={{ fontSize: '10px', fontWeight: '500', color: action.statusColor, letterSpacing: '0.06em' }}>{action.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button style={{
              marginTop: '14px', width: '100%', padding: '11px',
              backgroundColor: 'transparent', border: `1px solid ${C.outlineVariant}`,
              borderRadius: '0.625rem', display: 'flex', alignItems: 'center', gap: '7px',
              cursor: 'pointer', color: C.onSurfaceVariant,
              fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: '400', justifyContent: 'center',
            }}>
              <Phone size={14} />Professional Help
            </button>
          </div>

          {/* Center — Map */}
          <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {locationReady && userLat && userLng ? (
                <MapContainer center={[userLat, userLng]} zoom={15} style={{ width: '100%', height: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                  <RecenterMap lat={userLat} lng={userLng} />
                  <Marker position={[userLat, userLng]}>
                    <Popup><strong>You are here</strong><br />{address}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111118', color: C.onSurfaceVariant, fontSize: 13 }}>
                  Getting your location...
                </div>
              )}
            </div>
            <div style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.outlineVariant}`, padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexShrink: 0 }}>
              {vitals.map((v) => (
                <div key={v.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {v.icon}
                  <div>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: '500', color: C.onSurfaceVariant, letterSpacing: '0.06em' }}>{v.label}</p>
                    <p style={{ margin: 0, fontSize: '12px', fontWeight: '300', color: C.onSurface, lineHeight: 1.3, maxWidth: 160 }}>{v.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Chat */}
          <div style={{ backgroundColor: C.surface, borderLeft: `1px solid ${C.outlineVariant}`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '9999px', backgroundColor: C.error, animation: 'pulseDot 1s infinite' }} />
                <span style={{ fontSize: '12px', fontWeight: '500', color: C.onSurface, letterSpacing: '0.03em' }}>SILENT DISPATCH ACTIVE</span>
              </div>
              <ChevronDown size={16} color={C.onSurfaceVariant} style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '10px 13px',
                    borderRadius: msg.from === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                    backgroundColor: msg.from === 'user' ? C.error : C.surfaceLow,
                    color: msg.from === 'user' ? '#fff' : C.onSurface,
                    fontSize: '13px', fontWeight: '400', lineHeight: '19px',
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: '10px', color: C.onSurfaceVariant, marginTop: '3px', fontWeight: '300' }}>{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div style={{ padding: '7px 14px', display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: `1px solid ${C.outlineVariant}` }}>
              {['Hiding', 'Safe now', 'Need help'].map((reply) => (
                <button key={reply} onClick={() => setMessage(reply)} style={{
                  padding: '5px 11px', borderRadius: '9999px',
                  border: `1px solid ${C.outlineVariant}`, backgroundColor: C.bg,
                  color: C.onSurfaceVariant, fontSize: '11px', fontWeight: '400',
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                }}>
                  {reply}
                </button>
              ))}
            </div>

            <div style={{ padding: '10px 14px', borderTop: `1px solid ${C.outlineVariant}`, display: 'flex', gap: '7px', alignItems: 'center' }}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type silently..."
                style={{
                  flex: 1, padding: '9px 13px', borderRadius: '9999px',
                  border: `1px solid ${C.outlineVariant}`, backgroundColor: C.bg,
                  fontSize: '13px', color: C.onSurface,
                  fontFamily: "'Inter', sans-serif", fontWeight: '400', outline: 'none',
                }}
              />
              <button onClick={sendMessage} style={{
                width: '34px', height: '34px', borderRadius: '9999px',
                backgroundColor: C.error, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Send size={14} color="#fff" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .leaflet-container {
          height: 100% !important;
          width: 100% !important;
        }
      `}</style>
    </div>
  );
}