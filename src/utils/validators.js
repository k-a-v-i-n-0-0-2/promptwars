/**
 * Sanitizes input strings by trimming and truncating to a max length.
 * Prevents excessively large payloads.
 *
 * @param {string} input - The input string to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized string
 */
export function sanitizeInput(input, maxLength = 500) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, maxLength);
}

/**
 * Validates the structure of a Gemini API response.
 *
 * @param {Object} data - The raw API response JSON
 * @returns {boolean} True if the structure contains the expected parts
 */
export function validateApiResponse(data) {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.candidates) || data.candidates.length === 0) return false;
  const candidate = data.candidates[0];
  if (!candidate.content || !Array.isArray(candidate.content.parts)) return false;
  if (candidate.content.parts.length === 0 || typeof candidate.content.parts[0].text !== 'string') return false;
  return true;
}

/**
 * Rate Limiter class to manage API call frequencies.
 * Useful for singleton-style rate limiting across the app if needed.
 */
export class RateLimiter {
  constructor(limit = 10, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  /**
   * Checks if a new request is allowed.
   * @returns {boolean} True if allowed, false if rate limited.
   */
  checkLimit() {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(ts => now - ts < this.windowMs);
    if (this.timestamps.length >= this.limit) {
      return false;
    }
    this.timestamps.push(now);
    return true;
  }
}
