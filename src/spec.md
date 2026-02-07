# Specification

## Summary
**Goal:** Make user-facing generated copy harsher and more accountability-focused toward the stalker (women-centered, legal framing) while staying non-violent, non-harassing, and police-appropriate.

**Planned changes:**
- Update `frontend/src/utils/messageGenerator.ts` templates for tones `firm`, `severe`, and `very harsh` to use stronger boundary language and clearer legal-accountability framing without threats, violence, or encouraging harassment.
- Expand the fixed post-login splash message pool in `frontend/src/utils/postLoginSplashMessages.ts` with additional harsher accountability-focused lines while preserving the existing required exact messages verbatim.
- Revise `frontend/src/utils/generateEvidenceSummary.ts` “urgent” and “urgent-feminine” copy to remove labeling a person as a “threat,” keeping urgency and safety emphasis with police-appropriate wording and the same deterministic formatting/structure.

**User-visible outcome:** Users see more forceful, accountability-focused wording in the Message Generator (for the specified tones), a harsher post-login splash message set, and urgent evidence summaries that remain police-appropriate without inflammatory “threat” labeling.
