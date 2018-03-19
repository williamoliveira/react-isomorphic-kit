export const required = value => !!value

export const isGreaterThan = size => value => value > size

export const isGreaterThanOrEqual = size => value => value >= size

export const hasLengthGreaterThan = size => (value = '') =>
  isGreaterThan(size)(value.length)

export const hasLengthGreaterThanOrEqual = size => (value = '') =>
  isGreaterThanOrEqual(size)(value.length)

export const sameAs = key => (value, _, inputData) => value === inputData[key]

export const hasCapitalLetter = value => /[A-Z]/.test(value)

export const acceptBlank = rule => (value, ...rest) => !value || rule(value, ...rest)
