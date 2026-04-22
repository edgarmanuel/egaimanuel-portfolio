# Deferred Items & Known Issues

Last scanned: 2026-04-22

## Incomplete Features

- **Contact form is a stub** (`components/Footer.tsx`) — `handleSubmit` fakes success with a `setTimeout`, discards all data. Needs a real endpoint (API route → email/n8n) or a mailto fallback.
- ~~**N8nEmbed placeholder**~~ — replaced 2026-04-22 with `AgentChatInline`, then replaced again with `IdeaGeneratorDemo` (2026-04-22). `AgentChatInline.tsx` deleted.

## Hardcoded / Fake Data

- `"Live · 47 runs today"` (`components/AutomationBento.tsx` line 97) — static string inside `LiveStatusDot`. Either pull real data or remove the metric.
- `"+1 task completed"` toast (`components/AutomationBento.tsx` line 107) — decorative only, not tied to real events.

## Dead Code

- ~~`components/AgentButton.tsx`~~ — deleted 2026-04-22. Was unused, superseded by button inside `AgentChat.tsx`.
- ~~`loomUrl?` and `n8nEmbed?` interface fields~~ — removed 2026-04-22.

## Minor / Code Quality

- `console.log("[AgentChat] n8n response: ...")` (`components/AgentChat.tsx` line 118) — remove before next production deploy.
- `eslint-disable-next-line react-hooks/exhaustive-deps` (`components/AutomationBento.tsx` line 69) — `prompts` array may be a missing dependency; verify or fix the effect.

## In Progress

- ~~**Automation Idea Generator demo**~~ — shipped 2026-04-22. n8n workflow `MIsppO57biFDdBi1` live. Frontend: `components/IdeaGeneratorDemo.tsx` (col-span-2) + slimmed `AgentChatInline` (col-span-1).

## Planned (Not Yet Started)

- **AutomationBento real project data** — the 6 automation tiles (`AUTOMATIONS` array in `components/AutomationBento.tsx`) are placeholder data. User will supply markdown files for actual client projects; once ready, parse them (same gray-matter pattern as `projects/*.md`) or replace the array directly.

- Voice widget (Vapi) — env vars exist (`NEXT_PUBLIC_VAPI_PUBLIC_KEY`, `NEXT_PUBLIC_VAPI_ASSISTANT_ID`) but widget is not embedded anywhere yet.
