import { SignJWT } from 'jose';
import { isDebugMode } from './keyboard';

const YOURLS_API_URL = 'https://rdar.nl/yourls-api.php';
const YOURLS_SIGNATURE = '157448975e';

export const generateTokens = async (groupNames, selectedDashboard, dashboards, setTokens, setCombinedUrls) => {
  if (isDebugMode()) console.log("Starting token generation");

  if (!groupNames || !selectedDashboard) {
    alert("Voer minstens één groepsnaam in en selecteer een dashboard");
    return;
  }

  const dashboard = dashboards.find(d => d.name === selectedDashboard);
  if (!dashboard) {
    alert("Geselecteerd dashboard niet gevonden");
    return;
  }

  const secretKey = new TextEncoder().encode(dashboard.key);
  if (isDebugMode()) console.log("Secret Key:", dashboard.key);

  const groups = groupNames.split(',').map(name => name.trim());
  const generatedTokens = [];
  const generatedUrls = [];
  let clipboardText = ''; // Variable to store the concatenated text

  for (let group of groups) {
    if (group) {
      const payload = {
        dataModelFilter: [
          {
            table: "Groups",
            column: "Name",
            datatype: "text",
            members: [group],
          },
        ],
      };

      const header = { alg: 'HS256', typ: 'JWT' };
      const token = await new SignJWT(payload)
        .setProtectedHeader(header)
        .sign(secretKey);

      if (isDebugMode()) console.log("Token:", token);
      if (isDebugMode()) console.log("Header:", header);
      if (isDebugMode()) console.log("Payload:", JSON.stringify(payload));
      if (isDebugMode()) console.log("Key:", dashboard.key);

      const dashboardUrl = dashboard.url;
      const combinedUrl = `${dashboardUrl}${token}`;

      try {
        const response = await fetch(`${YOURLS_API_URL}?signature=${YOURLS_SIGNATURE}&action=shorturl&format=json&url=${encodeURIComponent(combinedUrl)}`);
        const data = await response.json();
        const shortUrl = data.shorturl;

        generatedTokens.push({ group, token });
        generatedUrls.push({ group, url: shortUrl });

        if (isDebugMode()) console.log(`Short URL for ${group}: ${shortUrl}`);

        // Add each URL and group name to the clipboardText
        clipboardText += `Groep: ${group}\nURL: ${shortUrl}\n\n`;
      } catch (error) {
        console.error(`Error shortening URL for ${group}:`, error);
      }
    }
  }

  setTokens(generatedTokens);
  setCombinedUrls(generatedUrls);

  // Copy the concatenated URLs and names to the clipboard
  navigator.clipboard.writeText(clipboardText).then(() => {
    alert("Links zijn gekopieerd!");
  });
};
