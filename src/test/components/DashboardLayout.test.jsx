import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardLayout from '../../components/DashboardLayout';

describe('DashboardLayout Component', () => {
  it('renders correctly with given active tab', () => {
    render(<DashboardLayout activeTab="overview" onTabChange={vi.fn()} onCommandPalette={vi.fn()} />);
    expect(screen.getByText(/System workspace/i)).toBeInTheDocument();
  });

  it('calls onTabChange when a sidebar item is clicked', async () => {
    const onTabChange = vi.fn();
    const user = userEvent.setup();
    render(<DashboardLayout activeTab="overview" onTabChange={onTabChange} onCommandPalette={vi.fn()} />);
    
    // There are two navigation elements for "Stadium Map" (sidebar and mobile nav), click the first one
    const mapBtn = screen.getAllByRole('button', { name: /Stadium Map/i })[0];
    await user.click(mapBtn);
    
    expect(onTabChange).toHaveBeenCalledWith('map');
  });

  it('calls onCommandPalette when search button is clicked', async () => {
    const onCommandPalette = vi.fn();
    const user = userEvent.setup();
    render(<DashboardLayout activeTab="overview" onTabChange={vi.fn()} onCommandPalette={onCommandPalette} />);
    
    const searchBtn = screen.getByRole('button', { name: /Search/i });
    await user.click(searchBtn);
    
    expect(onCommandPalette).toHaveBeenCalled();
  });
});
