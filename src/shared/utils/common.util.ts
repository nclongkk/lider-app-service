export const generateActiveCardOTP = (length = 4) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return OTP;
};

export const getSearchPattern = (searchKey) => {
  return { $regex: new RegExp(searchKey, 'i') };
};

export const filteredObject = (object) =>
  Object.keys(object).reduce((acc, key) => {
    if (object[key] !== undefined) {
      acc[key] = object[key];
    }
    return acc;
  }, {});

export const calculateTotalMeetingDuration = (data: any): number => {
  let totalDuration = 0;

  for (const member of data.members) {
    const connectedAt = new Date(member.connectedAt);
    const disconnectedAt = member.disconnectedAt
      ? new Date(member.disconnectedAt)
      : new Date();

    const duration = Math.abs(disconnectedAt.getTime() - connectedAt.getTime());
    totalDuration += duration / (1000 * 60); // Convert milliseconds to minutes
  }

  return Math.round(totalDuration);
};
