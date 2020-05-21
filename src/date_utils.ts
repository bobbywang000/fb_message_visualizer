export const transformTimestampToDateTimeString = (timestamp: number): string => {
  const date = new Date(timestamp);
  const opts = {
    timeZone: "America/Los_Angeles",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleTimeString("en-US", opts);
};

export const transformTimestampToIsoString = (timestamp: number): string => {
  return new Date(timestamp).toISOString();
};
