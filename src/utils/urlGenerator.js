import { generateToken } from './token';
import { generateShortUrl } from './url';

const sanitizeForKeyword = (value = '') => value
  .toString()
  .replace(/[\s-]+/g, '')
  .toLowerCase();

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
    const teamSlug = sanitizeForKeyword(dashboard.team);
    const groupsSlug = sanitizeForKeyword(groups.join(''));
    const keyword = `${teamSlug}${groupsSlug}`;
    console.log(`Generated Keyword for LTI Dashboard with Participants: ${keyword}`);

    const token = await generateToken(participantsArray, dashboard);
    const result = await generateShortUrl(token, dashboard, keyword);
    if (result?.url) {
      generatedUrls.push({ group: '', url: result.url, team: dashboard.team, isExisting: result.isExisting });
      clipboardText += `URL: ${result.url}`;
      if (result.isExisting) {
        clipboardText += `\nVoor deze groep is een link reeds aanwezig in de database, of is gereserveerd.`;
      }
      clipboardText += '\n\n';
    }
  } else {
    for (let group of groups) {
      if (group) {
        const teamSlug = sanitizeForKeyword(dashboard.team);
        const groupSlug = sanitizeForKeyword(group);
        const keyword = `${teamSlug}${groupSlug}`;
        console.log(`Generated Keyword for Group: ${keyword}`);

        const token = await generateToken(group, dashboard);
        const result = await generateShortUrl(token, dashboard, keyword);
        if (result?.url) {
          generatedUrls.push({ group, url: result.url, team: dashboard.team, isExisting: result.isExisting });
          clipboardText += `Groep: ${group}\nURL: ${result.url}`;
          if (result.isExisting) {
            clipboardText += '\nVoor deze groep is een link reeds aanwezig in de database, of is gereserveerd.';
          }
          clipboardText += '\n\n';
        }
      }
    }
  }

  navigator.clipboard.writeText(clipboardText).then(() => {
    alert("Links zijn gekopieerd!");
  });

  return generatedUrls;
};
