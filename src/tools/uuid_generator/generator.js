export const generateUUID = (options = {}) => {
  const { uppercase = false, count = 1 } = options;
  const uuids = [];

  for (let i = 0; i < count; i++) {
    let uuid = '';
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      uuid = crypto.randomUUID();
    } else {
      // Fallback per ambienti più vecchi
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    if (uppercase) {
      uuid = uuid.toUpperCase();
    }
    uuids.push(uuid);
  }

  return count === 1 ? uuids[0] : uuids.join('\n');
};
