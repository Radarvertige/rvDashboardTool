import { isDebugMode } from './keyboard';

const YOURLS_API_URL = 'https://rdar.nl/yourls-api.php';
const YOURLS_SIGNATURE = '157448975e';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';  // CORS proxy URL

export const getExistingUrl = async (keyword) => {
  try {
    const requestUrl = `${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=expand&format=json&shorturl=${encodeURIComponent(keyword)}`;

    if (isDebugMode()) {
      console.log(`Request URL to fetch existing URL: ${CORS_PROXY + requestUrl}`);
    }

    const response = await fetch(CORS_PROXY + requestUrl);
    const data = await response.json();

    if (data && data.longurl) {
      if (isDebugMode()) {
        console.log(`Existing short URL found for keyword "${keyword}": ${data.shorturl} -> ${data.longurl}`);
      }
      return data.longurl;
    } else {
      console.error("YOURLS API response did not contain a long URL:", data);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching existing URL:`, error);
    return null;
  }
};

export const shortenUrl = async (finalUrl, keyword) => {
  try {
    console.log(`Final URL before shortening: ${finalUrl}`);
    console.log(`Keyword (Slug) before shortening: ${keyword}`);

    const requestUrl = `${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(finalUrl)}&keyword=${encodeURIComponent(keyword)}`;

    if (isDebugMode()) {
      console.log(`Request URL: ${CORS_PROXY + requestUrl}`);
    }

    const response = await fetch(CORS_PROXY + requestUrl);
    const data = await response.json();

    if (data && data.status === "fail" && data.code === "error:keyword") {
      console.warn(`Keyword conflict detected: ${data.message}`);
      // Keyword conflict - fetch the existing URL
      const existingUrl = await getExistingUrl(keyword);
      return existingUrl || finalUrl;
    }

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

export const generateShortUrl = async (token, dashboard, keyword) => {
  try {
    const combinedUrl = `${dashboard.url}${token}`;

    if (isDebugMode()) {
      console.log(`Keyword (Slug): ${keyword}`);
      console.log(`Combined URL before shortening: ${combinedUrl}`);
    }

    // Shorten the combined URL using the keyword
    return await shortenUrl(combinedUrl, keyword);

  } catch (error) {
    console.error(`Error generating short URL:`, error);
    return null;
  }
};
