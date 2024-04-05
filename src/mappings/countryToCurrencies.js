import countryData from '../data/parsedCountries'

export function countryToCurrencies(countryCode) {
  const country = countryData.find(country => country.cca2 === countryCode)

  return country ? country.currencies : []
}
