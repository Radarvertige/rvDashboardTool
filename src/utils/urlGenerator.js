import { generateToken } from './token';
import { generateShortUrl, getExistingUrl } from './url';

export const generateUrls = async (dashboard, groupNames, participants, isLTIDashboard) => {
  let generatedUrls = [];
  let clipboardText = '';

  // Groepen van strings verwerken zoals voorheen
  let groups = groupNames ? groupNames.split(',').map(name => name.trim()) : [];
  
  // Gebruik participants direct als array
  let participantsArray = Array.isArray(participants) ? participants : [];

  if (isLTIDashboard && participantsArray.length > 0) {
    // Voeg 'mailto:' toe aan elke participant email en vervang spaties door komma's
    participantsArray = participantsArray.join(' ').split(' ').map(email => `mailto:${email.trim()}`);

    // Voor het LTI-dashboard: één URL en één token voor alle deelnemers
    const keyword = `${dashboard.team.replace(/\s+/g, '').toLowerCase()}${groups.join('').replace(/\s+/g, '').toLowerCase()}`;
    console.log(`Generated Keyword for LTI Dashboard with Participants: ${keyword}`);

    const existingUrl = await getExistingUrl(keyword);
    if (existingUrl) {
      console.log(`Existing URL found: ${existingUrl}`);
      generatedUrls.push({ group: '', url: existingUrl, team: dashboard.team });
      clipboardText += `URL: ${existingUrl}\n\n`;
    } else {
      const token = await generateToken(participantsArray, dashboard);
      const finalUrl = await generateShortUrl(token, dashboard, keyword) || token;
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
          generatedUrls.push({ group, url: existingUrl, team: dashboard.team, isExisting: true });
          clipboardText += `Groep: ${group}\nURL: ${existingUrl}\n\nVoor deze groep is een link reeds aanwezig in de database, of is gereserveerd.\n\n`;
        } else {
          const token = await generateToken(group, dashboard);
          const result = await generateShortUrl(token, dashboard, keyword);
          if (result) {
            generatedUrls.push({ group, url: result.url, team: dashboard.team, isExisting: result.isExisting });
            clipboardText += `Groep: ${group}\nURL: ${result.url}\n\n`;
            if (result.isExisting) {
              clipboardText += 'Voor deze groep is een link reeds aanwezig in de database, of is gereserveerd.\n\n';
            }
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
