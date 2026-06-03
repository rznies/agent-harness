# Use a Validated Intelligence Graph Instead of One-Shot Report Generation

Status: accepted

The system will generate business intelligence reports from a validated Intelligence Graph composed of Evidence Items, Findings, Opportunities, Recommendations, Action Items, Evidence-Backed Scores, and Report Sections. Reports are rendered from validated structured objects rather than generated directly by a single LLM prompt.

## Decision

The validated Intelligence Graph is the source of truth. The report is only a human-readable rendering of that graph.

The generation flow is:

```text
EvidenceItem[]
Finding[]
Opportunity[]
Recommendation[]
ActionItem[]
Validation Layer
Report Rendering
```

LLMs may be used for extraction, classification, insight generation, and wording. Deterministic code owns validation, confidence calculation, Evidence Sufficiency Gates, lineage enforcement, score generation, and report rendering.

## Rationale

A one-shot report prompt was intentionally rejected because it cannot reliably enforce evidence traceability, deterministic confidence derivation, Evidence Sufficiency Gates, score validation, or Traceability Lineage. The graph-based approach makes unsupported claims structurally impossible, produces auditable and testable outputs, and prevents hallucinated scores, insights, recommendations, and action items.

## Evidence Model

Evidence Items are the canonical data model for source observations. Every score, finding, opportunity, recommendation, action item, competitor claim, sentiment conclusion, and report section claim must reference Evidence Item IDs.

## Validation Principles

Validation fails closed. Invalid objects are removed from the graph rather than silently repaired, inferred, or backfilled. A report can be incomplete and still valid, but it cannot be valid if its remaining Traceability Lineage cannot be trusted.

## Confidence and Gates

Confidence is derived from evidence quality and quantity rather than assigned freely by the model. Evidence Sufficiency Gates determine whether each report section and Evidence-Backed Score can make supported conclusions or must be marked insufficient evidence.

## Implementation Sequence

The graph foundation comes before source collection improvements. Domain models, deterministic validation, Evidence Sufficiency Gates, and deterministic rendering are implemented before broader extraction and collection integrations. This prevents better source collection from feeding unsupported downstream claims.

## Module Boundary

The intelligence domain layer owns truth and trust. Agents produce candidate intelligence through tools, search, scraping, extraction, and classification, but the domain layer owns validation, confidence, gates, scoring, identity checks, competitor checks, and rendering. No single prompt owns business logic.

## Non-Goals

- LLM-written reports without validation
- Confidence assigned purely by model judgment
- Scores generated without Evidence Items
- Recommendations that cannot be traced back to Evidence Items
