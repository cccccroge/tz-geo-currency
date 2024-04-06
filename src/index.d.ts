declare module 'tz-geo-currency' {
  /**
   * Represents a utility library for locating countries and currencies based on timezone.
   */
  export namespace TL {
    /**
     * Returns the alpha-2 code of the first country that matches the user's timezone.
     * Returns null if no country is found.
     */
    function getCountry(): CountryCode | null;

    /**
     * Returns an array of alpha-2 country codes that match the user's timezone.
     */
    function getCountries(): CountryCode[];

    /**
     * Returns an array of ISO-4217 currency codes corresponding to the country obtained from `getCountry`.
     * Returns an empty array if no country or currencies are found.
     */
    function getCurrencies(): CurrencyCode[];

    /**
     * Returns an array of ISO-4217 currency codes for the specified alpha-2 country code.
     */
    function getCurrenciesFromCountry(countryCode: CountryCode): CurrencyCode[];

    /**
     * Reports the accuracy of timezone-based country determination.
     * Returns an object with the accuracy percentage and a list of inaccurate timezone mappings.
     */
    function _reportAccuracy(): {
      accuracy: number;
      inaccurateList: Array<[string, CountryCode[]]>;
    };
  }
}

type CountryCode = string;
type CurrencyCode = string;
