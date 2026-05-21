export default {
  options: {
    urlSafe: {
      label: 'URL Safe',
      description: 'Usa - e _ invece di + e / per rendere il Base64 sicuro per gli URL.',
      value: false,
    },
    padding: {
      label: 'Padding',
      description: 'Include i caratteri di padding (=) alla fine della stringa.',
      value: true,
    },
    splitLines: {
      label: 'Dividi Righe',
      description: 'Dividi output in righe da 64 caratteri (formato MIME/PEM).',
      value: false,
    },
  },
  encodingOptions: [
    { label: 'Standard (Base64)', value: 'standard' },
    { label: 'URL Safe (Base64URL)', value: 'urlsafe' },
  ],
};
