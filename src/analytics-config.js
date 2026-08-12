export const analyticsConfig = {
  provider: 'goatcounter',
  enabled: false,
  siteCode: '',
  sitePath: '/agentic-ai-master-guide/',
  respectDoNotTrack: true,
  showConceptCounts: true,
  showSiteTotal: true,
  showMostRead: true,
  mostReadLimit: 5,
  mostReadPeriod: 'week',
  popularRefreshHours: 6
};

export function analyticsConfigured() {
  return analyticsConfig.enabled && /^[a-z0-9][a-z0-9-]*$/i.test(analyticsConfig.siteCode.trim());
}

export function goatcounterBase() {
  return `https://${analyticsConfig.siteCode.trim()}.goatcounter.com`;
}

export function analyticsPath(hash = '#/home') {
  const base = analyticsConfig.sitePath.endsWith('/') ? analyticsConfig.sitePath : `${analyticsConfig.sitePath}/`;
  return `${base}${hash || '#/home'}`;
}
