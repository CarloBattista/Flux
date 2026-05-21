import config from './config';
import metadata from './metadata';
import { decodeJWT, getExpirationInfo } from './decoder';

export default {
  config,
  metadata,
  decodeJWT,
  getExpirationInfo,
};
