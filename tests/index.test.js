import { TL } from '../src'

function mockBrowserTimezone(tz) {
  Intl
    .DateTimeFormat
    .prototype.resolvedOptions
      = jest.fn(() => ({ timeZone: tz }))
}

describe('getCountry', () => {
  test('Asia/Tokyo', () => {
    mockBrowserTimezone('Asia/Tokyo')
    const country = TL.getCountry()
    expect(country).toBe('JP')
  })

  test('Asia/Shanghai', () => {
    mockBrowserTimezone('Asia/Shanghai')
    const country = TL.getCountry()
    expect(country).toBe('CN')
  })

  test('America/New_York', () => {
    mockBrowserTimezone('America/New_York')
    const country = TL.getCountry()
    expect(country).toBe('US')
  })

  test('Europe/Paris', () => {
    mockBrowserTimezone('Europe/Paris')
    const country = TL.getCountry()
    expect(country).toBe('FR')
  })

  test('Australia/Melbourne', () => {
    mockBrowserTimezone('Australia/Melbourne')
    const country = TL.getCountry()
    expect(country).toBe('AU')
  })

  test('Africa/Cairo', () => {
    mockBrowserTimezone('Africa/Cairo')
    const country = TL.getCountry()
    expect(country).toBe('EG')
  })
})

describe('getCountries', () => {
  test('Asia/Taipei', () => {
    mockBrowserTimezone('Asia/Taipei')
    const countries = TL.getCountries()
    expect(countries).toEqual(['TW'])
  })

  test('America/Phoenix', () => {
    mockBrowserTimezone('America/Phoenix')
    const countries = TL.getCountries()
    expect(countries).toEqual(['US', 'CA'])
  })
})

describe('getCurrencies', () => {
  test('Asia/Tokyo', () => {
    mockBrowserTimezone('Asia/Tokyo')
    const currencies = TL.getCurrencies()
    expect(currencies).toEqual(['JPY'])
  })

  test('Asia/Shanghai', () => {
    mockBrowserTimezone('Asia/Shanghai')
    const currencies = TL.getCurrencies()
    expect(currencies).toEqual(['CNY'])
  })

  test('America/New_York', () => {
    mockBrowserTimezone('America/New_York')
    const currencies = TL.getCurrencies()
    expect(currencies).toEqual(['USD'])
  })

  test('Europe/Paris', () => {
    mockBrowserTimezone('Europe/Paris')
    const currencies = TL.getCurrencies()
    expect(currencies).toEqual(['EUR'])
  })

  test('Australia/Melbourne', () => {
    mockBrowserTimezone('Australia/Melbourne')
    const currencies = TL.getCurrencies()
    expect(currencies).toEqual(['AUD'])
  })

  test('Africa/Cairo', () => {
    mockBrowserTimezone('Africa/Cairo')
    const currencies = TL.getCurrencies()
    expect(currencies).toEqual(['EGP'])
  })

  test('America/Panama', () => {
    mockBrowserTimezone('America/Panama')
    const currencies = TL.getCurrencies()
    expect(currencies).toEqual(['PAB', 'USD'])
  })
})

describe('getCurrenciesFromCountry', () => {
  test('United States of America', () => {
    const currencies = TL.getCurrenciesFromCountry('US')
    expect(currencies).toEqual(['USD'])
  })

  test('Cambodia', () => {
    const currencies = TL.getCurrenciesFromCountry('KH')
    expect(currencies).toEqual(['KHR', 'USD'])
  })
})

describe('_reportAccuracy', () => {
  test('good enough accuracy', () => {
    const report = TL._reportAccuracy()
    expect(report.accuracy).toBeGreaterThan(88)
  })
})
