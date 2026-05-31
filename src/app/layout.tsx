import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RakshaNet Shield — AI-Powered Cyber Fraud Intelligence Platform',
  description: 'Enterprise-grade AI fraud intelligence & community defense platform. Real-time scam detection, evidence automation, and AI-generated cybercrime reports.',
  keywords: 'cyber fraud, scam detection, AI security, phishing protection, fraud intelligence, cybercrime, RakshaNet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#090306" />
      </head>
      <body className="bg-shield-bg text-shield-text-primary antialiased font-sans">
        <div className="grid-bg min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
