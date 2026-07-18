import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Overview from '../../components/Overview';

// Mock recharts to prevent ResizeObserver issues in tests
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: '100%', height: '300px' }}>{children}</div>
    ),
  };
});

describe('Overview Component', () => {
  it('renders executive briefing', () => {
    render(<Overview />);
    expect(screen.getByText(/Executive Status Briefing/i)).toBeInTheDocument();
  });

  it('renders sensor grid', () => {
    render(<Overview />);
    expect(screen.getByText(/sensor_grid_node_matrix/i)).toBeInTheDocument();
    expect(screen.getByText('N-01')).toBeInTheDocument(); // At least first node
  });

  it('can pause and resume logs', () => {
    render(<Overview />);
    const pauseBtn = screen.getByRole('button', { name: /Pause live logs/i });
    expect(pauseBtn).toBeInTheDocument();
    
    fireEvent.click(pauseBtn);
    
    // Should now show resume button
    const resumeBtn = screen.getByRole('button', { name: /Resume live logs/i });
    expect(resumeBtn).toBeInTheDocument();
  });
});
