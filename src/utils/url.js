const YOURLS_API_URL = 'https://rdar.nl/yourls-api.php';
const YOURLS_SIGNATURE = '157448975e';

export const getExistingUrl = async (keyword) => {
  try {
    const requestUrl = `${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=expand&format=json&shorturl=${encodeURIComponent(keyword)}`;

    const response = await fetch(requestUrl);
    const data = await response.json();

    if (data && data.longurl) {
      return data.shorturl;
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

    // Check if the short URL already exists
    const existingUrl = await getExistingUrl(keyword);
    if (existingUrl) {
      console.log(`Short URL already exists: ${existingUrl}`);
      return existingUrl;
    }

    const requestUrl = `${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(finalUrl)}&keyword=${encodeURIComponent(keyword)}`;

    const response = await fetch(requestUrl);
    const data = await response.json();

    if (data && data.status === "fail" && data.code === "error:keyword") {
      console.warn(`Keyword conflict detected: ${data.message}`);
      // If a keyword conflict occurs, return the existing URL
      return await getExistingUrl(keyword);
    }

    if (data && data.shorturl) {
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

export const generateShortUrl = async (token, dashboard, groupName) => {
  try {
    const combinedUrl = `${dashboard.url}${token}`;
    const teamName = dashboard.team.replace(/\s+/g, '-').toLowerCase(); // Remove spaces and convert to lowercase
    const keyword = `${teamName}-${groupName.replace(/\s+/g, '-').toLowerCase()}`; // Combine team and group names

    // Shorten the combined URL using the keyword
    return await shortenUrl(combinedUrl, keyword);

  } catch (error) {
    console.error(`Error generating short URL:`, error);
    return null;
  }
};
