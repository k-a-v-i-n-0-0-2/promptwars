import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

/**
 * Central stadium telemetry data hook.
 * Simulates real-time IoT sensor feeds with periodic updates.
 * All data is memoized to prevent unnecessary re-renders.
 *
 * @param {number} updateIntervalMs - How often to refresh data (default: 5000ms)
 * @returns {Object} Stadium telemetry state
 */
export function useStadiumData(updateIntervalMs = 5000) {
  const [tick, setTick] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTick((prev) => prev + 1);
    }, updateIntervalMs);
    return () => clearInterval(intervalRef.current);
  }, [updateIntervalMs]);

  const crowd = useMemo(() => ({
    totalCapacity: 89400,
    currentOccupancy: 87432 + Math.floor(Math.sin(tick * 0.1) * 200),
    occupancyPercent: parseFloat((((87432 + Math.sin(tick * 0.1) * 200) / 89400) * 100).toFixed(1)),
    entryRate: 124 + Math.floor(Math.sin(tick * 0.3) * 30),
    exitRate: 18 + Math.floor(Math.abs(Math.sin(tick * 0.2)) * 8),
    peakSection: 'NW',
    peakDensity: 94.2 + Math.sin(tick * 0.15) * 2,
    zones: {
      north: { density: 91 + Math.sin(tick * 0.12) * 3, trend: 'rising' },
      south: { density: 84 + Math.cos(tick * 0.1) * 2, trend: 'stable' },
      east: { density: 78 + Math.sin(tick * 0.08) * 4, trend: 'falling' },
      west: { density: 88 + Math.cos(tick * 0.11) * 3, trend: 'rising' },
    },
  }), [tick]);

  const gates = useMemo(() => [
    { id: 'G1', name: 'Gate 1 North', throughput: 4200 + Math.floor(Math.sin(tick * 0.2) * 200), capacity: 5000, waitMinutes: 1.2 + Math.sin(tick * 0.1) * 0.3, status: 'open' },
    { id: 'G2', name: 'Gate 2 North', throughput: 3800 + Math.floor(Math.cos(tick * 0.15) * 300), capacity: 5000, waitMinutes: 3.8 + Math.cos(tick * 0.12) * 0.5, status: 'congested' },
    { id: 'G3', name: 'Gate 3 East', throughput: 4600 + Math.floor(Math.sin(tick * 0.18) * 150), capacity: 5000, waitMinutes: 0.9 + Math.sin(tick * 0.08) * 0.2, status: 'open' },
    { id: 'G4', name: 'Gate 4 East', throughput: 3200 + Math.floor(Math.cos(tick * 0.22) * 250), capacity: 5000, waitMinutes: 2.1 + Math.cos(tick * 0.1) * 0.4, status: 'open' },
    { id: 'G5', name: 'Gate 5 South', throughput: 4900 + Math.floor(Math.sin(tick * 0.13) * 100), capacity: 5000, waitMinutes: 1.5 + Math.sin(tick * 0.09) * 0.3, status: 'open' },
    { id: 'G6', name: 'Gate 6 West', throughput: 2800 + Math.floor(Math.cos(tick * 0.17) * 200), capacity: 5000, waitMinutes: 4.2 + Math.cos(tick * 0.14) * 0.6, status: 'congested' },
  ], [tick]);

  const environment = useMemo(() => ({
    temperature: parseFloat((24.2 + Math.sin(tick * 0.05) * 0.8).toFixed(1)),
    humidity: parseFloat((46.8 + Math.cos(tick * 0.06) * 2).toFixed(1)),
    windSpeed: parseFloat((14.8 + Math.sin(tick * 0.04) * 1.2).toFixed(1)),
    noiseLevel: Math.floor(94 + Math.sin(tick * 0.3) * 6),
    noisePeak: 106,
    airQualityIndex: Math.floor(42 + Math.sin(tick * 0.07) * 5),
    uvIndex: parseFloat((6.2 + Math.sin(tick * 0.02) * 0.5).toFixed(1)),
    rainProbability: Math.max(0, Math.min(100, Math.floor(23 + Math.sin(tick * 0.03) * 10))),
  }), [tick]);

  const safety = useMemo(() => ({
    overallScore: parseFloat((98.7 - Math.abs(Math.sin(tick * 0.08)) * 1.2).toFixed(1)),
    threatLevel: 'GREEN',
    activeAlerts: 0,
    securityPersonnel: { deployed: 342, available: 28 },
    cctvOnline: 486,
    cctvTotal: 490,
    incidentsToday: 3,
    incidentsResolved: 3,
  }), [tick]);

  const medical = useMemo(() => ({
    unitsDeployed: 12,
    unitsAvailable: 4,
    activeIncidents: 1,
    avgResponseTime: parseFloat((2.3 + Math.sin(tick * 0.1) * 0.3).toFixed(1)),
    patientsToday: 14,
    criticalCases: 0,
    wheelchairsAvailable: 18,
    defibrillators: { online: 24, total: 24 },
  }), [tick]);

  const transport = useMemo(() => ({
    parkingLots: [
      { id: 'A', name: 'Lot A', capacity: 5000, occupied: 4820 + Math.floor(Math.sin(tick * 0.1) * 30), fillRate: 12 },
      { id: 'B', name: 'Lot B', capacity: 4000, occupied: 3740 + Math.floor(Math.cos(tick * 0.12) * 25), fillRate: 18 },
      { id: 'C', name: 'Lot C', capacity: 3000, occupied: 2100 + Math.floor(Math.sin(tick * 0.08) * 40), fillRate: 8 },
      { id: 'D', name: 'Lot D', capacity: 3500, occupied: 1890 + Math.floor(Math.cos(tick * 0.09) * 35), fillRate: 5 },
    ],
    publicTransit: {
      busesActive: 24,
      trainFrequencyMin: 8,
      rideshareQueue: 340 + Math.floor(Math.sin(tick * 0.15) * 40),
    },
    vipArrivals: [
      { id: 'V1', name: 'Presidential Suite', eta: '14 min', status: 'en-route' },
      { id: 'V2', name: 'FIFA Delegation', eta: 'Arrived', status: 'arrived' },
      { id: 'V3', name: 'Broadcast Team', eta: '22 min', status: 'en-route' },
    ],
  }), [tick]);

  const food = useMemo(() => ({
    zones: [
      { id: 'FA', name: 'Zone A Food Court', queueWait: 8 + Math.floor(Math.sin(tick * 0.2) * 2), inventoryPercent: 72 - tick * 0.3, transactions: 1240 + Math.floor(Math.sin(tick * 0.1) * 50) },
      { id: 'FB', name: 'Zone B Concessions', queueWait: 3 + Math.floor(Math.cos(tick * 0.15) * 1), inventoryPercent: 88 - tick * 0.2, transactions: 890 + Math.floor(Math.cos(tick * 0.12) * 30) },
      { id: 'FC', name: 'Zone C Kiosks', queueWait: 5 + Math.floor(Math.sin(tick * 0.18) * 2), inventoryPercent: 65 - tick * 0.4, transactions: 1100 + Math.floor(Math.sin(tick * 0.14) * 40) },
      { id: 'FD', name: 'VIP Dining', queueWait: 1, inventoryPercent: 92 - tick * 0.1, transactions: 560 + Math.floor(Math.cos(tick * 0.1) * 20) },
    ],
    totalRevenue: 284000 + tick * 120,
    halftimeSurgeExpected: true,
    minutesToHalftime: Math.max(0, 16 - Math.floor(tick * 0.15)),
  }), [tick]);

  const maintenance = useMemo(() => ({
    restrooms: [
      { id: 'R1', name: 'Block A North', usage: 78 + Math.floor(Math.sin(tick * 0.12) * 5), cleaningDue: 12, status: 'operational' },
      { id: 'R2', name: 'Block B East', usage: 92 + Math.floor(Math.cos(tick * 0.1) * 3), cleaningDue: 3, status: 'needs-attention' },
      { id: 'R3', name: 'Block C South', usage: 64 + Math.floor(Math.sin(tick * 0.08) * 4), cleaningDue: 22, status: 'operational' },
      { id: 'R4', name: 'Block D West', usage: 85 + Math.floor(Math.cos(tick * 0.11) * 4), cleaningDue: 8, status: 'operational' },
    ],
    powerSystems: { mainGrid: 'nominal', backupGenerators: 'standby', solarOutput: '2.4 MW' },
    hvacStatus: 'optimal',
    cleaningStaff: { active: 48, idle: 12, dispatched: 6 },
  }), [tick]);

  const volunteers = useMemo(() => ({
    totalOnDuty: 186,
    totalAvailable: 24,
    assignments: [
      { zone: 'Gate 1-2', count: 24, needed: 22 },
      { zone: 'Gate 3-4', count: 18, needed: 20 },
      { zone: 'Gate 5-6', count: 22, needed: 24 },
      { zone: 'Concourse N', count: 32, needed: 30 },
      { zone: 'Concourse S', count: 28, needed: 28 },
      { zone: 'Medical Support', count: 16, needed: 16 },
      { zone: 'Information Desks', count: 20, needed: 18 },
      { zone: 'Accessibility', count: 14, needed: 14 },
      { zone: 'VIP Services', count: 12, needed: 12 },
    ],
    shiftEnd: '19:30',
    nextShiftIn: '42 min',
  }), [tick]);

  const match = useMemo(() => ({
    home: 'Argentina',
    away: 'Portugal',
    scoreHome: 2,
    scoreAway: 1,
    minute: 74 + Math.floor(tick * 0.08),
    venue: 'MetLife Stadium',
    competition: 'FIFA World Cup 2026 — Semi-Final',
    kickoff: '17:00 ET',
  }), [tick]);

  const timestamp = useMemo(() => new Date().toISOString(), [tick]);

  return {
    crowd, gates, environment, safety, medical,
    transport, food, maintenance, volunteers, match,
    timestamp, tick,
  };
}

/**
 * Build a telemetry summary string for AI context injection.
 * @param {Object} data - Stadium data from useStadiumData
 * @returns {string} Formatted telemetry string
 */
export function buildTelemetrySummary(data) {
  if (!data) return '';
  const { crowd, gates, environment, safety, medical, transport, food, match } = data;
  const avgWait = gates.reduce((sum, g) => sum + g.waitMinutes, 0) / gates.length;
  return `LIVE STADIUM TELEMETRY (${data.timestamp}):
- Match: ${match.home} ${match.scoreHome} - ${match.scoreAway} ${match.away} (${match.minute}th minute)
- Venue: ${match.venue} | ${match.competition}
- Occupancy: ${crowd.currentOccupancy.toLocaleString()} / ${crowd.totalCapacity.toLocaleString()} (${crowd.occupancyPercent}%)
- Entry Rate: ${crowd.entryRate}/min | Exit Rate: ${crowd.exitRate}/min
- Peak Zone: ${crowd.peakSection} at ${crowd.peakDensity.toFixed(1)}% density
- Avg Gate Wait: ${avgWait.toFixed(1)} min | Gates Open: ${gates.filter(g => g.status !== 'closed').length}/${gates.length}
- Safety Score: ${safety.overallScore}% | Threat Level: ${safety.threatLevel} | Active Alerts: ${safety.activeAlerts}
- Temperature: ${environment.temperature}°C | Humidity: ${environment.humidity}% | Wind: ${environment.windSpeed} km/h
- Noise: ${environment.noiseLevel} dB (Peak ${environment.noisePeak} dB) | Air Quality: ${environment.airQualityIndex} AQI
- Rain Probability: ${environment.rainProbability}% | UV Index: ${environment.uvIndex}
- Medical Units: ${medical.unitsDeployed} deployed, ${medical.unitsAvailable} standby | Active Incidents: ${medical.activeIncidents}
- Parking: Lot A ${Math.round(transport.parkingLots[0].occupied/transport.parkingLots[0].capacity*100)}% | Lot B ${Math.round(transport.parkingLots[1].occupied/transport.parkingLots[1].capacity*100)}% | Lot C ${Math.round(transport.parkingLots[2].occupied/transport.parkingLots[2].capacity*100)}%
- Food Revenue: $${(food.totalRevenue/1000).toFixed(0)}K | Halftime in: ${food.minutesToHalftime} min`;
}

export default useStadiumData;
