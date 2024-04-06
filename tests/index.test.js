import { TL } from '../src'

describe('getCountry', () => {
  test('test', () => {
    const country = TL.getCountry()
    expect(country).toBe('TW')
  })
})
