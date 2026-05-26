import { tools } from '../toolsRegistry';

export const categories = {
  media: {
    label: 'Media',
    tools: [
      tools['image-converter'],
      tools['image-compressor'],
      tools['image-resizer'],
      tools['video-converter'],
      tools['video-compressor'],
      tools['video-to-gif'],
      tools['video-watermark'],
      tools['audio-converter'],
    ],
  },
  units: {
    label: 'Unità',
    tools: [tools.temperature, tools.time, tools.velocity, tools['data-transfer-rate']],
  },
  devtools: {
    label: 'DevTools',
    tools: [
      tools['json-formatter'],
      tools['base64-converter'],
      tools['jwt-decoder'],
      tools['jwt-encoder'],
      tools['regex-tester'],
      tools['timestamp-converter'],
      tools['uuid-generator'],
      tools['color-picker-converter'],
    ],
  },
};
