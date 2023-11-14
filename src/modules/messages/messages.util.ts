export const calculateSecondsTimeDiff = (targetTime: string) => {
  const currentTime = new Date();
  const [targetHours, targetMinutes, targetSeconds] = targetTime.split(':');

  const targetTimeDate = new Date();
  targetTimeDate.setHours(parseInt(targetHours));
  targetTimeDate.setMinutes(parseInt(targetMinutes));
  targetTimeDate.setSeconds(parseInt(targetSeconds));
  const diff = Math.floor(
    (targetTimeDate.getTime() - currentTime.getTime()) / 1000,
  );
  return diff < 0 ? 86400 - Math.abs(diff) : diff;
};
