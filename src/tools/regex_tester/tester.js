export const testRegex = (pattern, flags, text) => {
  if (!pattern) return { success: true, matches: [], error: null };

  try {
    const regex = new RegExp(pattern, flags);
    const matches = [];
    let match;

    if (flags.includes('g')) {
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          index: match.index,
          value: match[0],
          groups: match.slice(1),
        });
        // Previene loop infiniti con match di lunghezza zero
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }
    } else {
      match = text.match(regex);
      if (match) {
        matches.push({
          index: match.index,
          value: match[0],
          groups: match.slice(1),
        });
      }
    }

    return {
      success: true,
      matches,
      error: null,
    };
  } catch (e) {
    return {
      success: false,
      matches: [],
      error: e.message,
    };
  }
};
