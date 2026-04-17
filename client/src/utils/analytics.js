// Simple analytics utility
class Analytics {
  constructor() {
    this.events = [];
    this.enabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  }

  // Track page views
  trackPageView(page) {
    if (!this.enabled) return;
    
    const event = {
      type: 'page_view',
      page,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    this.events.push(event);
    console.log('[Analytics] Page View:', event);
    
    // In production, send to analytics backend
    // this.sendToBackend(event);
  }

  // Track custom events
  trackEvent(eventName, properties = {}) {
    if (!this.enabled) return;
    
    const event = {
      type: 'custom_event',
      name: eventName,
      properties,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };
    
    this.events.push(event);
    console.log('[Analytics] Event:', event);
    
    // In production, send to analytics backend
    // this.sendToBackend(event);
  }

  // Track user actions
  trackUserAction(action, details = {}) {
    this.trackEvent('user_action', { action, ...details });
  }

  // Send to backend (implement in production)
  async sendToBackend(event) {
    try {
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event),
      // });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  // Get all tracked events
  getEvents() {
    return this.events;
  }

  // Clear events
  clearEvents() {
    this.events = [];
  }
}

// Create singleton instance
const analytics = new Analytics();

export default analytics;
