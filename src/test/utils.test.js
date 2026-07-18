import { describe, it, expect } from 'vitest';
import { sanitizeInput, validateApiResponse, RateLimiter } from '../utils/validators';
import { AI_DOMAIN_PROMPTS } from '../utils/aiPrompts';

describe('validators utility', () => {
  it('sanitizeInput trims and slices', () => {
    expect(sanitizeInput('   hello world   ', 5)).toBe('hello');
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(123)).toBe('');
  });

  it('validateApiResponse checks format', () => {
    expect(validateApiResponse(null)).toBe(false);
    expect(validateApiResponse({})).toBe(false);
    expect(validateApiResponse({ candidates: [] })).toBe(false);
    expect(validateApiResponse({
      candidates: [{
        content: { parts: [{ text: 'valid' }] }
      }]
    })).toBe(true);
  });
});

describe('RateLimiter', () => {
  it('allows calls under limit and blocks over limit', () => {
    const limiter = new RateLimiter(2, 1000); // 2 calls per second
    
    expect(limiter.checkLimit()).toBe(true); // 1
    expect(limiter.checkLimit()).toBe(true); // 2
    expect(limiter.checkLimit()).toBe(false); // 3 (blocked)
  });
});

describe('aiPrompts', () => {
  it('contains expected domains', () => {
    expect(AI_DOMAIN_PROMPTS.executive).toBeDefined();
    expect(AI_DOMAIN_PROMPTS.crowd).toBeDefined();
    expect(AI_DOMAIN_PROMPTS.security).toBeDefined();
    expect(typeof AI_DOMAIN_PROMPTS.executive).toBe('string');
  });
});
