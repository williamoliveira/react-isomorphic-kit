import * as validators from './validators'

export const required =
  [validators.required, 'Campo obrigatório.']

export const hasLengthGreaterThanOrEqual = num =>
  [hasLengthGreaterThanOrEqual(num), `Deve conter no mínimo ${num} caracteres.`]
