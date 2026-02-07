# Specification

## Summary
**Goal:** Complete an authentication-gated, end-to-end interactive flow across all modules, and make the quiz length configurable by the user.

**Planned changes:**
- Enforce authentication gating so unauthenticated users are redirected to `/login` when accessing any protected module (Dashboard, Resume, Analysis, Domain/Job Role/Eligibility, Learning Plan, Quiz, Interview, Progress).
- Update `/register` to provide a working Internet Identity sign-up path (no username/password UX) and route users through the same post-auth flow (profile setup if needed, then dashboard).
- Add a quiz setup step to ask for the desired number of questions, validate the input, and run/render exactly that many questions with matching progress and results.
- Improve module-to-module continuity with clear CTAs, English empty states, and error handling so missing prerequisite data doesn’t cause dead-ends or runtime errors, and completions update downstream pages (e.g., Progress reflects new quiz attempts).

**User-visible outcome:** Users must sign in/sign up with Internet Identity before using protected modules, can register via an interactive II flow, can start a quiz by selecting the number of questions they want, and can complete the full journey from onboarding through progress tracking without broken states when data is missing.
