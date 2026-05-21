export default {
  options: {
    uppercase: {
      label: 'Maiuscolo',
      description: 'Genera UUID in formato maiuscolo.',
      value: false,
    },
    count: {
      label: 'Quantità',
      description: 'Numero di UUID da generare.',
      value: 1,
      min: 1,
      max: 100,
    },
  },
};
