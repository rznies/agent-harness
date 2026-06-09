import { performance } from 'node:perf_hooks';

const SCRIPT_STYLE_REGEX = /<(script|style)[^>]*>[\s\S]*?<\/\1>/gi;
const HTML_TAGS_REGEX = /<[^>]+>/g;
const WHITESPACE_REGEX = /\s+/g;

function cleanHtmlBefore(html) {
  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanHtmlAfter(html) {
  return html
    .replace(SCRIPT_STYLE_REGEX, '')
    .replace(HTML_TAGS_REGEX, ' ')
    .replace(WHITESPACE_REGEX, ' ')
    .trim();
}

const sample = `<html><head><style>.x{color:red;}</style><script>console.log("x")</script></head><body><h1>Title</h1><p>Some content with <b>tags</b>.</p></body></html>`;
const payload = Array.from({ length: 50_000 }, () => sample).join('\n');

function benchmark(label, fn) {
  const start = performance.now();
  for (let i = 0; i < 10; i += 1) fn(payload);
  const end = performance.now();
  console.log(`${label}: ${(end - start).toFixed(2)}ms`);
}

benchmark('Before (regex literals in function)', cleanHtmlBefore);
benchmark('After (reused RegExp objects)', cleanHtmlAfter);
