// Web Vitals and Analytics
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface AnalyticsEvent {
  name: string;
  value: number;
  id: string;
  delta: number;
  navigationType: string;
}

class Analytics {
  private isProduction = process.env.NODE_ENV === 'production';
  private isDevelopment = process.env.NODE_ENV === 'development';

  init() {
    if (this.isDevelopment) {
      console.log('Analytics initialized in development mode');
    }

    // Web Vitals
    this.trackWebVitals();
    
    // Page views
    this.trackPageViews();
    
    // User interactions
    this.trackUserInteractions();
  }

  private trackWebVitals() {
    getCLS(this.sendToAnalytics);
    getFID(this.sendToAnalytics);
    getFCP(this.sendToAnalytics);
    getLCP(this.sendToAnalytics);
    getTTFB(this.sendToAnalytics);
  }

  private trackPageViews() {
    // Track page views
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this.trackEvent('page_view', {
          page: window.location.pathname,
          timestamp: Date.now(),
        });
      });
    }
  }

  private trackUserInteractions() {
    // Track button clicks, form submissions, etc.
    if (typeof window !== 'undefined') {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'BUTTON' || target.closest('button')) {
          this.trackEvent('button_click', {
            button: target.textContent || target.getAttribute('aria-label') || 'unknown',
            page: window.location.pathname,
          });
        }
      });
    }
  }

  private sendToAnalytics = (metric: AnalyticsEvent) => {
    if (this.isDevelopment) {
      console.log('Web Vital:', metric);
    }

    if (this.isProduction) {
      // Send to your analytics service
      // Example: Google Analytics, Mixpanel, etc.
      // gtag('event', metric.name, {
      //   event_category: 'Web Vitals',
      //   value: Math.round(metric.value),
      //   event_label: metric.id,
      //   non_interaction: true,
      // });
    }
  };

  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (this.isDevelopment) {
      console.log('Event:', eventName, properties);
    }

    if (this.isProduction) {
      // Send to analytics service
      // Example: gtag('event', eventName, properties);
    }
  }

  trackUserAction(action: string, userId?: string, details?: Record<string, any>) {
    this.trackEvent('user_action', {
      action,
      userId,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      timestamp: Date.now(),
      ...details,
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      timestamp: Date.now(),
      ...context,
    });
  }
}

export const analytics = new Analytics();

// Initialize analytics when the app loads
if (typeof window !== 'undefined') {
  analytics.init();
}
