// src/lib/analytics.js
export const trackEvent = (eventName, properties = {}) => {
    console.log(`Tracking event: ${eventName}`, properties);
    // In a real implementation, this would send data to an analytics service like Mixpanel, Google Analytics, etc.
    // Example: analytics.track(eventName, properties);
  };
