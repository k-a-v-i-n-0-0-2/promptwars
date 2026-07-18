import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmergencyCenter from '../../components/EmergencyCenter';

describe('EmergencyCenter Component', () => {
  it('renders in inactive state initially', () => {
    render(<EmergencyCenter />);
    expect(screen.getByText('Emergency Response Center')).toBeInTheDocument();
    
    const toggleBtn = screen.getByRole('button', { name: /Activate Emergency Protocol/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('activates protocol when button is clicked', () => {
    render(<EmergencyCenter />);
    
    const toggleBtn = screen.getByRole('button', { name: /Activate Emergency Protocol/i });
    fireEvent.click(toggleBtn);
    
    // aria-pressed should now be true
    expect(toggleBtn.getAttribute('aria-pressed')).toBe('true');
    // Button text should change to Deactivate
    expect(screen.getByText('Deactivate Protocol')).toBeInTheDocument();
  });

  it('can check off items when active', () => {
    render(<EmergencyCenter />);
    
    // First activate
    fireEvent.click(screen.getByRole('button', { name: /Activate Emergency Protocol/i }));
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
    
    const firstCheckbox = checkboxes[0];
    expect(firstCheckbox.getAttribute('aria-checked')).toBe('false');
    
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox.getAttribute('aria-checked')).toBe('true');
  });
});
