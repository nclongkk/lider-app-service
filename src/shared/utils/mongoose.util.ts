import { Types } from 'mongoose';

export const parseObjectId = (id: string): Types.ObjectId => {
  try {
    return new Types.ObjectId(id);
  } catch (err) {
    return null;
  }
};

export const parseObjectIds = (ids: string[]): Types.ObjectId[] => {
  try {
    return ids.map((id) => parseObjectId(id));
  } catch (err) {
    return [];
  }
};

export const isValidObjectIds = (arrIds) => {
  const invalidIds = [];
  arrIds.forEach((id) => {
    if (!Types.ObjectId.isValid(id)) {
      invalidIds.push(id);
    }
  });
  return invalidIds;
};

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
