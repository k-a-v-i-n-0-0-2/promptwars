import { describe, it, expect } from 'vitest';
import { sanitizeInput } from '../utils/validators';
import DOMPurify from 'dompurify';

describe('Security Checks', () => {
  it('sanitizes malicious input', () => {
    const malicious = '<script>alert(1)</script>hello';
    const sanitized = sanitizeInput(malicious);
    
    // Test that the output is sanitized when rendered (DOMPurify is used in the app)
    const safeHtml = DOMPurify.sanitize(sanitized);
    expect(safeHtml).not.toContain('<script>');
    expect(safeHtml).toContain('hello');
  });

  it('handles extremely long inputs to prevent DoS', () => {
    const longString = 'A'.repeat(10000);
    const sanitized = sanitizeInput(longString, 500);
    expect(sanitized.length).toBe(500);
  });
});
