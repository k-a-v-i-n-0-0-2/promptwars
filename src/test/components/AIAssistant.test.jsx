import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIAssistant from '../../components/AIAssistant';

describe('AIAssistant Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with default greeting', () => {
    render(<AIAssistant />);
    expect(screen.getByText(/I can help you with real-time crowd monitoring/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask Sophia anything/i)).toBeInTheDocument();
  });

  it('handles user input and sends message', async () => {
    const user = userEvent.setup();
    render(<AIAssistant />);
    
    const input = screen.getByPlaceholderText(/Ask Sophia anything/i);
    const sendBtn = screen.getByRole('button', { name: /Send message/i });
    
    // Type a message
    await user.type(input, 'What is the current wait time?');
    expect(input.value).toBe('What is the current wait time?');
    
    // Send it
    await user.click(sendBtn);
    
    // User message should appear
    expect(await screen.findByText('What is the current wait time?')).toBeInTheDocument();
    
    // Wait for mock response to appear
    screen.debug();
    expect(await screen.findByText(/This is a mock response from Sophia/i, {}, { timeout: 4000 })).toBeInTheDocument();
  });

  it('disables send button when input is empty', () => {
    render(<AIAssistant />);
    const sendBtn = screen.getByRole('button', { name: /Send message/i });
    expect(sendBtn).toBeDisabled();
  });
});
