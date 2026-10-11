---
layout: project
title: SGM  a Shared Global Memory
description: An open protocol for persistent, interoperable memory and context sharing between AI agents and software tools â specification, schemas, conformance suite, and reference implementation.
order: 1
badge: Open source
label: Protocol & standards
github: "https://github.com/Thairux/sgm"
demo: "https://thairux.github.io/sgm"
---
Every AI tool keeps its own private, session-scoped memory. Switch tools, start a new session, or hand work to another agent, and that context is lost â rebuilt by hand every time. **SGM is the shared contract that fixes it**: a small, transport-independent protocol any conforming implementation can use to exchange memory with any other, regardless of language, storage backend, or host tool.

## Protocol first, implementation second

SGM is organized into four strictly-separated layers â **specification â schemas â conformance â reference implementation**. The specification is authoritative; the reference implementation is executable documentation only. A third party can implement SGM from the public spec alone, without reading any implementation's source. That independence is enforced by an explicit test: *imagine the reference implementation does not exist â does the repo still make sense?*

## What it standardizes

The **interoperability contract**, not implementation technology. SGM defines memory records, retrieval, context assembly, provenance (who/what/when/where on every record), scope isolation, annotations (decisions, rules, status, tasks), cross-tool handoffs, capability discovery, and version negotiation.

It deliberately does **not** mandate a storage engine, language, embedding model, vector database, LLM, or transport. MCP and HTTP are supported *bindings*, never the protocol.

## What shipped

- **14 specification documents** â from overview and terminology through memory, retrieval, scopes, capabilities, versioning, errors, and security
- **5 machine-readable JSON Schemas** (draft 2020-12) for every protocol object
- **A conformance suite** â 44 behavioral tests across core, retrieval, handoff, annotations, and security that let any independent implementation verify it actually implements SGM correctly
- **A reference implementation** â an in-memory store + CLI that passes the core suite (7/7), serving as executable documentation
- **A documentation site** built on the same Jekyll stack as this portfolio

## The engineering idea worth building around

Two principles run through the whole design. First, **provenance is core, not optional** â AI memory is easy to misuse, so every record carries who/what/when/where so an agent can tell a fact from a decision from a stale status. Second, **don't over-standardize**: for every feature, ask *would two independent implementations need to agree on this to interoperate?* If not, it stays in the implementation. SGM defines the smallest strong standard capable of meaningful interoperability.

## Repository

Maintained publicly at [github.com/Thairux/sgm](https://github.com/Thairux/sgm) under AGPL-3.0. The full protocol, schemas, and conformance suite are browsable at [thairux.github.io/sgm](https://thairux.github.io/sgm).
