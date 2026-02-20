# ENGINEERING_RULES.md — General Version

> These rules MUST be followed before starting **any engineering work**
> (software, data, infrastructure, automation, or hybrid projects).
> Load this document at the start of every work session.

---

## CRITICAL: The 3‑Question Gate

**Before touching any code, config, schema, or system, answer these THREE questions:**

```
┌─────────────────────────────────────────────────────────────────┐
│ QUESTION 1: Is this a SYMPTOM or ROOT CAUSE?                     │
│                                                                 │
│   Error message, UI glitch, failed job → SYMPTOM                │
│   Design flaw, assumption, coupling   → ROOT CAUSE             │
│                                                                 │
│   → Never patch symptoms. Always find the root cause first.    │
├─────────────────────────────────────────────────────────────────┤
│ QUESTION 2: Has this happened before?                           │
│                                                                 │
│   Check history: commits, tickets, docs, incidents              │
│                                                                 │
│   → If 2+ similar fixes exist → STOP. Systemic problem.         │
├─────────────────────────────────────────────────────────────────┤
│ QUESTION 3: What's the blast radius?                             │
│                                                                 │
│   Single component        → Local fix                           │
│   Multiple components     → Architectural review               │
│   Core system / platform  → FULL PLAN + APPROVAL                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## RULE 1: Root Cause Analysis (5‑Why Method)

For **every issue**, ask *Why?* five times.

```markdown
## 5‑Why Analysis for: [Issue Name]

1. Why? →
2. Why? →
3. Why? →
4. Why? →
5. Why? →

Root Cause:
Proposed Fix:
Preventive Measure:
```

**If the fix does not address the root cause, it is incomplete.**

---

## RULE 2: Change Classification Matrix

Classify the work **before implementation**:

| Type | Trigger | Approach | Approval |
|-----|-------|--------|---------|
| **Hotfix** | Production broken now | Minimal, reversible | None |
| **Patch** | Isolated defect | Fix + tests | Self |
| **Enhancement** | New capability | Design first | Stakeholder |
| **Refactor** | Structural improvement | Tests mandatory | Stakeholder |
| **Infrastructure / Platform** | Core system change | Plan + staged rollout | **Required** |

**Infrastructure includes:**
- Databases & schemas
- CI/CD pipelines
- Authentication & security
- Messaging / queues
- Shared libraries & SDKs
- Cloud & networking

---

## RULE 3: Consistency of Execution Model

**Never mix incompatible models in the same flow.**

Examples:
- Async vs Sync
- Batch vs Real‑time
- Manual vs Automated
- Mutable vs Immutable data paths

```
CHECK:
Is the system event‑driven, async, batch, or sync?
→ Every dependency must align with that model.
```

---

## RULE 4: Recurrence Detector

Before fixing, **search for patterns**:

```
- Past commits or change logs
- Incident reports
- TODO / FIXME notes
- Similar code, scripts, or configs
```

**Decision Rule:**
```
0–1 occurrence → Fix normally
2 occurrences  → Warning: pattern forming
3+ occurrences → STOP. Redesign required.
```

---

## RULE 5: Pre‑Work Checklist

Complete **before implementation**:

```
□ Root cause identified
□ Similar issues reviewed
□ Change type classified
□ Impacted components listed
□ Risks identified
□ Rollback or fallback considered
```

For large/system changes:
```
□ Written plan created
□ Approval received
□ Rollout strategy defined
```

---

## RULE 6: Post‑Work Checklist

Complete **after implementation**:

```
□ Works in normal conditions
□ Handles edge cases & failures
□ No regressions introduced
□ Logs / metrics updated
□ Temporary debug code removed
□ Documentation updated
```

---

## RULE 7: Testing Scenarios (Generic)

Always consider:

| Scenario | Example |
|-------|--------|
| Happy path | Expected input & load |
| Edge input | Empty, null, malformed |
| Scale | Large volume / stress |
| Failure | Timeouts, partial outages |
| Recovery | Restart, retry, rollback |
| Security | Invalid access, injection |

---

## RULE 8: Technical Debt Registry

Maintain a **living list**:

| Debt Item | Status | Priority | Notes |
|---------|-------|---------|------|
| Example: Tight coupling | Pending | High | Needs redesign |

**Rules:**
1. Review debt before fixing issues
2. If a fix touches known debt → address the debt
3. Update this table continuously

---

## RULE 9: Engineering Quality Standards

### Never Do
```
❌ Hardcode environment‑specific values
❌ Ignore failures or warnings
❌ Assume inputs are valid
❌ Skip tests “just for now”
❌ Depend on undocumented behavior
```

### Always Do
```
✅ Validate inputs
✅ Add observability (logs, metrics)
✅ Make failures explicit
✅ Prefer clarity over cleverness
✅ Design for rollback and recovery
```

---

## RULE 10: The “Pause & Review” Rule

STOP and seek approval if the change:

```
├── Affects multiple teams
├── Alters core data or contracts
├── Changes security boundaries
├── Is difficult to reverse
├── Has failed before
└── Feels risky or unclear
```

---

## Change Request Template

```markdown
## Change Request: [Title]

### Problem
What is broken or missing?

### Root Cause
(From 5‑Why analysis)

### Proposed Solution
What will change and why?

### Impact
Systems, users, data affected

### Risks
What could go wrong?

### Rollback Plan
How to undo safely?

### Testing Plan
How success is verified?
```

---

## Quick Reference

```
BEFORE WORK
• Root cause identified?
• Seen before?
• Blast radius known?

DURING WORK
• Model consistency
• Small, reversible steps

AFTER WORK
• Tested
• Observable
• Documented
```

---

**If you cannot explain the change clearly, you are not ready to implement it.**
