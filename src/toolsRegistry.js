import temperature from './tools/temperature';
import time from './tools/time';
import velocity from './tools/velocity';
import dataTransferRate from './tools/data_transfer_rate';
import imageConverter from './tools/image_converter';
import videoConverter from './tools/video_converter';

export const tools = {
  temperature,
  time,
  velocity,
  'data-transfer-rate': dataTransferRate,
  'image-converter': imageConverter,
  'video-converter': videoConverter,
};
