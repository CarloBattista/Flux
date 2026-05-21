import { reactive } from 'vue';

export const store = reactive({
  plans: [
    {
      id: 0,
      name: 'Free',
      price: '0',
      type: 'monthly',
      description: 'Perfetto per utilizzi occasionali e conversioni rapide direttamente dal browser.',
      features: [
        'Conversioni limitate al giorno',
        'Accesso ai tool base',
        'Compressione immagini standard',
        'Dev tools inclusi',
        'Nessuna registrazione richiesta',
      ],
    },
    {
      id: 1,
      name: 'Plus',
      price: '4,99',
      type: 'monthly',
      description: 'Ideale per creator, developer e utenti che utilizzano i tool ogni giorno.',
      features: [
        'Conversioni illimitate',
        'File di dimensioni maggiori',
        'Compressione avanzata video e immagini',
        'Accesso completo a tutti i tool',
        'Nuove feature in anteprima',
      ],
    },
  ],

  searchBar: {
    isOpen: false,
  },
});
