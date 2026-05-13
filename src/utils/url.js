import { sanitizeForKeyword } from './sanitization';

const YOURLS_API_URL = 'https://rdar.nl/yourls-api.php';
const YOURLS_SIGNATURE = process.env.REACT_APP_YOURLS_SIGNATURE || '157448975e';

export const getExistingUrl = async (keyword) => {
  try {
    const requestUrl = `${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=expand&format=json&shorturl=${encodeURIComponent(keyword)}`;

    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`YOURLS expand request failed (${response.status})`);
    }

    const data = await response.json();

    if (data && data.longurl) {
      return data.shorturl;
    }

    return null;
  } catch (error) {
    return null;
  }
};

export const shortenUrl = async (finalUrl, keyword) => {
  try {
    const existingUrl = await getExistingUrl(keyword);

    if (existingUrl) {
      return { url: existingUrl, isExisting: true };
    }

    const requestUrl = `${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(finalUrl)}&keyword=${encodeURIComponent(keyword)}`;

    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`YOURLS shorturl request failed (${response.status})`);
    }

    const data = await response.json();

    if (data && data.status === 'fail' && data.code === 'error:keyword') {
      const existingUrl = await getExistingUrl(keyword);
      const urlToReturn = existingUrl || `https://rdar.nl/${keyword}`;
      return { url: urlToReturn, isExisting: true };
    }

    if (data && data.shorturl) {
      return { url: data.shorturl, isExisting: false };
    }

    return { url: finalUrl, isExisting: false, error: 'Inkorten van de URL is mislukt.' };
  } catch (error) {
    return { url: finalUrl, isExisting: false, error: 'Inkorten van de URL is mislukt.' };
  }
};

export const generateShortUrl = async (token, dashboard, keyword) => {
  try {
    const combinedUrl = `${dashboard.url}${token}`;
    const sanitizedKeyword = sanitizeForKeyword(keyword);

    return await shortenUrl(combinedUrl, sanitizedKeyword);
  } catch (error) {
    return { url: `${dashboard.url}${token}`, isExisting: false, error: 'Genereren van de korte URL is mislukt.' };
  }
};
