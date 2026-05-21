export default {
  defaultQuality: 3, // 1: Low, 2: Medium, 3: High, 4: Very High
  qualities: [
    { label: 'Molto Bassa', crf: 40, bitrate: '500k' },
    { label: 'Bassa', crf: 32, bitrate: '1M' },
    { label: 'Media', crf: 28, bitrate: '2M' },
    { label: 'Alta', crf: 23, bitrate: '5M' },
    { label: 'Molto Alta', crf: 18, bitrate: '10M' },
  ],
  formats: ['mp4', 'webm'],
  labels: {
    mp4: 'MP4',
    webm: 'WebM',
  },
};
