# ArenaAI — The Ultimate Operations Intelligence Platform

ArenaAI is a **FIFA-grade Operations Intelligence Platform** designed specifically for high-stakes tournament environments (e.g. World Cup 2026). It moves beyond basic dashboards into **AI-driven predictive analytics** for complete stadium operational awareness.

Built for **PromptWars Virtual Challenge 4 (Smart Stadiums)**, this platform prioritizes:
1. **Problem Alignment** — Covering 10+ distinct operational domains.
2. **AI Integration** — Using Gemini for reasoning, prediction, and risk forecasting in *every* module.
3. **Enterprise Architecture** — Role-based access, error boundaries, rate limiting, and severe strict security (CSP).

## 🚀 Key Features

- **Role-Based Access Control (RBAC)**: Switch between 8 roles (CEO, Ops Manager, Security Chief, Medical Director, etc.) to access context-specific dashboards.
- **10+ AI-Powered Modules**:
  - **Executive Command**: High-level KPI and revenue tracking with AI strategic briefings.
  - **Risk Forecasting**: Composite multi-vector risk models combining weather, security, and crowd data.
  - **Crowd Intelligence**: Density maps, flow rate predictions, and AI-recommended gate redirections.
  - **Security Command**: CCTV simulation, threat level monitoring, and anomaly detection.
  - **Medical Dispatch**: Accessibility metrics, incident probability heatmaps, and response optimization.
  - **Transport & Parking**: Lot fill rates, public transit integration, and AI traffic rerouting.
  - **Food & Vendor Ops**: Real-time revenue tracking, queue wait predictions, and halftime surge forecasting.
  - **Maintenance**: Restroom capacity tracking and AI-driven cleaning crew dispatch.
  - **Weather Impact**: Rain probability, temperature tracking, and AI-recommended mitigations.
  - **Volunteer Management**: Shift scheduling and AI-recommended dynamic reassignments.
- **Sophia AI Assistant**: A conversational Gemini-powered AI that provides real-time stadium insights via chat.
- **Digital Twin**: 3D interactive stadium map.

## 🧠 Technology Usage (Gemini 2.0 Flash)

Every module incorporates our custom `useAIPrediction` hook, which:
1. Synthesizes a real-time `stadiumData` telemetry object.
2. Combines it with a domain-specific system prompt (e.g. `medical`, `security`).
3. Queries Gemini to generate a structured JSON response containing:
   - Prediction Summary
   - Confidence Score (0-100)
   - Risk Severity
   - AI Reasoning Chain
   - Recommended Actions

## 🛡️ Enterprise Grade

- **Code Quality**: Custom hooks (`useStadiumData`, `useRoleAccess`, `useAIPrediction`), strict linting, memoized components, and React Error Boundaries.
- **Security**: Hardened Content-Security-Policy (CSP) without `unsafe-eval`, sanitized DOM insertions, API rate limiting, and robust input validation.
- **Efficiency**: Lazy-loaded modules, optimized Vite chunking, efficient CSS-grid heatmaps (instead of heavy canvas where possible), and `useMemo`/`useCallback` optimizations.
- **Accessibility**: 100% ARIA-compliant role/tablist navigation, screen-reader friendly live prediction updates (`aria-live="polite"`), keyboard navigability, and WCAG-compliant contrasts.
- **Testing**: Comprehensive Vitest suite covering hooks, utilities, security validation, and component integration.

## 🛠️ Run Locally

1. Clone repository
2. Run `npm install`
3. Create `.env` file with `VITE_GEMINI_API_KEY=your_key`
4. Run `npm run dev`

```bash
npm run test      # Run full test suite
npm run build     # Build for production
```
