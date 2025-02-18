import { generateToken } from './token';
import { generateShortUrl, getExistingUrl } from './url';

const replaceSpecialCharacters = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/gi, '');
};

export const generateUrls = async (dashboard, groupNames, participants, isNvwaDashboard) => {
  let generatedUrls = [];
  let clipboardText = '';

  // Groepen van strings verwerken zoals voorheen
  let groups = groupNames ? groupNames.split(',').map(name => name.trim()) : [];
  
  // Gebruik participants direct als array en vervang speciale tekens
  let participantsArray = Array.isArray(participants) ? participants : [];
  participantsArray = participantsArray.map(participant => replaceSpecialCharacters(participant));

  if (isNvwaDashboard && participantsArray.length > 0) {
    // Voor het NVWA-dashboard: één URL en één token voor alle deelnemers
    const keyword = dashboard.name.replace(/\s+/g, '-').toLowerCase();
    console.log(`Generated Keyword for NVWA Dashboard with Participants: ${keyword}`);

    const existingUrl = await getExistingUrl(keyword);
    if (existingUrl) {
      console.log(`Existing URL found: ${existingUrl}`);
      generatedUrls.push({ group: '', url: existingUrl, team: dashboard.team });
      clipboardText += `URL: ${existingUrl}\n\n`;
    } else {
      const token = await generateToken(participantsArray, dashboard);
      const finalUrl = await generateShortUrl(token, dashboard, keyword);
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

  navigator.clipboard.writeText(clipboardText).then(() => {
    alert("Links zijn gekopieerd!");
  });

  return generatedUrls;
};
