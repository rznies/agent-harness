## 2024-06-09 - Regex Compilation Optimization
**Learning:** Compiling regex strings to objects outside of the loop/function block improves text substitution performance by avoiding repeated parsing. Specifically, doing this on high-frequency helpers like `cleanHtml` yields decent measurable improvements (from ~1.91s to ~1.37s for 10x 50k blocks of HTML parsing).
**Action:** Lift regexs used in frequent string operations out of function scopes.
