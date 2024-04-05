// TL namespace, stands for `TimeLocate`
const TL = {};

TL.getCountry = function() {
  const tz = getTimezone();
  return timezoneToCountry(tz);
}

TL.getCurrency = function() {
  const country = TL.getCountry();
  return countryToCurrency(country);
}

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
