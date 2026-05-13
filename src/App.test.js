import { normalizeTeamSlug } from './utils/dashboardData';
import { parseCommaSeparatedValues, parseParticipantEmails } from './utils/validation';

test('normalizeTeamSlug normalizes spacing and casing', () => {
  expect(normalizeTeamSlug(' aw team ')).toBe('AW-TEAM');
});

test('parseCommaSeparatedValues removes empty values', () => {
  expect(parseCommaSeparatedValues(' groep 1, , groep 2 ,,')).toEqual(['groep 1', 'groep 2']);
});

test('parseParticipantEmails rejects invalid email addresses', () => {
  expect(() => parseParticipantEmails('goed@example.com, ongeldig')).toThrow('Ongeldige e-mailadressen: ongeldig');
});

test('parseParticipantEmails returns trimmed emails', () => {
  expect(parseParticipantEmails('goed@example.com, tweede@example.com ')).toEqual([
    'goed@example.com',
    'tweede@example.com',
  ]);
});
