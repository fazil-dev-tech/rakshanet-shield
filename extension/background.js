// RakshaNet Shield — Background Service Worker
// Monitors URLs and provides real-time threat alerts

const SUSPICIOUS_TLDS = ['.xyz', '.top', '.club', '.work', '.click', '.buzz', '.icu', '.monster', '.tk', '.ml', '.ga', '.cf'];

chrome.webNavigation?.onCompleted?.addListener((details) => {
  if (details.frameId !== 0) return; // Only main frame
  
  try {
    const url = new URL(details.url);
    const domain = url.hostname.toLowerCase();
    
    // Enhanced threat check via Next.js API
    try {
      fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: details.url })
      }).then(res => res.json()).then(data => {
        if (data.success && data.analysis && data.analysis.riskScore > 30) {
          const isHighRisk = data.analysis.riskScore > 60;
          chrome.action.setBadgeText({ text: '!', tabId: details.tabId });
          chrome.action.setBadgeBackgroundColor({ color: isHighRisk ? '#EF4444' : '#F59E0B', tabId: details.tabId });
          
          chrome.storage.local.set({
            [`scan_${details.tabId}`]: {
              url: details.url,
              domain: domain,
              risk: isHighRisk ? 'high' : 'medium',
              timestamp: Date.now(),
              analysis: data.analysis
            }
          });
        } else {
          // Fallback to quick local check if API says it's safe or fails
          const isSuspicious = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
          const isHTTP = url.protocol === 'http:';
          const hasExcessiveSubdomains = domain.split('.').length > 4;
          
          if (isSuspicious || isHTTP || hasExcessiveSubdomains) {
            chrome.action.setBadgeText({ text: '!', tabId: details.tabId });
            chrome.action.setBadgeBackgroundColor({ color: isSuspicious ? '#EF4444' : '#F59E0B', tabId: details.tabId });
            chrome.storage.local.set({
              [`scan_${details.tabId}`]: {
                url: details.url,
                domain: domain,
                risk: isSuspicious ? 'high' : 'medium',
                timestamp: Date.now(),
              }
            });
          } else {
            chrome.action.setBadgeText({ text: '✓', tabId: details.tabId });
            chrome.action.setBadgeBackgroundColor({ color: '#22C55E', tabId: details.tabId });
          }
        }
      }).catch(err => {
        console.error("API Analysis failed", err);
      });
    } catch (apiError) {
      console.error(apiError);
    }
  } catch (e) {
    // Ignore invalid URLs
  }
});

// Clean up old scan data periodically
chrome.alarms?.create('cleanup', { periodInMinutes: 60 });
chrome.alarms?.onAlarm?.addListener((alarm) => {
  if (alarm.name === 'cleanup') {
    chrome.storage.local.get(null, (items) => {
      const now = Date.now();
      const keysToRemove = Object.keys(items).filter(key => {
        if (key.startsWith('scan_') && items[key].timestamp) {
          return now - items[key].timestamp > 3600000; // 1 hour
        }
        return false;
      });
      if (keysToRemove.length > 0) {
        chrome.storage.local.remove(keysToRemove);
      }
    });
  }
});

console.log('🛡️ RakshaNet Shield — Background Service Worker Active');
