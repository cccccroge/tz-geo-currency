import { countryToCurrencies } from './mappings/countryToCurrencies'
import { timezoneToCountry } from './mappings/timezoneToCountry'

// TL namespace, stands for `TimeLocate`
export const TL = {}

/**
 * Return a country alpha2 that match user's timezone.
 * If there are multiple countries, then the first one in the dataset is returned.
 */

TL.getCountry = function () {
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const country = timezoneToCountry(browserTz)

  if (!country) {
    return null
  }

  return country
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
