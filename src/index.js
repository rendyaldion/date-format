const { isDate, isNumber, isString } = require('lodash');

function dateToString(date) {
  const newDate = date.toISOString().replace(/T|Z|\.\d{3}/g, ' ').trim();
  return newDate;
}

function stringToDate(date) {
  const newDate = new Date(date).toDateString();
  const dayNumber = newDate.slice(8, 10);
  const month = newDate.slice(4, 7);
  const year = newDate.slice(11, 15);
  return `${dayNumber} ${month} ${year}`;
}

function dateParams(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const newDate = date.getDate();
  const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${newDate.toString().padStart(2, '0')}`;
  return formattedDate;
}

function unixTimeStampToDate(date) {
  if (!date) return '-';
  const newDate = date.toString().length === 10 ? new Date(date * 1000) : new Date(date);
  return stringToDate(newDate.toDateString());
}

function dateToUnixTimeStamp(date, isStartDate = false, isSecond = true) {
  if (!date) return '';
  let newDate = new Date(date);
  if (isStartDate) {
    newDate = new Date(date).setHours(0, 0, 0, 0);
  } else {
    newDate = new Date(date).setHours(23, 59, 59, 999);
  }

  if (isSecond) {
    return Math.floor(newDate / 1000).toFixed(0);
  } else {
    return newDate;
  }
}

function formatDatePeriode(startDuration, endDuration) {
  if (isDate(startDuration) && isDate(endDuration)) {
    return '-';
  }

  const formatStartDuration = formatDate(startDuration, '/', 'MMM');
  const formatEndDuration = formatDate(endDuration, '/', 'MMM');
  return `${formatStartDuration} - ${formatEndDuration}`;
}

function calcDate(startDate, endDate) {
  const todayTimestamp = new Date().getTime();

  const startDateInstance = new Date(startDate);
  const endDateInstance = new Date(endDate);

  const startDateTimestamp = startDateInstance.getTime() + Math.abs(todayTimestamp - startDateInstance.getTime());
  const endDateTimestamp = endDateInstance.getTime();

  const calcTimestamp = Math.abs(startDateTimestamp - endDateTimestamp);
  const calcDays = Math.floor(calcTimestamp / (1000 * 3600 * 24));

  const yearsPassed = Math.floor(calcDays / 365);
  const monthsPassed = Math.floor((calcDays % 365) / 30);
  const daysPassed = calcDays % 30;

  const yearText = yearsPassed ? `${yearsPassed} tahun` : '';
  const monthText = monthsPassed ? `${monthsPassed} bulan` : '';
  const dayText = daysPassed ? `${daysPassed} hari` : '';

  const result = `${yearText} ${monthText} ${dayText}`;

  return {
    totalDays: calcDays,
    result: result.trim(),
  };
}

function getDay(date) {
  const weekday = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const d = new Date(date);
  const day = weekday[d.getDay()];
  return day;
}

function checkPeriodeStatus(startDuration, endDuration) {
  const today = new Date().getTime();

  const getUnixTimestamp = (date) => {
    if (isString(date)) {
      return dateToUnixTimeStamp(date);
    } else if (isNumber(date)) {
      return date;
    } else {
      return today;
    }
  };

  const isActive = today > getUnixTimestamp(startDuration) && today < getUnixTimestamp(endDuration);

  return isActive;
}

module.exports = {
  dateToString,
  stringToDate,
  dateParams,
  unixTimeStampToDate,
  dateToUnixTimeStamp,
  formatDatePeriode,
  calcDate,
  getDay,
  checkPeriodeStatus
};
