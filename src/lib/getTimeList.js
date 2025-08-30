// get today's date for timeList comparision
const today = new Date();
const tDate = today.getDate(),
  tMonth = today.getMonth(),
  tYear = today.getFullYear();

export const getTimeList = date => {
  // get the selected date for timeList comparision
  const sDate = date.getDate(),
    sMonth = date.getMonth(),
    sYear = date.getFullYear();

  // now compare if it is today's date
  const isToday = tDate === sDate && tMonth === sMonth && tYear === sYear;

  // create a list of time for dropdown
  const timeList = [];
  const hour = date.getHours();
  const minute = date.getMinutes();

  // show the list as per the dates
  // If today, start the list from current time
  for (let i = isToday ? hour : 0; i < 24; ++i) {
    for (let j = i === hour ? Math.ceil(minute / 15) : 0; j < 4; ++j) {
      const k = (i % 24).toString().length === 1 ? "0" + (i % 24) : i % 24;
      timeList.push(k + ":" + (j * 15 || "00"));
    }
  }

  return timeList;
};

export const getLatestList = timeList => {
  const latestList = timeList;

  latestList.splice(0, 2);

  return latestList;
};
