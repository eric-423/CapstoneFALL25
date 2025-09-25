export function getReceiveTime() {
  const now = new Date();
  const receiveTime = now;
  if (now.getHours() > 10) {
    receiveTime.setDate(receiveTime.getDate() + 1);
    if (receiveTime.getDay() === 0) {
      receiveTime.setDate(receiveTime.getDate() + 1);
    }
  }
  receiveTime.setHours(12, 0);
  return receiveTime;
}

export function getReceiveTimeString(time: Date) {
  const localISOTime = new Date(time.getTime() - time.getTimezoneOffset() * 60000).toISOString();
  return localISOTime;
}
