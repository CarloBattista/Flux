export default {
  positions: [
    { label: 'Top Left', value: '10:10' },
    { label: 'Top Right', value: 'main_w-overlay_w-10:10' },
    { label: 'Bottom Left', value: '10:main_h-overlay_h-10' },
    { label: 'Bottom Right', value: 'main_w-overlay_w-10:main_h-overlay_h-10' },
    { label: 'Center', value: '(main_w-overlay_w)/2:(main_h-overlay_h)/2' },
  ],
  defaultPosition: 'main_w-overlay_w-10:10', // Top Right
  opacityLevels: [
    { label: '25%', value: 0.25 },
    { label: '50%', value: 0.5 },
    { label: '75%', value: 0.75 },
    { label: '100%', value: 1.0 },
  ],
  defaultOpacity: 0.75,
  sizeLevels: [
    { label: 'S', value: 0.1, px: 40 },
    { label: 'M', value: 0.2, px: 80 },
    { label: 'L', value: 0.3, px: 120 },
    { label: 'XL', value: 0.4, px: 160 },
  ],
  defaultSize: 0.2,
  marginLevels: [
    { label: '0', value: 0 },
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '40', value: 40 },
  ],
  defaultMargin: 20,
};
