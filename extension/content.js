// RakshaNet Shield — Content Script
// Injects warning banners on suspicious pages

(function() {
  'use strict';
  
  const SUSPICIOUS_TLDS = ['.xyz', '.top', '.club', '.work', '.click', '.buzz', '.icu', '.monster', '.tk', '.ml', '.ga', '.cf'];
  const PHISHING_KEYWORDS = ['login', 'verify', 'secure', 'update', 'confirm', 'account', 'password', 'banking', 'kyc', 'otp'];
  
  const domain = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const isHTTP = window.location.protocol === 'http:';
  
  let threatLevel = 'safe';
  const issues = [];
  
  // Base heuristic checks
  if (SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld))) {
    threatLevel = 'danger';
    issues.push('Suspicious domain extension');
  }
  if (isHTTP && !domain.includes('localhost')) {
    if (threatLevel !== 'danger') threatLevel = 'warning';
    issues.push('Unencrypted connection');
  }
  const keywordMatches = PHISHING_KEYWORDS.filter(kw => path.includes(kw) || domain.includes(kw));
  if (keywordMatches.length >= 2) {
    threatLevel = 'danger';
    issues.push('Multiple phishing keywords detected');
  } else if (keywordMatches.length === 1) {
    if (threatLevel === 'safe') threatLevel = 'warning';
  }
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
    threatLevel = 'danger';
    issues.push('IP-based URL detected');
  }

  // Enhanced AI Backend Check
  try {
    const pageText = document.body ? document.body.innerText.substring(0, 1000) : '';
    fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: window.location.href, text: pageText })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.analysis && data.analysis.riskScore > 30) {
        threatLevel = data.analysis.riskScore > 60 ? 'danger' : 'warning';
        issues.push('AI Detected: ' + data.analysis.scamType);
        showBanner();
      } else if (threatLevel !== 'safe') {
        showBanner();
      }
    })
    .catch(err => {
      if (threatLevel !== 'safe') showBanner();
    });
  } catch (e) {
    if (threatLevel !== 'safe') showBanner();
  }

  function showBanner() {
    if (document.getElementById('rakshanet-shield-banner')) return;
    
    const banner = document.createElement('div');
    banner.id = 'rakshanet-shield-banner';
    
    const colors = {
      danger: { bg: 'rgba(239, 68, 68, 0.95)', border: '#DC2626', icon: '🚨' },
      warning: { bg: 'rgba(245, 158, 11, 0.95)', border: '#D97706', icon: '⚠️' },
    };
    
    const config = colors[threatLevel];
    
    banner.innerHTML = `
      <div style="
        position: fixed; top: 0; left: 0; right: 0; z-index: 2147483647;
        background: ${config.bg}; color: white; padding: 12px 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        display: flex; align-items: center; justify-content: space-between;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border-bottom: 2px solid ${config.border};
        backdrop-filter: blur(10px);
        animation: slideDown 0.3s ease-out;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px;">${config.icon}</span>
          <div>
            <div style="font-weight: 700; font-size: 14px;">
              🛡️ RakshaNet Shield — ${threatLevel === 'danger' ? 'DANGEROUS SITE DETECTED' : 'SUSPICIOUS SITE'}
            </div>
            <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">
              ${issues.join(' • ')} — Exercise extreme caution
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="window.history.back()" style="
            padding: 6px 14px; border-radius: 8px; border: 2px solid white;
            background: transparent; color: white; font-weight: 600;
            cursor: pointer; font-size: 12px;
          ">← Go Back</button>
          <button onclick="this.closest('#rakshanet-shield-banner').style.display='none'" style="
            padding: 6px 14px; border-radius: 8px; border: none;
            background: rgba(255,255,255,0.2); color: white; font-weight: 600;
            cursor: pointer; font-size: 12px;
          ">Dismiss</button>
        </div>
      </div>
      <style>
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      </style>
    `;
    document.documentElement.appendChild(banner);
  }
})();
