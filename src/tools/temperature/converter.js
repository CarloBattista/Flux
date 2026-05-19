export function convertTemperature(value, from, to) {
  if (from === to) return value;

  // Converti l'input in Celsius (unità base)
  let celsius;
  switch (from) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      celsius = ((value - 32) * 5) / 9;
      break;
    case 'kelvin':
      celsius = value - 273.15;
      break;
    default:
      return null;
  }

  // Converti da Celsius all'unità di destinazione
  switch (to) {
    case 'celsius':
      return celsius;
    case 'fahrenheit':
      return (celsius * 9) / 5 + 32;
    case 'kelvin':
      return celsius + 273.15;
    default:
      return null;
  }
}
