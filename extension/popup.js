// RakshaNet Shield — Extension Popup Logic
// URL Threat Analysis Engine (Client-Side AI)

const SUSPICIOUS_TLDS = ['.xyz', '.top', '.club', '.work', '.click', '.buzz', '.icu', '.monster', '.tk', '.ml', '.ga', '.cf', '.gq'];
const TRUSTED_DOMAINS = ['google.com', 'facebook.com', 'microsoft.com', 'apple.com', 'amazon.com', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'rbi.org.in', 'gov.in', 'github.com', 'stackoverflow.com', 'youtube.com', 'twitter.com', 'linkedin.com', 'wikipedia.org'];
const PHISHING_KEYWORDS = ['login', 'verify', 'secure', 'update', 'confirm', 'account', 'password', 'banking', 'kyc', 'otp', 'suspended', 'blocked'];

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i-1] === a[j-1]
        ? matrix[i-1][j-1]
        : Math.min(matrix[i-1][j-1] + 1, matrix[i][j-1] + 1, matrix[i-1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

function analyzeURL(url) {
  const issues = [];
  let riskScore = 0;
  const checks = { ssl: 'safe', domain: 'safe', typo: 'safe', phishing: 'safe', ai: 'safe' };

  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    // Check SSL
    if (parsed.protocol === 'http:') {
      checks.ssl = 'danger';
      issues.push('No HTTPS encryption');
      riskScore += 20;
    } else {
      checks.ssl = 'safe';
    }

    // Check if trusted domain
    const isTrusted = TRUSTED_DOMAINS.some(td => domain === td || domain.endsWith('.' + td));
    if (isTrusted) {
      checks.domain = 'safe';
    } else {
      // Check TLD
      const hasSuspiciousTLD = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
      if (hasSuspiciousTLD) {
        checks.domain = 'danger';
        issues.push('Suspicious TLD detected');
        riskScore += 30;
      } else {
        checks.domain = 'warning';
        riskScore += 5;
      }

      // IP-based URL
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(domain)) {
        checks.domain = 'danger';
        issues.push('Raw IP address used');
        riskScore += 25;
      }

      // Excessive subdomains
      if (domain.split('.').length > 4) {
        issues.push('Excessive subdomains');
        riskScore += 10;
      }
    }

    // Typosquatting
    let typosquatTarget = null;
    for (const trusted of TRUSTED_DOMAINS) {
      const dist = levenshtein(domain.replace(/\..+$/, ''), trusted.replace(/\..+$/, ''));
      if (dist > 0 && dist <= 2) {
        typosquatTarget = trusted;
        break;
      }
    }
    if (typosquatTarget) {
      checks.typo = 'danger';
      issues.push(`Possible typosquatting of ${typosquatTarget}`);
      riskScore += 35;
    }

    // Phishing keywords in path
    const phishingMatches = PHISHING_KEYWORDS.filter(kw => path.includes(kw) || domain.includes(kw));
    if (phishingMatches.length > 0) {
      checks.phishing = phishingMatches.length >= 2 ? 'danger' : 'warning';
      issues.push(`Suspicious keywords: ${phishingMatches.join(', ')}`);
      riskScore += phishingMatches.length * 8;
    }

    // Long URL
    if (url.length > 120) {
      issues.push('Unusually long URL');
      riskScore += 5;
    }

    // Multiple hyphens
    if (domain.split('-').length > 3) {
      issues.push('Multiple hyphens in domain');
      riskScore += 8;
    }

    // AI analysis (overall)
    if (riskScore >= 40) checks.ai = 'danger';
    else if (riskScore >= 15) checks.ai = 'warning';
    else checks.ai = 'safe';

  } catch (e) {
    issues.push('Invalid URL format');
    riskScore = 50;
    checks.domain = 'danger';
    checks.ai = 'danger';
  }

  riskScore = Math.min(100, riskScore);

  let severity, explanation;
  if (riskScore >= 70) {
    severity = 'DANGEROUS';
    explanation = '⚠️ HIGH RISK: This website shows strong indicators of being malicious. Do NOT enter any personal information or credentials. ';
  } else if (riskScore >= 35) {
    severity = 'SUSPICIOUS';
    explanation = '⚡ CAUTION: This website has some suspicious characteristics. Verify its authenticity before sharing any sensitive data. ';
  } else {
    severity = 'SAFE';
    explanation = '✅ This website appears safe based on our analysis. Stay vigilant and report any suspicious activity. ';
  }

  if (issues.length > 0) {
    explanation += 'Issues found: ' + issues.join('; ') + '.';
  }

  return { riskScore, severity, checks, issues, explanation };
}

function updateUI(url, analysis) {
  const { riskScore, severity, checks, issues, explanation } = analysis;

  // Update domain
  try {
    const parsed = new URL(url);
    document.getElementById('domain-name').textContent = parsed.hostname;
    document.getElementById('domain-meta').textContent = `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    document.getElementById('domain-name').textContent = url;
    document.getElementById('domain-meta').textContent = 'Unknown domain';
  }

  // Update risk label & badge
  const riskLabel = document.getElementById('risk-label');
  const riskBadge = document.getElementById('risk-badge');
  riskLabel.textContent = severity;

  if (severity === 'DANGEROUS') {
    riskLabel.className = 'risk-label risk-danger';
    riskBadge.className = 'check-badge badge-danger';
    riskBadge.textContent = '⚠️ DANGER';
  } else if (severity === 'SUSPICIOUS') {
    riskLabel.className = 'risk-label risk-warning';
    riskBadge.className = 'check-badge badge-warning';
    riskBadge.textContent = '⚡ CAUTION';
  } else {
    riskLabel.className = 'risk-label risk-safe';
    riskBadge.className = 'check-badge badge-safe';
    riskBadge.textContent = '✅ SAFE';
  }

  // Animate gauge
  const gaugeArc = document.getElementById('gauge-arc');
  const gaugeScore = document.getElementById('gauge-score');
  const totalLength = 173; // approximate arc length
  const dashLength = (riskScore / 100) * totalLength;

  const color = riskScore >= 70 ? '#EF4444' : riskScore >= 35 ? '#F59E0B' : '#22C55E';
  gaugeArc.setAttribute('stroke', color);
  gaugeScore.setAttribute('fill', color);

  // Animate score
  let currentScore = 0;
  const scoreInterval = setInterval(() => {
    currentScore += 1;
    if (currentScore >= riskScore) {
      currentScore = riskScore;
      clearInterval(scoreInterval);
    }
    gaugeScore.textContent = currentScore;
    const currentDash = (currentScore / 100) * totalLength;
    gaugeArc.setAttribute('stroke-dasharray', `${currentDash} ${totalLength}`);
  }, 20);

  // Update checks
  const checkMap = {
    'check-ssl': checks.ssl,
    'check-domain': checks.domain,
    'check-typo': checks.typo,
    'check-phish': checks.phishing,
    'check-ai': checks.ai,
  };

  const labels = { safe: 'PASS', warning: 'WARN', danger: 'FAIL' };
  const badgeClasses = { safe: 'badge-safe', warning: 'badge-warning', danger: 'badge-danger' };

  Object.entries(checkMap).forEach(([id, status]) => {
    const el = document.getElementById(id);
    el.textContent = labels[status];
    el.className = `check-badge ${badgeClasses[status]}`;
  });

  // AI explanation
  document.getElementById('ai-text').textContent = explanation;

  // Indicators - NUKE AND PAVE (No innerHTML XSS)
  const indicatorsEl = document.getElementById('indicators');
  indicatorsEl.replaceChildren(); // Clear existing
  issues.forEach(issue => {
    const span = document.createElement('span');
    span.className = 'indicator-tag';
    span.textContent = issue; // Strictly safe text injection
    indicatorsEl.appendChild(span);
  });

  // Remove scanning animation
  document.getElementById('risk-card').classList.remove('scanning');
}

function openDashboard() {
  chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
}

function reportScam() {
  chrome.tabs.create({ url: 'http://localhost:3000/report' });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Show loading briefly
  const loading = document.getElementById('loading');
  const main = document.getElementById('main');

  // Try to get the active tab URL
  if (typeof chrome !== 'undefined' && chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const url = tabs[0].url;
        setTimeout(() => {
          const analysis = analyzeURL(url);
          updateUI(url, analysis);
        }, 500);
      } else {
        // Demo mode
        const demoUrl = 'https://sbi-kyc-update.xyz/verify-account';
        setTimeout(() => {
          const analysis = analyzeURL(demoUrl);
          updateUI(demoUrl, analysis);
        }, 500);
      }
    });
  } else {
    // Not in extension context — demo mode
    const demoUrl = 'https://sbi-kyc-update.xyz/verify-account';
    setTimeout(() => {
      const analysis = analyzeURL(demoUrl);
      updateUI(demoUrl, analysis);
    }, 800);
  }
});
