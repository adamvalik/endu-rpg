# Endu RPG Product Backlog

This backlog is designed for focused execution: one small task at a time.

## 1) Operating System (How to Work)

### Rules

- WIP limit: exactly 1 task in progress.
- Task size target: 30-120 minutes per task.
- If a task feels bigger than 2 hours, split it before starting.
- Every completed task must produce a visible artifact (PR, file, screen, config, or doc).

### Columns

- Inbox: raw ideas, unrefined.
- Ready: groomed, small, and unblocked.
- In Progress: exactly one task.
- Done: finished with acceptance criteria met.
- Blocked: cannot continue without external input.

### Definition of Ready (DoR)

- Outcome is clear in one sentence.
- Scope is small enough for one focused session.
- Dependencies are known.
- Acceptance criteria are listed.

### Definition of Done (DoD)

- Acceptance criteria checked.
- Code/build/lint relevant to task passes.
- Any docs/config updates included.
- Deployed or merged target is clear (dev/prod).

### Task Template

Copy this for each new task:

```md
- [ ] ID: AREA-XXX
	- Outcome:
	- Scope:
	- Acceptance criteria:
		- [ ]
		- [ ]
	- Dependencies:
	- Estimate: S (<=1h) / M (1-2h)
```

## 2) Prioritization Method

Use this simple scoring:

Priority score = Impact (1-5) + Urgency (1-5) + Risk Reduction (1-5) - Effort (1-5)

If scores tie, choose:

1. Task that unblocks other tasks
2. Task with lowest effort
3. Task closest to release-critical path

## 3) Current Focus Queue (One-by-One)

Pick the first unchecked task in Ready and move it to In Progress.

### In Progress (WIP 1)

- [ ] CORE-001 Externalize balancing constants into shared config
	- Outcome: XP, level, streak, drops, and bonus values are read from config, not hardcoded.
	- Acceptance criteria:
		- [ ] Config file exists and is loaded by game calculation paths.
		- [ ] At least XP rates, elevation bonus, class bonus, and anti-cheat thresholds are configurable.
		- [ ] Existing behavior unchanged with default config values.


### Ready (ordered)

- [ ] CORE-002 Add Strava rate-limit deny coping mechanism
	- Outcome: Sync pipeline gracefully handles API limit responses and retries safely.
	- Acceptance criteria:
		- [ ] Detect and classify rate-limit errors.
		- [ ] Retry/backoff strategy implemented.
		- [ ] User-facing status avoids silent failure.

- [ ] WEB-001 Add manual sync button (dev only)
	- Outcome: Developers can trigger sync from web app; button hidden in production.
	- Acceptance criteria:
		- [ ] Visible only in development environment.
		- [ ] Not rendered in production build.
		- [ ] Option available in settings or a dev-only panel.

- [ ] UX-001 Build onboarding flow for newcomers
	- Outcome: New user can understand value, connect Strava, and reach first meaningful action.
	- Acceptance criteria:
		- [ ] Intro steps define product promise clearly.
		- [ ] Strava connect is integrated in onboarding.
		- [ ] Completion state is persisted.

- [ ] WEB-002 Activity detail page with XP breakdown
	- Outcome: Each activity has a detailed view with clear XP composition.
	- Acceptance criteria:
		- [ ] Shows base XP + elevation + bonuses + final XP.
		- [ ] Includes short RPG flavor text.
		- [ ] Accessible from activity list.

- [ ] ARCH-001 Technical architecture document (v1)
	- Outcome: Clear blueprint for sync, XP engine, streaks, quests, achievements, leaderboard, and drops.
	- Acceptance criteria:
		- [ ] System diagram and data flows documented.
		- [ ] Firestore query patterns listed.
		- [ ] Error handling and retry behavior included.

- [ ] LEGAL-001 Draft Privacy Policy and Terms of Service
	- Outcome: Launch-ready legal drafts prepared for review.
	- Acceptance criteria:
		- [ ] Privacy policy draft complete.
		- [ ] Terms draft complete.
		- [ ] Placement plan in app/web defined.

- [ ] OPS-001 Configure endu domain and environment routing
	- Outcome: Domain is connected to hosting with correct dev/prod behavior.
	- Acceptance criteria:
		- [ ] Domain DNS configured.
		- [ ] Hosting routes verified.
		- [ ] SSL and redirect rules verified.

- [ ] GROWTH-001 Setup mailing service (provider + first flow)
	- Outcome: Basic email pipeline is available for transactional and waitlist use.
	- Acceptance criteria:
		- [ ] Provider selected and configured.
		- [ ] First template created.
		- [ ] One trigger wired (for example onboarding or weekly recap prep).

- [ ] BIZ-001 Outreach package for Strava (v1)
	- Outcome: Ready-to-send partner outreach package exists.
	- Acceptance criteria:
		- [ ] One-page product summary prepared.
		- [ ] Key metrics and roadmap snapshot included.
		- [ ] Contact script drafted.

## 4) Next (After Ready)

### GDD Design Streams

- [ ] GDD-001 Balancing pass spreadsheet and target curves
- [ ] GDD-002 Content design pass (quests, achievements, shop, pets)
- [ ] GDD-003 Visual design pass (icons, badges, class/specialization characters)
- [ ] GDD-004 Page redesign pass (layout refresh, rename Recent Activities to Today Activities decision)

### Product and UX

- [ ] WEB-003 Integrate Rive animations in key celebration moments
- [ ] AUTH-001 Add additional auth methods (after primary auth stability)
- [ ] ADMIN-001 Admin dashboard MVP (health, sync, XP economy metrics)
- [ ] ADMIN-002 Analytics events and product KPI dashboard

### Release Strategy

- [ ] REL-001 Define release strategy v1 (scope, dates, gates)
- [ ] REL-002 Social launch kit (Strava + IG + prototype identity)
- [ ] REL-003 Activity share/export card for growth loops
- [ ] REL-004 Waitlist page and capture flow

## 5) Inbox

Use this section for quick capture before grooming into Ready tasks.

- [ ] Add item...

## 6) Weekly Ritual (30 min)

1. Move all new ideas to Inbox.
2. Split large tasks into S/M slices.
3. Score and reorder Ready.
4. Ensure top 3 Ready tasks are fully unblocked.
5. Start exactly one task.

## 7) Suggested First 7 Execution Steps

1. CORE-001
2. CORE-002
3. WEB-001
4. UX-001
5. WEB-002
6. ARCH-001
7. LEGAL-001
