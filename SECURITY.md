# 🔒 Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | ✅ Active support  |

## Reporting a Vulnerability

If you discover a security vulnerability within RakshaNet Shield, please report it responsibly.

### ⚠️ Do NOT

- Open a public GitHub issue for security vulnerabilities
- Share vulnerability details publicly before a fix is released
- Exploit the vulnerability beyond proof-of-concept

### ✅ Do

1. **Email** your findings to **[INSERT SECURITY EMAIL]**
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)
3. **Allow** 48 hours for an initial response
4. **Work with us** to coordinate the disclosure timeline

## Security Measures

RakshaNet Shield implements the following security practices:

- **Environment Variables**: All secrets stored in `.env.local` (never committed)
- **Supabase RLS**: Row-Level Security on database tables
- **Input Sanitization**: AI engine sanitizes all user inputs before LLM processing
- **HTTPS Only**: All external API calls use encrypted connections
- **CSP Headers**: Content Security Policy headers configured in Next.js
- **Middleware Protection**: Route-level authentication guards via Next.js middleware

## Acknowledgements

We appreciate responsible security researchers who help keep our community safe.
Confirmed vulnerabilities will be credited in our security acknowledgements (with permission).

---

**Thank you for helping protect Digital India.** 🛡️
