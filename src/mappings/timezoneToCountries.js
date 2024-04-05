import zoneData from '../data/parsedZone1970'

export function timezoneToCountries(timezone) {
  const countries = zoneData
    .filter(zone => zone.tz.includes(timezone))
    .flatMap(zone => zone.codes.split(','))

  return [...new Set(countries)]
}
