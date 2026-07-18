import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import * as vitestAxe from 'vitest-axe';
import Overview from '../components/Overview';
import EmergencyCenter from '../components/EmergencyCenter';
import AIAssistant from '../components/AIAssistant';

// Mock recharts to avoid ResizeObserver issues
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '100%', height: '300px' }}>{children}</div>
    ),
  };
});

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

expect.extend(vitestAxe);

describe('Accessibility Checks', () => {
  it('Overview should have no critical accessibility violations', async () => {
    const { container } = render(<Overview />);
    const results = await axe(container);
    // Check there are no critical or serious violations
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical).toHaveLength(0);
  });

  it('EmergencyCenter should have no critical accessibility violations', async () => {
    const { container } = render(<EmergencyCenter />);
    const results = await axe(container);
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical).toHaveLength(0);
  });

  it('AIAssistant should have no critical accessibility violations', async () => {
    const { container } = render(<AIAssistant />);
    const results = await axe(container);
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical).toHaveLength(0);
  });
});
