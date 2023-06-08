import * as crypto from 'crypto';
import * as dotEnv from 'dotenv';
dotEnv.config();

const secret = process.env.ENCRYPTION_SECRET || 'secret';

function createDigest(encodedData, format) {
  return crypto.createHmac('sha256', secret).update(encodedData).digest(format);
}

export function encode(sourceData) {
  const json = JSON.stringify(sourceData);
  const encodedData = Buffer.from(json).toString('base64');
  return `${encodedData}!${createDigest(encodedData, 'base64')}`;
}

export function decode(value) {
  const [encodedData, sourceDigest] = value.split('!');
  if (!encodedData || !sourceDigest) throw new Error('invalid value(s)');
  const json = Buffer.from(encodedData, 'base64').toString('utf8');

  return JSON.parse(json);
}
