// Country dial codes + national number expectations.
// min/maxNational refer to the digits AFTER the dial code and
// after any leading zero is stripped.
//
// Example: Nigeria (NG, dial 234)
//   User types: 08012345678
//   Strip leading 0 -> 8012345678
//   Full E.164: +2348012345678
//   nationalDigits.length = 10, within [10, 10]

export const COUNTRIES = [
  { iso: 'NG', name: 'Nigeria',        dial: '234', minNational: 10, maxNational: 10, example: '080 1234 5678' },
  { iso: 'KE', name: 'Kenya',          dial: '254', minNational: 9,  maxNational: 9,  example: '0712 345 678' },
  { iso: 'GH', name: 'Ghana',          dial: '233', minNational: 9,  maxNational: 9,  example: '024 123 4567' },
  { iso: 'ZA', name: 'South Africa',   dial: '27',  minNational: 9,  maxNational: 9,  example: '082 123 4567' },
  { iso: 'US', name: 'United States',  dial: '1',   minNational: 10, maxNational: 10, example: '(555) 123-4567' },
  { iso: 'CA', name: 'Canada',         dial: '1',   minNational: 10, maxNational: 10, example: '(416) 555-0123' },
  { iso: 'GB', name: 'United Kingdom', dial: '44',  minNational: 10, maxNational: 10, example: '07700 900123' },
  { iso: 'IE', name: 'Ireland',        dial: '353', minNational: 9,  maxNational: 9,  example: '085 123 4567' },
  { iso: 'DE', name: 'Germany',        dial: '49',  minNational: 10, maxNational: 11, example: '0151 23456789' },
  { iso: 'FR', name: 'France',         dial: '33',  minNational: 9,  maxNational: 9,  example: '06 12 34 56 78' },
  { iso: 'NL', name: 'Netherlands',    dial: '31',  minNational: 9,  maxNational: 9,  example: '06 12345678' },
  { iso: 'ES', name: 'Spain',          dial: '34',  minNational: 9,  maxNational: 9,  example: '612 345 678' },
  { iso: 'IT', name: 'Italy',          dial: '39',  minNational: 9,  maxNational: 10, example: '312 345 6789' },
  { iso: 'PT', name: 'Portugal',       dial: '351', minNational: 9,  maxNational: 9,  example: '912 345 678' },
  { iso: 'AE', name: 'UAE',            dial: '971', minNational: 9,  maxNational: 9,  example: '050 123 4567' },
  { iso: 'IN', name: 'India',          dial: '91',  minNational: 10, maxNational: 10, example: '98765 43210' },
  { iso: 'AU', name: 'Australia',      dial: '61',  minNational: 9,  maxNational: 9,  example: '0412 345 678' },
  { iso: 'NZ', name: 'New Zealand',    dial: '64',  minNational: 8,  maxNational: 10, example: '021 123 4567' },
  { iso: 'SG', name: 'Singapore',      dial: '65',  minNational: 8,  maxNational: 8,  example: '9123 4567' },
  { iso: 'HK', name: 'Hong Kong',      dial: '852', minNational: 8,  maxNational: 8,  example: '9123 4567' },
  { iso: 'JP', name: 'Japan',          dial: '81',  minNational: 10, maxNational: 10, example: '090 1234 5678' },
  { iso: 'CN', name: 'China',          dial: '86',  minNational: 11, maxNational: 11, example: '138 0013 8000' },
  { iso: 'BR', name: 'Brazil',         dial: '55',  minNational: 10, maxNational: 11, example: '11 91234 5678' },
];

export const DEFAULT_COUNTRY = 'NG';

export function findByIso(iso) {
  return COUNTRIES.find((c) => c.iso === iso);
}

export function DEFAULT_COUNTRY_OBJ() {
  return findByIso(DEFAULT_COUNTRY);
}
