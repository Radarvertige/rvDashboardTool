export const sanitizeForKeyword = (value = '') => value
  .toString()
  .replace(/[\s-]+/g, '')
  .toLowerCase();