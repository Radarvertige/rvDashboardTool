const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const parseCommaSeparatedValues = (value = '') => value
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);

export const parseParticipantEmails = (value = '') => {
  const emails = parseCommaSeparatedValues(value);
  const invalidEmails = emails.filter((email) => !EMAIL_PATTERN.test(email));

  if (invalidEmails.length > 0) {
    throw new Error(`Ongeldige e-mailadressen: ${invalidEmails.join(', ')}`);
  }

  return emails;
};