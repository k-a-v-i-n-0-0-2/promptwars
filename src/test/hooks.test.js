import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useStadiumData, { buildTelemetrySummary } from '../hooks/useStadiumData';
import useAIPrediction from '../hooks/useAIPrediction';
import useRoleAccess, { ROLES } from '../hooks/useRoleAccess';

// Mock matchMedia
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe('useStadiumData', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes and provides stadium data', () => {
    const { result } = renderHook(() => useStadiumData(1000));
    expect(result.current.crowd).toBeDefined();
    expect(result.current.gates).toHaveLength(6);
    expect(result.current.environment).toBeDefined();
  });

  it('updates data over time', () => {
    const { result } = renderHook(() => useStadiumData(1000));
    const initialTick = result.current.tick;
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(result.current.tick).toBeGreaterThan(initialTick);
  });

  it('buildTelemetrySummary generates correct string', () => {
    const { result } = renderHook(() => useStadiumData(1000));
    const summary = buildTelemetrySummary(result.current);
    expect(summary).toContain('LIVE STADIUM TELEMETRY');
    expect(summary).toContain('Occupancy:');
  });
});

describe('useRoleAccess', () => {
  it('initializes with default role', () => {
    const { result } = renderHook(() => useRoleAccess());
    expect(result.current.activeRole).toBe('admin');
    expect(result.current.hasAccessToModule('overview')).toBe(true);
  });

  it('can change roles and verify access', () => {
    const { result } = renderHook(() => useRoleAccess('ceo'));
    expect(result.current.activeRole).toBe('ceo');
    expect(result.current.hasAccessToModule('executive')).toBe(true);
    expect(result.current.hasAccessToModule('volunteer')).toBe(false);

    act(() => {
      result.current.setRole('ops');
    });

    expect(result.current.activeRole).toBe('ops');
    expect(result.current.hasAccessToModule('volunteer')).toBe(true);
    expect(result.current.hasAccessToModule('executive')).toBe(false);
  });
});

describe('useAIPrediction', () => {
  const mockStadiumData = {
    crowd: { currentOccupancy: 87000, totalCapacity: 89000, occupancyPercent: 97, peakSection: 'NW', peakDensity: 92, entryRate: 100, exitRate: 10 },
    environment: { temperature: 24, humidity: 45, windSpeed: 10, noiseLevel: 90, noisePeak: 100, airQualityIndex: 40, rainProbability: 10, uvIndex: 5 },
    food: { minutesToHalftime: 10, totalRevenue: 100000 },
    gates: [{ waitMinutes: 1, status: 'open' }],
    safety: { overallScore: 99, threatLevel: 'GREEN', activeAlerts: 0 },
    medical: { unitsDeployed: 10, unitsAvailable: 5, activeIncidents: 0 },
    transport: { parkingLots: [{ capacity: 100, occupied: 50 }, { capacity: 100, occupied: 50 }, { capacity: 100, occupied: 50 }] },
    match: { home: 'Team A', away: 'Team B', scoreHome: 0, scoreAway: 0, minute: 45, venue: 'Stadium', competition: 'Cup' },
    timestamp: '2026-07-18T10:00:00.000Z'
  };

  it('provides offline fallback when API fails or not used', async () => {
    const { result } = renderHook(() => useAIPrediction('crowd', mockStadiumData));
    
    act(() => {
      result.current.refresh();
    });

    // Wait for the async fallback to set
    await vi.waitFor(() => {
      expect(result.current.prediction).not.toBeNull();
    });

    expect(result.current.prediction.summary).toContain('AI predicts');
    expect(result.current.prediction.confidence).toBeGreaterThan(0);
    expect(result.current.confidence).toBeGreaterThan(0);
  });
});
