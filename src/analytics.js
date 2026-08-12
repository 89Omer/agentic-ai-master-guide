import { conceptById } from './data.js';
import { analyticsConfig, analyticsConfigured, analyticsPath, goatcounterBase } from './analytics-config.js';

let lastTrackedPath = '';
let popularPromise = null;
let siteTotalPromise = null;
let sortMode = 'recommended';
let scheduled = false;
const countCache = new Map();

function currentHash() {
  return location.hash || '#/home';
}

function currentConceptId() {
  const match = currentHash().match(/^#\/concept\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function trackingAllowed() {
  if (!analyticsConfigured()) return false;
  if (!analyticsConfig.respectDoNotTrack) return true;
  return navigator.doNotTrack !== '1' && window.doNotTrack !== '1';
}

function titleForRoute() {
  const id = currentConceptId();
  if (id && conceptById[id]) return `${conceptById[id].title} · Agentic AI Master Guide`;
  if (currentHash().startsWith('#/research-lab')) return 'Research Lab · Agentic AI Master Guide';
  if (currentHash().startsWith('#/playground')) return 'Playground · Agentic AI Master Guide';
  return document.title;
}

function runtimePath() {
  return `${location.pathname}${location.search}${currentHash()}`;
}

function loadTracker() {
  if (!trackingAllowed()) return;
  if (window.goatcounter?.count) {
    trackCurrentRoute();
    return;
  }
  if (document.querySelector('[data-aimg-goatcounter]')) return;

  window.goatcounter = {
    ...(window.goatcounter || {}),
    no_onload: true,
    endpoint: `${goatcounterBase()}/count`
  };

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = `${goatcounterBase()}/count`;
  script.dataset.aimgGoatcounter = '1';
  script.addEventListener('load', trackCurrentRoute, { once: true });
  document.head.appendChild(script);
}

function trackCurrentRoute() {
  if (!trackingAllowed() || !window.goatcounter?.count) return;
  const path = runtimePath();
  if (path === lastTrackedPath) return;
  window.goatcounter.count({ path, title: titleForRoute() });
  lastTrackedPath = path;
}

function counterUrl(path, period = '') {
  const key = path === 'TOTAL' ? 'TOTAL' : encodeURIComponent(path);
  const query = period ? `?start=${encodeURIComponent(period)}` : '';
  return `${goatcounterBase()}/counter/${key}.json${query}`;
}

async function fetchCount(path, period = '') {
  if (!analyticsConfigured()) return null;
  const cacheKey = `${path}|${period}`;
  if (countCache.has(cacheKey)) return countCache.get(cacheKey);

  const promise = fetch(counterUrl(path, period), { mode: 'cors', cache: 'no-store' })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      if (!data?.count) return data ? 0 : null;
      const value = Number(String(data.count).replace(/[^0-9]/g, ''));
      return Number.isFinite(value) ? value : 0;
    })
    .catch(() => null);

  countCache.set(cacheKey, promise);
  return promise;
}

function formatCount(value) {
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function isHome() {
  return !location.hash || location.hash === '#/home';
}

async function loadPopularData() {
  if (!analyticsConfigured()) return null;
  if (popularPromise) return popularPromise;
  const hours = Math.max(1, Number(analyticsConfig.popularRefreshHours) || 6);
  const version = Math.floor(Date.now() / (hours * 60 * 60 * 1000));
  popularPromise = fetch(`./public/analytics-popular.json?v=${version}`, { cache: 'force-cache' })
    .then(response => response.ok ? response.json() : null)
    .then(data => data?.enabled ? data : null)
    .catch(() => null);
  return popularPromise;
}

async function enhanceConceptCount() {
  if (!analyticsConfigured() || !analyticsConfig.showConceptCounts) return;
  const id = currentConceptId();
  const meta = document.querySelector('.lesson-meta');
  if (!id || !meta || meta.querySelector('.concept-view-count')) return;

  const path = analyticsPath(currentHash());
  const count = await fetchCount(path);
  if (count === null || currentConceptId() !== id || meta.querySelector('.concept-view-count')) return;

  const badge = document.createElement('span');
  badge.className = 'concept-view-count';
  badge.textContent = `${formatCount(count)} reads`;
  badge.title = `${count.toLocaleString()} recorded reads`;
  meta.appendChild(badge);
}

async function enhanceSiteTotal() {
  if (!analyticsConfigured() || !analyticsConfig.showSiteTotal) return;
  const footer = document.querySelector('.footer > div:first-child');
  if (!footer || footer.querySelector('.site-view-total')) return;
  siteTotalPromise ||= fetchCount('TOTAL');
  const count = await siteTotalPromise;
  if (count === null || footer.querySelector('.site-view-total')) return;
  const total = document.createElement('span');
  total.className = 'site-view-total';
  total.textContent = `${formatCount(count)} total reads`;
  total.title = `${count.toLocaleString()} recorded site reads`;
  footer.appendChild(total);
}

async function enhanceMostRead() {
  if (!analyticsConfigured() || !analyticsConfig.showMostRead || !isHome()) return;
  if (document.querySelector('.analytics-most-read')) return;
  const data = await loadPopularData();
  if (!data?.top?.length || !isHome() || document.querySelector('.analytics-most-read')) return;

  const anchor = document.querySelector('.section-block.bottom-space');
  if (!anchor) return;
  const limit = Math.max(1, Number(analyticsConfig.mostReadLimit) || 5);
  const section = document.createElement('section');
  section.className = 'analytics-most-read page-width';
  section.innerHTML = `
    <div class="analytics-most-read-head">
      <div><span class="eyebrow">MOST READ</span><h2>What people are exploring</h2><p>Popular concepts across the public guide.</p></div>
      <span class="analytics-period">Updated every ${Math.max(1, Number(analyticsConfig.popularRefreshHours) || 6)} hours · ${data.period === 'week' ? 'this week' : 'all time'}</span>
    </div>
    <div class="analytics-most-read-grid">
      ${data.top.slice(0, limit).map((item, index) => `
        <button class="analytics-read-card" data-analytics-concept="${item.id}">
          <span class="analytics-rank">${String(index + 1).padStart(2, '0')}</span>
          <strong>${item.title}</strong>
          <small>${item.short || ''}</small>
          <span class="analytics-count">${formatCount(item.count)} reads</span>
        </button>`).join('')}
    </div>`;
  anchor.insertAdjacentElement('beforebegin', section);
  section.querySelectorAll('[data-analytics-concept]').forEach(button => button.addEventListener('click', () => {
    location.hash = `#/concept/${button.dataset.analyticsConcept}`;
  }));
}

function reorderConcepts(mode, counts = {}) {
  const list = document.querySelector('.concept-list');
  if (!list) return;
  const rows = [...list.querySelectorAll('.concept-row')];
  rows.forEach((row, index) => {
    if (!row.dataset.analyticsOriginal) row.dataset.analyticsOriginal = String(index);
  });

  rows.sort((a, b) => {
    if (mode === 'most-read') {
      const diff = (counts[b.dataset.concept] || 0) - (counts[a.dataset.concept] || 0);
      if (diff) return diff;
    }
    if (mode === 'a-z') {
      const at = a.querySelector('.concept-row-copy strong')?.textContent || '';
      const bt = b.querySelector('.concept-row-copy strong')?.textContent || '';
      return at.localeCompare(bt);
    }
    return Number(a.dataset.analyticsOriginal) - Number(b.dataset.analyticsOriginal);
  });
  rows.forEach(row => list.appendChild(row));
}

async function enhancePopularSort() {
  if (!analyticsConfigured() || !location.hash.startsWith('#/concepts')) return;
  const head = document.querySelector('.concept-list-head');
  if (!head) return;
  const data = await loadPopularData();
  if (!data?.counts || !location.hash.startsWith('#/concepts')) return;

  let wrap = head.querySelector('.analytics-sort-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'analytics-sort-wrap';
    wrap.innerHTML = `<label for="analytics-sort">Sort</label><select id="analytics-sort" data-analytics-sort><option value="recommended">Recommended</option><option value="most-read">Most read</option><option value="a-z">A–Z</option></select>`;
    head.appendChild(wrap);
    const select = wrap.querySelector('[data-analytics-sort]');
    select.value = sortMode;
    select.addEventListener('change', () => {
      sortMode = select.value;
      reorderConcepts(sortMode, data.counts);
    });
  }
  reorderConcepts(sortMode, data.counts);
}

function enhance() {
  scheduled = false;
  loadTracker();
  trackCurrentRoute();
  enhanceConceptCount();
  enhanceSiteTotal();
  enhanceMostRead();
  enhancePopularSort();
}

function scheduleEnhance() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(enhance);
}

const root = document.querySelector('#app');
if (root) new MutationObserver(scheduleEnhance).observe(root, { childList: true, subtree: true });
window.addEventListener('hashchange', () => {
  lastTrackedPath = '';
  scheduleEnhance();
});
queueMicrotask(scheduleEnhance);
