import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App Component', () => {
  it('renders landing page initially', () => {
    render(<App />);
    expect(screen.getByText(/The Future of/i)).toBeInTheDocument();
    expect(screen.getByText(/Stadium Intelligence/i)).toBeInTheDocument();
  });

  it('navigates to dashboard on button click', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const enterBtn = screen.getByRole('button', { name: /Enter Command Center/i });
    await user.click(enterBtn);
    
    // Should now be on the dashboard showing the Overview tab
    expect(screen.getByText(/System workspace/i)).toBeInTheDocument();
  });
});
