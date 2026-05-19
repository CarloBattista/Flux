import { convertDataTransferRate } from './converter';
import config from './config';
import metadata from './metadata';

export default {
  config,
  metadata,
  convert: convertDataTransferRate,
};
