import { mkdir, writeFile } from 'node:fs/promises';
import { concepts } from '../src/data.js';
import { analyticsConfig, analyticsConfigured, analyticsPath, goatcounterBase } from '../src/analytics-config.js';

const output = 'public/analytics-popular.json';
await mkdir('public', { recursive: true });

async function write(data) {
  await writeFile(output, `${JSON.stringify(data, null, 2)}\n`);
}

if (!analyticsConfigured() || !analyticsConfig.showMostRead) {
  await write({
    enabled: false,
    provider: analyticsConfig.provider,
    generatedAt: new Date().toISOString(),
    period: analyticsConfig.mostReadPeriod,
    counts: {},
    top: []
  });
  console.log('Analytics is not configured; wrote an empty Most Read dataset.');
  process.exit(0);
}

const period = analyticsConfig.mostReadPeriod || 'week';

function counterUrl(path) {
  return `${goatcounterBase()}/counter/${encodeURIComponent(path)}.json?start=${encodeURIComponent(period)}`;
}

async function fetchConceptCount(concept) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const path = analyticsPath(`#/concept/${concept.id}`);
    const response = await fetch(counterUrl(path), { signal: controller.signal });
    if (response.status === 404) return { concept, count: 0 };
    if (!response.ok) return { concept, count: null };
    const data = await response.json();
    const count = Number(String(data.count || '0').replace(/[^0-9]/g, ''));
    return { concept, count: Number.isFinite(count) ? count : 0 };
  } catch {
    return { concept, count: null };
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
const concurrency = 8;
for (let index = 0; index < concepts.length; index += concurrency) {
  const batch = concepts.slice(index, index + concurrency);
  results.push(...await Promise.all(batch.map(fetchConceptCount)));
}

const successful = results.filter(item => item.count !== null);
const counts = Object.fromEntries(successful.map(item => [item.concept.id, item.count]));
const top = successful
  .filter(item => item.count > 0)
  .sort((a, b) => b.count - a.count || a.concept.title.localeCompare(b.concept.title))
  .slice(0, Math.max(1, Number(analyticsConfig.mostReadLimit) || 5))
  .map(item => ({
    id: item.concept.id,
    title: item.concept.title,
    short: item.concept.short,
    count: item.count
  }));

await write({
  enabled: successful.length > 0,
  provider: analyticsConfig.provider,
  generatedAt: new Date().toISOString(),
  period,
  conceptsChecked: concepts.length,
  conceptsAvailable: successful.length,
  counts,
  top
});

console.log(`Built Most Read data for ${successful.length}/${concepts.length} concepts.`);
