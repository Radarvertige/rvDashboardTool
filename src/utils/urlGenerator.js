import { generateToken } from './token';
import { generateShortUrl } from './url';
import { sanitizeForKeyword } from './sanitization';

const formatClipboardEntry = (group, result) => {
  const prefix = group ? `Groep: ${group}\n` : '';
  const suffix = result.isExisting
    ? '\nVoor deze groep is al een link aanwezig in de database, of de slug is al gereserveerd.'
    : '';

  return `${prefix}URL: ${result.url}${suffix}`;
};

export const generateUrls = async ({ dashboard, groups = [], participants = [], isLTIDashboard }) => {
  const generatedUrls = [];
  const clipboardEntries = [];

  if (!dashboard) {
    return { generatedUrls, clipboardText: '', error: 'Geen dashboard geselecteerd.' };
  }

  if (isLTIDashboard) {
    if (!participants.length) {
      return { generatedUrls, clipboardText: '', error: 'Voer minimaal één deelnemer in.' };
    }

    const teamSlug = sanitizeForKeyword(dashboard.team);
    const groupsSlug = sanitizeForKeyword(groups.join(''));
    const keyword = `${teamSlug}${groupsSlug}`;
    const participantsWithMailto = participants.map((email) => `mailto:${email.trim()}`);

    const token = await generateToken(participantsWithMailto, dashboard);
    const result = await generateShortUrl(token, dashboard, keyword);

    if (result?.url) {
      generatedUrls.push({ group: '', url: result.url, team: dashboard.team, isExisting: result.isExisting });
      clipboardEntries.push(formatClipboardEntry('', result));
    }
  } else {
    for (const group of groups) {
      if (group) {
        const teamSlug = sanitizeForKeyword(dashboard.team);
        const groupSlug = sanitizeForKeyword(group);
        const keyword = `${teamSlug}${groupSlug}`;

        const token = await generateToken(group, dashboard);
        const result = await generateShortUrl(token, dashboard, keyword);

        if (result?.url) {
          generatedUrls.push({ group, url: result.url, team: dashboard.team, isExisting: result.isExisting });
          clipboardEntries.push(formatClipboardEntry(group, result));
        }
      }
    }
  }

  return {
    generatedUrls,
    clipboardText: clipboardEntries.join('\n\n'),
    error: generatedUrls.length ? '' : 'Er konden geen links worden gegenereerd.',
  };
};
