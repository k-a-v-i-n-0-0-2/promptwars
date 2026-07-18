export const LOG_TEMPLATES = [
  { level: 'OK', source: 'INGRESS', desc: 'Scanner handshake accepted at GATE_04 (UID: 9f81a)' },
  { level: 'OK', source: 'THERMAL', desc: 'HVAC fan speed auto-adjusted in ZONE_EAST to 65%' },
  { level: 'WARN', source: 'INGRESS', desc: 'Gate 2 queue length approaching 5-minute threshold' },
  { level: 'OK', source: 'NETWORK', desc: 'Sensor grid ping check complete (1420/1420 active)' },
  { level: 'OK', source: 'SYSTEM', desc: 'Evacuation routing optimization completed in 4.2ms' },
  { level: 'OK', source: 'CONCESS', desc: 'Transaction node CONCESS_B registered 12.4 tx/sec' },
  { level: 'OK', source: 'INGRESS', desc: 'Redirection script GATE_02_OVERFLOW initialized' },
  { level: 'WARN', source: 'AUDIO', desc: 'Decibel peak registered in Section North (106.4 dB)' },
];

export const generateTimelineData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    spectators: Math.floor(45000 + Math.sin((i - 8) * 0.25) * 32000 + Math.random() * 4000),
    bandwidth: parseFloat((1.2 + Math.cos((i - 8) * 0.2) * 0.6 + Math.random() * 0.2).toFixed(2)),
  }));
};

export const generateSensorNodes = () => {
  return Array.from({ length: 16 }, (_, i) => ({
    id: `N-${String(i + 1).padStart(2, '0')}`,
    zone: ['NW', 'NE', 'SW', 'SE'][i % 4],
    temp: parseFloat((21.5 + (i % 3) * 0.8 + Math.random() * 0.5).toFixed(1)),
    status: i === 6 ? 'WARN' : 'OK',
    load: Math.floor(40 + (i * 3.5) % 45),
  }));
};

export const BRIEFINGS = [
  { status: 'OPTIMAL', text: 'All 24 stadium gates are open and flowing. Average entry wait time is 2.4 minutes. Air quality and temperature remain within comfortable thresholds.' },
  { status: 'ATTENTION', text: 'Gate 2 experiencing higher arrival volumes than predicted. Flow is active but wait times are slightly increased. Redirections are handling the load.' },
  { status: 'OPTIMAL', text: 'Next flow peak is expected in 15 minutes as kickoff approaches. Medical and safety grids are fully synched with local command protocols.' },
];
