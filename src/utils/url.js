import { isDebugMode } from './keyboard';

const YOURLS_API_URL = 'https://rdar.nl/yourls-api.php';
const YOURLS_SIGNATURE = '157448975e';

export const generateShortUrl = async (token, dashboard, group) => {
  const dashboardUrl = dashboard.url;
  const combinedUrl = `${dashboardUrl}${token}`;

  try {
    const response = await fetch(`${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(combinedUrl)}`);
    const data = await response.json();
    const shortUrl = data.shorturl;

    // Replace spaces with hyphens in team, dashboard name, and group
    const teamSlug = dashboard.team.replace(/\s+/g, '-');
    const dashboardNameSlug = dashboard.name.replace(/\s+/g, '-');
    const groupSlug = group.replace(/\s+/g, '-');

    // Create the final URL in the format https://rdar.nl/team/dashboardName/group
    const finalUrl = `https://rdar.nl/${encodeURIComponent(teamSlug)}/${encodeURIComponent(dashboardNameSlug)}/${encodeURIComponent(groupSlug)}`;

    if (isDebugMode()) {
      console.log(`Shortened URL: ${shortUrl}`);
      console.log(`Final URL: ${finalUrl}`);
    }

    return finalUrl;
  } catch (error) {
    console.error(`Error shortening URL for ${group}:`, error);
    return null;
  }
};
