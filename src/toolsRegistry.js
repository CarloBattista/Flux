import temperature from './tools/temperature';
import time from './tools/time';
import velocity from './tools/velocity';
import dataTransferRate from './tools/data_transfer_rate';
import imageConverter from './tools/image_converter';
import videoConverter from './tools/video_converter';
import audioConverter from './tools/audio_converter';
import jsonFormatter from './tools/json_formatter';
import base64Converter from './tools/base64_converter';
import jwtDecoder from './tools/jwt_decoder';
import regexTester from './tools/regex_tester';
import timestampConverter from './tools/timestamp_converter';
import uuidGenerator from './tools/uuid_generator';
import colorPickerConverter from './tools/color_picker_converter';

export const tools = {
  temperature,
  time,
  velocity,
  'data-transfer-rate': dataTransferRate,
  'image-converter': imageConverter,
  'video-converter': videoConverter,
  'audio-converter': audioConverter,
  'json-formatter': jsonFormatter,
  'base64-converter': base64Converter,
  'jwt-decoder': jwtDecoder,
  'regex-tester': regexTester,
  'timestamp-converter': timestampConverter,
  'uuid-generator': uuidGenerator,
  'color-picker-converter': colorPickerConverter,
};
