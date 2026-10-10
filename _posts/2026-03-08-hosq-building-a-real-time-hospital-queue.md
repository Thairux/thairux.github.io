---
layout: post
title: "HOSQ: Building a Real-Time Hospital Queue"
date: 2026-03-08
author: "Thairux"
permalink: /hosq-building-a-real-time-hospital-queue/
---

HOSQ is one of the clearest examples of the kind of software I enjoy building: practical, operationally useful, and designed around real people moving through a real system.

## What HOSQ is

HOSQ is a hospital queue management system that helps patients, staff, and administrators stay aligned across the full patient journey. It supports self-service check-in, role-based dashboards, real-time queue updates, emergency priority handling, and email notifications pushed to patients at every queue transition.

## Why it matters

Queue systems are easy to underestimate until they become the thing slowing everything else down. In environments like hospitals, visibility and prioritization matter. A queue is not just a list of waiting people. It is a workflow with urgency, handoffs, and operational pressure.

## What stood out while working on it

- The patient flow had to stay simple and understandable
- Staff actions needed to match real roles and responsibilities
- Emergency flags had to change queue behavior immediately
- Real-time updates were essential so the system never felt stale

## Stack snapshot

The project uses TypeScript on the frontend, Supabase for backend capabilities and real-time data, and a structure built around practical queue movement rather than generic admin tooling.

## Repository and live links

- Live site: [pmuigai-sys.github.io/hosq](https://pmuigai-sys.github.io/hosq)
- Repository: [pmuigai-sys/hosq](https://github.com/pmuigai-sys/hosq)
- Original fork source: [pmuigai-sys/hosq](https://github.com/pmuigai-sys/hosq)

## Why I wanted it in the portfolio

HOSQ belongs here because it reflects the kind of work I want more of: software that is useful, structured, and grounded in a real operational need instead of existing only as a demo.
