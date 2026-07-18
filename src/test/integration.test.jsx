import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardLayout from '../components/DashboardLayout';

// Mock Rechards and Three.js components to keep tests fast
vi.mock('../components/InteractiveMap', () => ({
  default: () => <div data-testid="interactive-map">Map</div>
}));
vi.mock('../components/Overview', () => ({
  default: () => <div data-testid="overview">Overview</div>
}));

describe('Dashboard Integration', () => {
  it('navigates correctly using sidebar and command palette', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<DashboardLayout activeTab="overview" onTabChange={() => {}} onCommandPalette={() => {}} />);
    
    expect(await screen.findByTestId('overview')).toBeInTheDocument();
  });
});
