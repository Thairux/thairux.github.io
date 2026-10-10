---
layout: project
title: "HOSQ"
description: "A real-time hospital queue management system that makes patient flow, staff coordination, and emergency prioritization visible and manageable — with email-only notifications on Supabase edge functions."
order: 2
badge: "Live"
label: "Healthcare workflow"
visual_class: "project-visual-hosq"
technologies:
  - "TypeScript"
  - "React"
  - "Supabase"
  - "Tailwind CSS"
github: "https://github.com/pmuigai-sys/hosq"
demo: "https://pmuigai-sys.github.io/hosq"
forked_from: "https://github.com/pmuigai-sys/hosq"
---

HOSQ is a hospital queue management system built for real-time visibility across the entire patient journey. Patients check themselves in from a self-serve page, staff work role-based dashboards as cases move through triage and service stages, emergency cases jump to the front, and every queue transition is pushed to the patient by email the moment it happens.

## The notification rebuild

The interesting engineering here is the notification layer. HOSQ originally reached patients over SMS through a Supabase edge function that called a bulk SMS provider — but SMS delivery in Kenya needs a registered sender ID and a business account, which is friction a hospital demo can't carry. So the notification path was rebuilt to be **email-only**:

- Patients are now identified by **email** (nullable, unique, format-constrained) instead of a Kenyan phone number, and the phone-enforcement trigger was retired.
- A new `send-email` edge function (Deno + nodemailer) delivers through Gmail SMTP, gated by an admin `email_enabled` setting and validated against an email regex before sending.
- Every attempt — success or failure — is written to an `email_logs` table with a provider message ID, so delivery is auditable rather than fire-and-forget.
- The three notification triggers (patient called, stage change, queue-position change) route through this email path and skip silently when a patient has no email on file, which is why new check-ins always capture one.

## Keeping the demo alive

Supabase pauses free-tier projects after a week of inactivity, and the original keep-alive kept failing — the deployed edge function required a JWT that the scheduled cron couldn't supply, so it returned 401 on every run. The fix was to drop the function call entirely: the GitHub Actions keep-alive now pings the PostgREST read endpoint directly with the anon key, which needs no auth handshake. The scheduled job has run green on a steady cadence ever since.

## Highlights

- Patient self-service check-in with no full signup flow
- Real-time queue position and stage tracking over Supabase realtime
- Role-based staff dashboards across triage and service departments
- Emergency priority flags that immediately move critical cases forward
- Email-only notifications with a full, auditable delivery log
- A keep-alive workflow that actually keeps the live demo awake

## Tech stack

TypeScript and React on the frontend, Supabase for Postgres, auth, realtime, and edge functions (Deno), Tailwind CSS for styling, and GitHub Actions for the Pages deploy and the Supabase keep-alive cron. Roughly 3,200 lines of TypeScript across the app, with all schema changes versioned as SQL migrations.

## Repository lineage

This version is maintained at [pmuigai-sys/hosq](https://github.com/pmuigai-sys/hosq), the upstream fork source, where the email-only rebuild and keep-alive fix both shipped.
