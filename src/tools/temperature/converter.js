export function convertTemperature(value, from, to) {
  if (from === to) return value;

  if (from === 'celsius' && to === 'fahrenheit') {
    return (value * 9) / 5 + 32;
  }

  if (from === 'fahrenheit' && to === 'celsius') {
    return ((value - 32) * 5) / 9;
  }

  return null;
}
