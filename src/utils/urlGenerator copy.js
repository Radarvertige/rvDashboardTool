import { generateToken } from './token';
import { generateShortUrl, getExistingUrl } from './url';

export const generateUrls = async (dashboard, groupNames) => {
  let generatedUrls = [];
  let clipboardText = '';

  let groups = groupNames ? groupNames.split(',').map(name => name.trim()) : [];

  if (groups.length === 0) {
    // No group provided: use the dashboard token directly and the dashboard name as the keyword
    const keyword = dashboard.name.replace(/\s+/g, '-').toLowerCase();
    console.log(`Generated Keyword for Dashboard (no group): ${keyword}`);

    // Check if the short URL already exists
    const existingUrl = await getExistingUrl(keyword);
    if (existingUrl) {
      console.log(`Existing URL found: ${existingUrl}`);
      generatedUrls.push({ group: '', url: existingUrl, team: dashboard.team });
      clipboardText += `URL: ${existingUrl}\n\n`;
    } else {
      const finalUrl = await generateShortUrl(dashboard.token, dashboard, keyword);
      if (finalUrl) {
        generatedUrls.push({ group: '', url: finalUrl, team: dashboard.team });
        clipboardText += `URL: ${finalUrl}\n\n`;
      }
    }
  } else {
    for (let group of groups) {
      if (group) {
        const keyword = group.replace(/\s+/g, '-').toLowerCase();
        console.log(`Generated Keyword for Group: ${keyword}`);

        // Check if the short URL already exists
        const existingUrl = await getExistingUrl(keyword);
        if (existingUrl) {
          console.log(`Existing URL found: ${existingUrl}`);
          generatedUrls.push({ group, url: existingUrl, team: dashboard.team });
          clipboardText += `Groep: ${group}\nURL: ${existingUrl}\n\n`;
        } else {
          const token = await generateToken(group, dashboard);
          const finalUrl = await generateShortUrl(token, dashboard, keyword);
          if (finalUrl) {
            generatedUrls.push({ group, url: finalUrl, team: dashboard.team });
            clipboardText += `Groep: ${group}\nURL: ${finalUrl}\n\n`;
          }
        }
      }
    }
  }

  // Copy to clipboard
  navigator.clipboard.writeText(clipboardText).then(() => {
    alert("Links zijn gekopieerd!");
  });

  return generatedUrls;
};
