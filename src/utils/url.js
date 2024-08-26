import { isDebugMode } from './keyboard';

const YOURLS_API_URL = 'https://rdar.nl/yourls-api.php';
const YOURLS_SIGNATURE = '157448975e';

export const shortenUrl = async (finalUrl, groupSlug) => {
  try {
    const requestUrl = `${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(finalUrl)}&keyword=${encodeURIComponent(groupSlug)}`;

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

    // Construct the keyword slug by only using the group name
    const groupSlug = group ? group.replace(/\s+/g, '-').toLowerCase() : '';

    if (isDebugMode()) {
      console.log(`Group Slug (Keyword): ${groupSlug}`);
      console.log(`Combined URL before shortening: ${combinedUrl}`);
    }

    // Shorten the combined URL using the group slug
    return await shortenUrl(combinedUrl, groupSlug);

  } catch (error) {
    console.error(`Error generating short URL:`, error);
    return null;
  }
};
