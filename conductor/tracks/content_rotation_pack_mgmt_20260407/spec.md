# Track: Live Content Rotation and Pack Management

## Overview

Establish a repeatable workflow for rotating sentence and vocabulary content packs so active games can refresh content without code churn.

## Functional Requirements

- Define content-pack metadata format and versioning convention.
- Support selecting active packs per game or cohort.
- Add validation checks for pack completeness and integrity.
- Document weekly rotation process for operators.

## Non-Functional Requirements

- Rotation workflow must be deterministic and auditable.
- Pack loading must not increase game startup failures.

## Acceptance Criteria

- [ ] Pack metadata schema is defined and documented.
- [ ] Rotation mechanism supports enabling/disabling packs safely.
- [ ] Invalid packs are rejected with actionable errors.
- [ ] Operational rotation checklist is added to project docs.

## Out of Scope

- Authoring new curriculum content.
- External CMS integration.

