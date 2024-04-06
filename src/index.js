import { countryToCurrencies } from './mappings/countryToCurrencies'
import { timezoneToCountries } from './mappings/timezoneToCountries'

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

function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
