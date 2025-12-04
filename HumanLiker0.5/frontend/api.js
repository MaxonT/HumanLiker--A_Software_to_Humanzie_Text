/**
 * HumanLiker API Client
 * Handles all API communication with the backend
 */

function getApiBaseUrl() {
  // Priority 1: Check for window.__API_URL__ (set in index.html)
  if (typeof window !== 'undefined' && window.__API_URL__) {
    const url = window.__API_URL__.trim();
    if (url) {
      return url;
    }
  }
  // Priority 2: Check for config file
  if (typeof window !== 'undefined' && window.__API_CONFIG__ && window.__API_CONFIG__.API_BASE_URL) {
    return window.__API_CONFIG__.API_BASE_URL;
  }
  // Priority 3: Development - use localhost
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
      return 'http://localhost:3000/api';
    }
  }
  // Priority 4: Production fallback - show warning
  console.error('API URL not configured. Please set window.__API_URL__ or configure config.js');
  return 'http://localhost:3000/api'; // Fallback to prevent complete failure
}

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          error: { message: `HTTP ${response.status}: ${response.statusText}` }
        }));
        throw new Error(error.error?.message || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please ensure the backend is running on port 3000.');
      }
      throw error;
    }
  }

  /**
   * Transform text
   */
  async transform({ text, tone, formality, sessionId, modelPreference }) {
    return this.request('/transform', {
      method: 'POST',
      body: {
        text,
        tone,
        formality,
        sessionId,
        modelPreference
      }
    });
  }

  /**
   * Get history list
   */
  async getHistory({ sessionId, limit = 20, offset = 0 } = {}) {
    const params = new URLSearchParams();
    if (sessionId) params.append('sessionId', sessionId);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const query = params.toString();
    return this.request(`/history${query ? '?' + query : ''}`);
  }

  /**
   * Get single history record
   */
  async getHistoryRecord(id) {
    return this.request(`/history/${id}`);
  }

  /**
   * Delete history record
   */
  async deleteHistoryRecord(id) {
    return this.request(`/history/${id}`, {
      method: 'DELETE'
    });
  }

  /**
   * Health check
   */
  async health() {
    return this.request('/health');
  }
}

// Export singleton instance
export const api = new ApiClient();

