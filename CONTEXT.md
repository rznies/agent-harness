# Business Intelligence Reports

This context defines the language for evidence-first business intelligence reports for small business owners.

## Language

**Evidence Item**:
A sourced observation collected during research that can support a report claim.
_Avoid_: datapoint, proof, citation

**Direct Observation**:
An Evidence Item based on raw content retrieved from the original source being analyzed.
_Avoid_: summary, inference, search result

**Report Claim**:
Any statement in a report that asserts a fact, judgment, score, insight, competitor position, sentiment finding, revenue opportunity, or recommendation.
_Avoid_: finding, assertion

**Finding**:
A Report Claim derived directly from one or more Evidence Items.
_Avoid_: insight, observation

**Opportunity**:
A business improvement possibility derived from one or more Findings.
_Avoid_: growth idea, initiative

**Recommendation**:
A specific owner-facing action proposed because of one or more Opportunities.
_Avoid_: suggestion, advice

**Action Plan**:
A sequenced set of recommended actions for the business owner.
_Avoid_: roadmap, checklist

**Auditable Report**:
A report whose structured payload exposes the Evidence Items behind its claims.
_Avoid_: generated report, summary

**Traceability Lineage**:
The parent-child chain that connects an Action Plan item back through Recommendations, Opportunities, Findings, and Evidence Items.
_Avoid_: provenance, audit trail

**Intelligence Graph**:
The validated evidence-derived structure that connects Evidence Items, Findings, Opportunities, Recommendations, Action Plan items, scores, and report sections.
_Avoid_: report draft, prompt output

**Validation Issue**:
A structured warning or error produced when part of an Intelligence Graph fails validation.
_Avoid_: validation error, debug note

**Valid Report**:
An Auditable Report whose emitted Intelligence Graph has trustworthy Traceability Lineage.
_Avoid_: complete report, passed report

**Identity Resolution**:
The step that determines which real-world business the report request refers to.
_Avoid_: business lookup, matching

**Identity Confidence**:
A High, Medium, or Low derived property describing how strongly evidence identifies the requested business.
_Avoid_: match score, certainty

**Business Category Classification**:
An evidence-backed determination of what kind of business the target business is.
_Avoid_: industry guess, business type

**Business Category**:
The kind of business identified by Business Category Classification.
_Avoid_: niche, vertical

**Benchmark Finding**:
A Report Claim comparing the business against verified competitors, industry evidence, or historical snapshots.
_Avoid_: benchmark, best practice, market norm

**Identity-Sensitive Section**:
A report section whose conclusions depend on correctly identifying the target business.
_Avoid_: dependent section, risky section

**Competitor Profile**:
An evidence-backed representation of a user-supplied or discovered competitor.
_Avoid_: competitor, rival

**Comparison Target**:
A Competitor Profile that is sufficiently identified and evidenced to support competitive claims.
_Avoid_: competitor option, comparison candidate

**Competitor Relevance**:
An evidence-backed determination of whether a Competitor Profile actually competes with the target business.
_Avoid_: competitor match, similarity

**Primary Source**:
An original source controlled by or directly representing the business, platform, competitor, or customer content being analyzed.
_Avoid_: first-tier source, trusted source

**Supporting Source**:
A secondary source used for discovery or confirmation but not for unsupported competitive or sentiment claims.
_Avoid_: search evidence, weak source

**Raw Review Text**:
Customer-authored review content collected from a review platform or Google Business Profile.
_Avoid_: rating, review count, review summary

**Review Velocity**:
A time-based measure of review growth or review acquisition trend.
_Avoid_: review count, review volume

**Broken Lineage**:
A Traceability Lineage that references missing Evidence Items or missing parent objects.
_Avoid_: incomplete relationship, bad link

**Confidence Level**:
A High, Medium, or Low derived property describing how strongly the available evidence supports a Report Claim.
_Avoid_: certainty, probability

**Evidence-Backed Score**:
A scored or insufficient-evidence category whose value, rationale, confidence, and traceability are supported by Evidence Items.
_Avoid_: score, grade

**Score Component**:
An evidence-backed part of a formula-based Evidence-Backed Score.
_Avoid_: scoring factor, subscore

**Score Rubric**:
A deterministic set of Score Components and evidence requirements used to calculate an Evidence-Backed Score.
_Avoid_: scoring prompt, scoring guide

**Category Score Rubric**:
A category-specific override to a Score Rubric that applies only when the business category is strongly evidenced.
_Avoid_: custom score, industry score

**Score Evidence Gate**:
A score-specific threshold that determines whether available Evidence Items can support an Evidence-Backed Score.
_Avoid_: score validation, score requirement

**Unknown Performance**:
A score category state where performance cannot be judged because available Evidence Items are insufficient.
_Avoid_: weak performance, poor score

**Evidence Sufficiency Gate**:
A section-level threshold that determines whether available Evidence Items are strong enough to support conclusions.
_Avoid_: validation check, completeness check

**Insufficient Evidence**:
A report section status used when available Evidence Items do not meet the section's Evidence Sufficiency Gate.
_Avoid_: no data, skipped section

**Section Status**:
The complete or insufficient-evidence state of a report section.
_Avoid_: render mode, section type

**Customer Sentiment Intelligence**:
A report section about customer praise, complaints, desires, staff mentions, and sentiment patterns.
_Avoid_: review summary, sentiment analysis

## Relationships

- Every **Report Claim** must be traceable to one or more **Evidence Items**.
- A **Direct Observation** is stronger evidence than a secondary-source Evidence Item.
- **Evidence Items** produce **Findings**.
- **Findings** produce **Opportunities**.
- **Opportunities** produce **Recommendations**.
- **Recommendations** produce an **Action Plan**.
- **Traceability Lineage** must be preserved from every **Action Plan** item back to its **Evidence Items**.
- An **Auditable Report** exposes its **Evidence Items** as first-class output.
- An **Auditable Report** is rendered from an **Intelligence Graph**.
- **Broken Lineage** invalidates the affected part of an **Intelligence Graph**.
- A **Validation Issue** records rejected or questionable parts of an **Intelligence Graph** for auditing.
- A **Valid Report** may still contain incomplete sections or rejected objects.
- **Identity Resolution** happens before evidence collection for a report request.
- **Identity Resolution** is supported by **Evidence Items**.
- **Business Category Classification** happens after **Identity Resolution**.
- A **Business Category** is optional for a Valid Report.
- A **Benchmark Finding** requires Evidence Items for the benchmark being used.
- A **Score Rubric** does not create evidence for a **Benchmark Finding**.
- Low **Identity Confidence** makes **Identity-Sensitive Sections** insufficient evidence.
- A **Competitor Profile** becomes a **Comparison Target** only when it is sufficiently identified and evidenced.
- **Competitor Relevance** is distinct from **Identity Resolution**.
- A **Competitor Profile** must be both sufficiently identified and relevant before becoming a **Comparison Target**.
- Competitive claims require Evidence Items for both the target business and the **Comparison Target**.
- Aggregate ratings and review counts are not **Raw Review Text**.
- **Customer Sentiment Intelligence** requires **Raw Review Text**.
- **Review Velocity** requires dated review evidence, historical review snapshots, or multiple observations across time.
- A **Confidence Level** belongs to exactly one **Report Claim**.
- Weak, sparse, indirect, or single-source **Evidence Items** require a lower **Confidence Level**.
- Cross-source support and **Direct Observation** increase **Confidence Level**.
- An **Evidence-Backed Score** is either scored from Evidence Items or marked as **Unknown Performance**.
- A scored **Evidence-Backed Score** is calculated from **Score Components**.
- A **Score Rubric** determines how **Score Components** contribute to an **Evidence-Backed Score**.
- A **Category Score Rubric** applies only when category evidence is strong.
- An **Evidence-Backed Score** has exactly one **Score Evidence Gate**.
- **Unknown Performance** must not reduce an **Evidence-Backed Score**.
- Each report section has exactly one **Evidence Sufficiency Gate**.
- A report section has exactly one **Section Status**.
- A report section that does not pass its **Evidence Sufficiency Gate** has an insufficient-evidence **Section Status**.
- **Customer Sentiment Intelligence** requires stronger evidence than other report sections before making frequency or pattern claims.

## Example dialogue

> **Dev:** "Can the report say customers frequently complain about wait times?"
> **Domain expert:** "Only if that **Report Claim** is supported by **Evidence Items** that contain enough review observations to justify the frequency."
> **Dev:** "What if we only found an aggregate rating?"
> **Domain expert:** "Then the sentiment section is **Insufficient Evidence** and explains what was checked, what was found, what is missing, and why no conclusion can be made."
> **Dev:** "Can an **Action Plan** item exist because it sounds useful?"
> **Domain expert:** "No — each **Action Plan** item comes from a **Recommendation**, which comes from an **Opportunity**, which comes from **Findings**, which come from **Evidence Items**."

## Flagged ambiguities

- "Recommendation", "score", "insight", "competitor claim", "sentiment finding", and "opportunity" are all forms of **Report Claim** when they assert something about the business.
