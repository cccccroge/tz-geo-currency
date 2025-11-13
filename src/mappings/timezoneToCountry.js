import zoneData from '../data/parsedZone'
import parsedBackward from '../data/parsedBackward'

export function timezoneToCountry(timezone) {
  if (zoneData[timezone]) {
    return zoneData[timezone]
  }

  /*
   * The browser's timezone follows CLDR standards, which include some outdated timezones.
   * So, we need to convert it back to the up-to-date version.
   * https://github.com/cccccroge/tz-geo-currency/issues/1
   */
  return zoneData[parsedBackward[timezone]]
}
