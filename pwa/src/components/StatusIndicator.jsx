// src/components/StatusIndicator.jsx

export function StatusIndicator({ gpsReady, apiReady }) {
  return (
    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: gpsReady ? '#22c55e' : '#ef4444',
        }} />
        <span style={{ color: '#ccc', fontSize: '13px' }}>
          {gpsReady ? 'GPS Ready' : 'GPS Unavailable'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: apiReady ? '#22c55e' : '#ef4444',
        }} />
        <span style={{ color: '#ccc', fontSize: '13px' }}>
          {apiReady ? 'Connected' : 'Offline'}
        </span>
      </div>
    </div>
  );
}