// int (min) -> hour min

export const intToHour = (min: number) => {
  const hours = Math.floor(min / 60);
  return hours;
};

export const intToMin = (min: number) => {
  const minutes = min % 60;
  return minutes;
};
