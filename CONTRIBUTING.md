# 🤝 Contributing to RakshaNet Shield

Thank you for your interest in contributing to RakshaNet Shield! Every contribution helps protect more citizens from cyber fraud.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

This project adheres to our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold respectful, inclusive, and constructive interactions.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/fazil-dev-tech/rakshanet-shield.git
   cd rakshanet-shield
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create** a `.env.local` from the template:
   ```bash
   cp .env.example .env.local
   ```
5. **Start** the development server:
   ```bash
   npm run dev
   ```

---

## How to Contribute

### 🐛 Bug Fixes
- Check existing [issues](../../issues) first to avoid duplicates
- Create a branch: `fix/brief-description`
- Write clear commit messages

### ✨ New Features
- Open a feature request issue first to discuss the approach
- Create a branch: `feature/brief-description`
- Include tests if applicable

### 📖 Documentation
- Improve README, code comments, or add JSDoc/TSDoc
- Create a branch: `docs/brief-description`

### 🎨 UI/UX Improvements
- Follow the existing glassmorphism design language
- Maintain the dark theme with pink/rose accent palette
- Ensure responsive design across all breakpoints

---

## Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally

3. Commit with a descriptive message:
   ```bash
   git commit -m "feat: add real-time SMS scanning to extension"
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` — New feature
   - `fix:` — Bug fix
   - `docs:` — Documentation changes
   - `style:` — Code style (formatting, semicolons, etc.)
   - `refactor:` — Code refactoring
   - `test:` — Adding or updating tests
   - `chore:` — Build/tooling changes

4. Push and open a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Pull Request Process

1. Ensure your code builds without errors: `npm run build`
2. Update documentation if needed
3. Fill out the PR template completely
4. Link any related issues
5. Request review from a maintainer
6. Address review feedback promptly

---

## Coding Standards

- **TypeScript** — Use strict typing; avoid `any` where possible
- **Components** — Functional components with hooks
- **Naming** — PascalCase for components, camelCase for functions/variables
- **Styling** — Use Tailwind CSS utilities; follow the existing design tokens
- **Imports** — Use `@/` path aliases for `src/` imports
- **AI Agents** — Follow the existing agent class pattern in `ai-engine.ts`

---

## Reporting Bugs

Use the [Bug Report template](../../issues/new?template=bug_report.md) and include:

- **Description** — Clear, concise summary
- **Steps to Reproduce** — Numbered list
- **Expected Behavior** — What should happen
- **Actual Behavior** — What actually happens
- **Screenshots** — If applicable
- **Environment** — Browser, OS, Node version

---

## Suggesting Features

Use the [Feature Request template](../../issues/new?template=feature_request.md) and include:

- **Problem** — What problem does this solve?
- **Solution** — Your proposed approach
- **Alternatives** — Other solutions you considered
- **Context** — Any additional context

---

## 🙏 Thank You

Your contributions make the internet safer for everyone. Every bug fix, feature, and documentation improvement helps protect citizens from cyber fraud.

**Built with ❤️ for Digital India**
