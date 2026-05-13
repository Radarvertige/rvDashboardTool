const byDashboardName = (left, right) => left.name.localeCompare(right.name);

export const normalizeTeamSlug = (value = '') => value
  .toString()
  .trim()
  .replace(/\s+/g, '-')
  .toUpperCase();

export const hasTeam = (dashboard) => Boolean(dashboard?.team?.trim());

export const filterDashboardsByTeam = (dashboards = [], team) => {
  const availableDashboards = dashboards.filter(hasTeam);

  if (!team) {
    return [...availableDashboards].sort(byDashboardName);
  }

  const normalizedTeam = normalizeTeamSlug(team);

  return availableDashboards
    .filter((dashboard) => normalizeTeamSlug(dashboard.team) === normalizedTeam)
    .sort(byDashboardName);
};