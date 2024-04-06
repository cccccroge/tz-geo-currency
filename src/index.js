import { countryToCurrencies } from './mappings/countryToCurrencies'
import { timezoneToCountries } from './mappings/timezoneToCountries'
import parsedZones from './data/parsedZone1970'

// TL namespace, stands for `TimeLocate`
export const TL = {}

/**
 * Return a country alpha2 that match user's timezone.
 * If there are multiple countries, then the first one in the dataset is returned.
 */

TL.getCountry = function () {
  const tz = getTimezone()
  const countries = timezoneToCountries(tz)

  if (!countries.length) {
    return null
  }

  return countries[0]
}

/**
 * Return an array of possible countries in alpha2 that match user's timezone.
 */
TL.getCountries = function () {
  const tz = getTimezone()
  return timezoneToCountries(tz)
}

/**
 * Get the corresponding currencies in ISO-4217 that return from `getCountry`
 */
TL.getCurrencies = function () {
  const country = TL.getCountry()

  if (!country) {
    return []
  }

  return countryToCurrencies(country)
}

/**
 * Get the corresponding currencies in ISO-4217 of the specified country
 */
TL.getCurrenciesFromCountry = function (countryCode) {
  return countryToCurrencies(countryCode)
}

TL._reportAccuracy = function () {
  const record = {}
  parsedZones.forEach((z) => {
    z.tz.forEach((tz) => {
      if (!record[tz]) {
        record[tz] = z.codes.split(',')
      }
      else {
        throw new Error('Dataset malformed!')
      }
    })
  })

  const recordArr = Object.entries(record)
  const accurateList = recordArr.filter(entry => entry[1].length === 1)
  const inaccurateList = recordArr.filter(entry => entry[1].length > 1)
  const accuracy = (accurateList.length / recordArr.length) * 100

  return {
    accuracy,
    inaccurateList: inaccurateList.sort(),
  }
}

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
