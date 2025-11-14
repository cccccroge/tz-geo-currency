# tz-geo-currency
![npm](https://img.shields.io/npm/v/tz-geo-currency.svg)
![Build Status](https://github.com/cccccroge/tz-geo-currency/actions/workflows/npm-publish.yml/badge.svg)
![License](https://img.shields.io/github/license/cccccroge/tz-geo-currency.svg)


A JavaScript library offering an alternative to IP-based geolocation, using timezone information to infer a user's country and currency.

see [Motivation](#motivation)

## Installation
### Using NPM
```bash
npm install tz-geo-currency
```
### Using Yarn
```bash
yarn add tz-geo-currency
```

## Usage
### `getCountry()`
Outputs the user's country (in ISO 3166-1 alpha-2) based on timezone, e.g., get `'US'` if TZ is `America/New_York`.

For the accuracy and limitations, see [FAQ](#faq)
```js
import { TL } from 'tz-geo-currency'; // TL stands for TimeLocate

const country = TL.getCountry(); // 'US'
```

### `getCurrencies()`
Outputs an array of currency codes (in ISO 4217) of the most probable country, which derived from timezone
```js
const currencies = TL.getCurrencies(); // ['USD'], assume the TZ is same
```

### `getCurrenciesFromCountry(countryCode: string)`
Outputs an array of currency codes on given country
```js
const currencies = TL.getCurrenciesFromCountry('JP'); // ['JPY']
```

## FAQ
### How accurate is TL.getCountry()?

`TL.getCountry()` provides highly accurate country detection through direct 1:1 timezone-to-country mapping from the [IANA Time Zone Database](https://data.iana.org/time-zones/). Each timezone maps to exactly one country, ensuring consistent and deterministic results.

**Coverage:**
- Supports all 418 canonical IANA timezones (from `zone.tab`)
- Handles 256 deprecated/legacy timezone names (from `backward` file)
- Total coverage: 674 timezone identifiers

**Accuracy expectations:**
- **~99%** for users with correct OS timezone settings (comparable to IP Geolocation)
- Works correctly across all modern browsers that support `Intl.DateTimeFormat`
- Handles historical timezone name changes automatically

**Known limitations:**
- Users who manually set incorrect timezone on their system
- Disputed territories may reflect IANA's political stance (e.g., `Europe/Simferopol` → UA)
- Browsers returning unknown timezone identifiers will return `null`

**Advantages over IP geolocation:**
- VPN/Proxy users: returns real location (based on system timezone), not VPN server location
- Privacy-friendly: no external API calls or IP tracking
- Zero cost: no paid geolocation service required
- Offline-capable: works without internet connection

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