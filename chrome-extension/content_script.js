/**
 * Content script: reads current URL (hostname) for context.
 * Does not send data to third parties; popup/background use it for threat-score API only.
 */

(function () {
  const hostname = window.location.hostname.replace(/^www\./, '');
  // Expose for optional use (e.g. tooltip on page). No external calls from here.
  if (typeof window.__nexusCurrentHostname === 'undefined') {
    window.__nexusCurrentHostname = hostname;
  }
})();
