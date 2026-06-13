/// src/services/api.js

const BASE_URL = 'http://127.0.0.1:8000';

export async function triggerSOS(lat, lng) {
  const response = await fetch(`${BASE_URL}/api/sos/trigger`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lat,
      lng,
      trigger_type: 'manual',
    }),
  });

  if (!response.ok) {
    throw new Error('SOS trigger failed');
  }

  return response.json(); // returns { incident_id }
}