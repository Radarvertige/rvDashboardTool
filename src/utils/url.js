import { isDebugMode } from './keyboard';

const YOURLS_API_URL = 'https://rdar.nl/yourls-api.php';
const YOURLS_SIGNATURE = '157448975e';

export const shortenUrl = async (finalUrl, customSlug) => {
  try {
    const requestUrl = `${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(finalUrl)}&keyword=${encodeURIComponent(customSlug)}`;

    if (isDebugMode()) {
      console.log(`Request URL: ${requestUrl}`);
    }

    const response = await fetch(requestUrl);
    const data = await response.json();

    if (data && data.shorturl) {
      if (isDebugMode()) {
        console.log(`Shortened URL: ${data.shorturl}`);
      }
      return data.shorturl;
    } else {
      console.error("YOURLS API response did not contain a short URL:", data);
      return finalUrl;  // Return the original final URL if shortening fails
    }
  } catch (error) {
    console.error(`Error shortening URL:`, error);
    return finalUrl;  // Return the original final URL if an error occurs
  }
};

export const generateShortUrl = async (token, dashboard, group) => {
  try {
    const dashboardUrl = dashboard.url;
    const combinedUrl = `${dashboardUrl}${token}`;

    // Construct the custom keyword by combining team, dashboard name, and group, using hyphens
    const teamSlug = dashboard.team.replace(/\s+/g, '-').toLowerCase();
    const dashboardNameSlug = dashboard.name.replace(/\s+/g, '-').toLowerCase();
    const groupSlug = group ? group.replace(/\s+/g, '-').toLowerCase() : '';

    const customSlug = groupSlug 
      ? `${teamSlug}-${dashboardNameSlug}-${groupSlug}`
      : `${teamSlug}-${dashboardNameSlug}`;

    if (isDebugMode()) {
      console.log(`Custom Keyword (Slug): ${customSlug}`);
      console.log(`Combined URL before shortening: ${combinedUrl}`);
    }

    // Shorten the combined URL using the custom slug
    return await shortenUrl(combinedUrl, customSlug);

  } catch (error) {
    console.error(`Error generating short URL:`, error);
    return null;
  }
};
