# tz-geo-currency
A JavaScript library offering an alternative to IP-based geolocation, using timezone information to infer a user's country and currency.

see [Motivation](#motivation)

## Installation
```bash
npm install tz-geo-currency
```

## Usage
### Infer User's Country by TimeZone
Outputs the most probable user's country (in ISO 3166-1 alpha-2) based on timezone, e.g., get `'US'` if TZ is `America/New_York`.

For the accuracy and limitations, see [FAQ](#faq)
```js
import { TL } from 'tz-geo-currency';

const country = TL.getCountry(); // 'US'
```

### Retrieving Possible Countries for Timezone
Outputs an array of all possible countries based on timezone
```js
const countries = TL.getCountries(); //['US'], assume the TZ is same
```

### Getting the Currencies for the inferred User's Country
Outputs an array of currency codes (in ISO 4217) of the most probable country, which derived from timezone
```js
const currencies = TL.getCurrencies(); // ['USD'], assume the TZ is same
```

### Fetching Currencies for a Specified Country Code
Outputs an array of currency codes on given country
```js
const currencies = TL.getCurrenciesFromCountry('JP'); // ['JPY']
```

## FAQ
### How accurate is TL.getCountry()?

`TL.getCountry()` is at least 89% accurate. Use `TL._reportAccuracy()` to see specific stats and understand its accuracy for your needs. In cases where your application doesn't encounter complex timezones, the accuracy may align closely with IP Geolocation methods (which is [around 99%](https://www.google.com/search?q=how+accurate+is+IP+geolocation+in+country+level&sourceid=chrome&ie=UTF-8)).

Here's the brief output of `TL._reportAccuracy()` from latest version.
```
{
  accuracy: 89.42307692307693,
  inaccurateList: [
    [ 'Africa/Abidjan', [Array] ],
    [ 'Africa/Johannesburg', [Array] ],
    [ 'Africa/Lagos', [Array] ],
    [ 'Africa/Maputo', [Array] ],
    [ 'Africa/Nairobi', [Array] ],
    [ 'America/Panama', [Array] ],
    [ 'America/Phoenix', [Array] ],
    [ 'America/Puerto_Rico', [Array] ],
    [ 'America/Toronto', [Array] ],
    [ 'Asia/Bangkok', [Array] ],
    [ 'Asia/Dubai', [Array] ],
    [ 'Asia/Kuching', [Array] ],
    [ 'Asia/Qatar', [Array] ],
    [ 'Asia/Riyadh', [Array] ],
    [ 'Asia/Singapore', [Array] ],
    [ 'Asia/Yangon', [Array] ],
    [ 'Europe/Belgrade', [Array] ],
    [ 'Europe/Berlin', [Array] ],
    [ 'Europe/Brussels', [Array] ],
    [ 'Europe/Helsinki', [Array] ],
    [ 'Europe/London', [Array] ],
    [ 'Europe/Paris', [Array] ],
    [ 'Europe/Prague', [Array] ],
    [ 'Europe/Rome', [Array] ],
    [ 'Europe/Simferopol', [Array] ],
    [ 'Europe/Zurich', [Array] ],
    [ 'Indian/Maldives', [Array] ],
    [ 'Pacific/Auckland', [Array] ],
    [ 'Pacific/Guadalcanal', [Array] ],
    [ 'Pacific/Guam', [Array] ],
    [ 'Pacific/Pago_Pago', [Array] ],
    [ 'Pacific/Port_Moresby', [Array] ],
    [ 'Pacific/Tarawa', [Array] ]
  ]
}
```
Note that it *might still work* if the user's timezone is in `inaccurateList`. Since `getCountry` will return the first country in the [IANA TZ dataset](https://data.iana.org/time-zones/tzdb/zone1970.tab), which is the country of most-populous city compared to other's

### What metadata is supported?
Currently, the library identifies country and currency. We're focused on reliably providing these key details. With the country code, you can easily fetch more specific metadata as needed for your application.


## Motivation
In 2024, it remains not straightforward for global web applications to automatically detect users' countries and currencies, which are essential for processing payments and customizing product displays. The [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API), while capable of accurately locating users, is often considered too invasive for the mere purpose of content localization, as it requires user consent upon page load.

### The Standard: IP Geolocation
Traditionally, services use [IP geolocation](https://en.wikipedia.org/wiki/Internet_geolocation) to identify user locations, linking IP addresses to physical locations for precise localization. While effective, it introduces challenges related to complexity and cost associated with maintaining accurate IP geolocation databases.

### A Streamlined Alternative: Timezone-Based Detection
An alternative, inspired by a [Stack Overflow suggestion](https://stackoverflow.com/a/65043902), leverages timezone information to infer countries and currencies. This method, bypassing the need for extensive databases, simplifies implementation and reduces operational costs.


### Trade-offs to Consider
- Privacy: Unlike IP geolocation, timezone detection doesn't handle sensitive data, offering a discreet localization method.
- Accuracy: IP geolocation is more accurate, directly associating users with locations. Timezone-based detection, less precise, is still practical for applications where exact localization isn't critical.
- Cost and Simplicity: The timezone method is straightforward and avoids the costs related to IP geolocation services, making it an economical choice for broad use.