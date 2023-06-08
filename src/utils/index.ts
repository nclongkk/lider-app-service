import { Types } from 'mongoose';

export function getHostPathFromUrl(url: string): {
  host: string;
  path: string;
} {
  let host;
  let pathname;
  try {
    ({ host, pathname } = new URL(url));
  } catch (error) {
    try {
      ({ host, pathname } = new URL('http://' + url));
    } catch (error) {
      throw new Error('Invalid URL');
    }
  }

  !host && (host = url);
  return { host, path: pathname };
}

export const createMongoIdByTimestamp = (
  timestampInSeconds: number,
  type?: 'from-time' | 'to-time',
  timezone = 7,
) => {
  const hexSeconds = Math.floor(
    timestampInSeconds - +timezone * 60 * 60,
  ).toString(16);
  switch (true) {
    case type === 'from-time':
      return new Types.ObjectId(hexSeconds + '0000000000000000');

    case type === 'to-time':
      return new Types.ObjectId(hexSeconds + 'ffffffffffffffff');

    default:
      return new Types.ObjectId(timestampInSeconds);
  }
};
