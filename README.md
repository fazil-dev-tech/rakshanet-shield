<div align="center">

# 🛡️ RakshaNet Shield

### AI-Powered Cyber Fraud Defense Platform for Digital India

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

**RakshaNet Shield** is an autonomous multi-agent AI platform that detects, analyzes, and generates police-ready reports for cyber fraud — protecting Indian citizens from phishing, investment scams, banking fraud, and more.

[🚀 Live Demo](#) · [📖 Documentation](#architecture) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Browser Extension](#-browser-extension)
- [AI Multi-Agent Pipeline](#-ai-multi-agent-pipeline)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [Security](#-security)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## ✨ Features

### 🤖 Agentic AI Multi-Agent System
- **5 Specialized AI Agents** working in orchestrated pipeline:
  - 🔍 **Text Analysis Agent** — NLP-based urgency, threat, and pressure detection
  - 📦 **Entity Extraction Agent** — Automatic extraction of URLs, phones, UPI IDs, crypto wallets, bank accounts
  - 🌐 **URL Threat Agent** — Domain reputation, typosquatting detection, SSL validation, suspicious TLD flagging
  - ⚖️ **Risk Scoring Agent** — Multi-factor risk aggregation with weighted confidence scoring
  - 📄 **Report Generation Agent** — LLM-powered explainable verdicts and FIR-ready report generation

### 🛡️ Real-Time Protection
- Instant scam detection for **URLs, SMS, messages, calls, and files**
- Live threat intelligence feeds with domain/IP/wallet reputation scoring
- Real-time threat ticker with severity indicators
- **OCR-based screenshot analysis** and **audio transcription** for evidence extraction

### 📊 Command Center Dashboard
- Interactive analytics with **Recharts** data visualizations
- Community-sourced threat feed with voting and trend detection
- Full report management center with PDF export capabilities
- AI-powered chatbot assistant for scam queries

### 🌐 Chrome Browser Extension
- **Manifest V3** Chrome extension for real-time browsing protection
- Automatic URL scanning and phishing page interception
- Content script injection for live page analysis
- Popup dashboard with threat status indicators

### 📝 FIR-Ready Report Generation
- Auto-generated police-ready reports with technical indicators
- Evidence timeline creation with metadata extraction
- PDF export using **jsPDF** and **html2canvas**
- Court-admissible evidence bundles

### 👥 Community Intelligence
- Crowdsourced scam reports with voting and verification
- Scam clustering and trend detection
- Community defender leaderboard

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     RakshaNet Shield Platform                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Next.js    │  │   Chrome     │  │   Supabase Backend   │   │
│  │   Frontend   │  │  Extension   │  │   (Auth + Database)  │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                 │                      │               │
│         └─────────────────┼──────────────────────┘               │
│                           │                                      │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │              AI Orchestrator (Master Agent)                │   │
│  │                                                           │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ ┌──────┐│   │
│  │  │  Text   │ │ Entity  │ │   URL   │ │ Risk  │ │Report││   │
│  │  │Analysis │→│Extract  │→│ Threat  │→│Scoring│→│ Gen  ││   │
│  │  │ Agent   │ │ Agent   │ │ Agent   │ │ Agent │ │Agent ││   │
│  │  └─────────┘ └─────────┘ └─────────┘ └───────┘ └──────┘│   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              External Intelligence Feeds                  │   │
│  │  • Puter AI (LLM/OCR/STT)  • CyberBriefing Threat API   │   │
│  │  • Domain WHOIS/DNS         • Community Reports           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | Server-side rendering, API routes, file-based routing |
| **Language** | TypeScript 5.7 | Type-safe development |
| **UI Library** | React 19 | Component-based UI architecture |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS with custom design tokens |
| **3D Graphics** | Three.js + React Three Fiber | Immersive 3D cyber globe hero section |
| **Animations** | Framer Motion + GSAP | Scroll reveals, page transitions, micro-animations |
| **Charts** | Recharts | Interactive data visualizations |
| **Auth & DB** | Supabase | Authentication, real-time database, row-level security |
| **AI/LLM** | Puter.js | AI chat, OCR (img2txt), speech-to-text |
| **PDF Export** | jsPDF + html2canvas | FIR-ready PDF report generation |
| **Icons** | Lucide React | Modern, consistent icon system |
| **Extension** | Chrome Manifest V3 | Browser-level threat interception |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or yarn/pnpm)
- **Git** ≥ 2.x

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fazil-dev-tech/rakshanet-shield.git
   cd rakshanet-shield
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your credentials (see [Environment Variables](#-environment-variables)).

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Live Threat Intelligence
NEXT_PUBLIC_CYBERBRIEFING_API_KEY=your_cyberbriefing_api_key
```

> ⚠️ **Never commit your `.env.local` file.** It is already included in `.gitignore`.

Refer to `.env.example` for the template.

---

## 📁 Project Structure

```
rakshanet-shield/
├── 📂 extension/                  # Chrome Browser Extension (Manifest V3)
│   ├── manifest.json              # Extension configuration
│   ├── background.js              # Service worker for background tasks
│   ├── content.js                 # Content script for page analysis
│   ├── popup.html                 # Extension popup UI
│   ├── popup.js                   # Popup logic and threat display
│   └── icons/                     # Extension icons
│
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── layout.tsx             # Root layout with metadata & fonts
│   │   ├── page.tsx               # Landing page (hero, features, stats)
│   │   ├── globals.css            # Global styles & design tokens
│   │   ├── template.tsx           # Page transition wrapper
│   │   ├── 📂 login/              # Authentication page
│   │   ├── 📂 api/                # API Routes
│   │   │   ├── analyze/           # Scam analysis endpoint
│   │   │   └── auth/              # Auth endpoints (login/logout)
│   │   └── 📂 (dashboard)/       # Dashboard route group
│   │       ├── layout.tsx         # Dashboard shell (sidebar + header)
│   │       ├── dashboard/         # Main dashboard overview
│   │       ├── report/            # Scam reporting tool
│   │       ├── reports/           # Reports management center
│   │       ├── community/         # Community threat feed
│   │       ├── assistant/         # AI chatbot assistant
│   │       ├── analytics/         # Analytics & visualizations
│   │       ├── threats/           # Threat intelligence feed
│   │       └── settings/          # User/system settings
│   │
│   ├── 📂 components/             # Reusable UI Components
│   │   ├── AnimatedCounter.tsx    # Animated number counters
│   │   ├── AuthModal.tsx          # OTP-based authentication modal
│   │   ├── GlassCard.tsx          # Glassmorphism card component
│   │   ├── ScrollReveal.tsx       # Scroll-triggered animations
│   │   └── ThreeScene.tsx         # 3D Three.js cyber globe
│   │
│   ├── 📂 lib/                    # Core Libraries & Utilities
│   │   ├── ai-engine.ts           # Multi-agent AI orchestration engine
│   │   ├── data.ts                # Static data & platform statistics
│   │   ├── supabase.ts            # Supabase client & auth helpers
│   │   ├── otp-store.ts           # OTP management store
│   │   └── user-store.ts          # User session store
│   │
│   └── middleware.ts              # Route protection middleware
│
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript configuration
├── postcss.config.js              # PostCSS configuration
├── package.json                   # Dependencies & scripts
├── LICENSE                        # MIT License
├── CONTRIBUTING.md                # Contribution guidelines
├── CODE_OF_CONDUCT.md             # Community code of conduct
├── SECURITY.md                    # Security policy
└── README.md                      # This file
```

---

## 🌐 Browser Extension

The Chrome extension provides **real-time browsing protection**:

### Installation (Developer Mode)
1. Open `chrome://extensions/`
2. Enable **Developer Mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `extension/` directory from this project

### Features
- 🔍 Automatic URL scanning on page navigation
- 🚨 Real-time phishing page detection and blocking
- 📊 Popup dashboard with current threat status
- 🔔 Alert notifications for suspicious sites
- 💾 Local threat history storage

---

## 🤖 AI Multi-Agent Pipeline

RakshaNet Shield uses an **agentic AI architecture** with 5 specialized agents orchestrated by a master `AIOrchestrator`:

| # | Agent | Role | Key Capabilities |
|---|-------|------|-------------------|
| 01 | **Text Analysis Agent** | NLP Scrutinizer | Urgency/threat/pressure keyword detection, scam pattern matching across 11 categories, LLM fallback classification |
| 02 | **Entity Extraction Agent** | Data Extraction | Regex-based extraction of URLs, phone numbers, emails, UPI IDs, crypto wallets, bank accounts, amounts, dates |
| 03 | **URL Threat Agent** | Digital Reputation | Suspicious TLD detection, IP-based URL flagging, typosquatting via Levenshtein distance, SSL validation, subdomain analysis |
| 04 | **Risk Scoring Agent** | Risk Fusion | Weighted multi-factor risk aggregation (text 40%, confidence 25%, URL 20%, entities 10%, evidence 5%) |
| 05 | **Report Generation Agent** | FIR Compiler | LLM-powered explainable verdicts, actionable recommendations, court-admissible evidence compilation |

### Supported Scam Types
`phishing` · `investment_fraud` · `job_scam` · `romance_scam` · `qr_scam` · `apk_malware` · `banking_fraud` · `kyc_fraud` · `lottery_scam` · `crypto_scam`

---

## 📸 Screenshots

<details>
<summary><strong>Click to expand screenshots</strong></summary>

> Screenshots will be added after deployment. Run `npm run dev` to preview locally.

| Page | Description |
|------|-------------|
| Landing Page | Immersive 3D hero with live threat ticker |
| Dashboard | Real-time analytics command center |
| Report Scam | Multi-input scam analysis tool |
| AI Assistant | Conversational AI chatbot |
| Community Feed | Crowdsourced threat intelligence |
| Analytics | Interactive charts and trend analysis |
| Browser Extension | Chrome extension popup UI |

</details>

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a pull request.

```bash
# Fork the repo, then:
git checkout -b feature/amazing-feature
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
# Open a Pull Request
```

---

## 🔒 Security

If you discover a security vulnerability, please report it responsibly. See our [Security Policy](SECURITY.md) for details.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) — The React framework for production
- [Supabase](https://supabase.com/) — Open-source Firebase alternative
- [Puter.js](https://puter.com/) — AI capabilities (LLM, OCR, STT)
- [Three.js](https://threejs.org/) — 3D graphics engine
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Lucide](https://lucide.dev/) — Beautiful icon library
- [CyberBriefing](https://cyberbriefing.info/) — Threat intelligence API
- [Indian Cyber Crime Portal](https://cybercrime.gov.in/) — Official reference

---

<div align="center">

**Built with ❤️ for Digital India**

🛡️ *Protecting every citizen from cyber fraud, one scan at a time.*

</div>
