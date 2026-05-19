import { convertVelocity } from './convertor';
import config from './config';
import metadata from './metadata';

export default {
  config,
  metadata,
  convert: convertVelocity,
};
