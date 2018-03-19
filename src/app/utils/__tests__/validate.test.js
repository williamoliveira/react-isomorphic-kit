import {
  getErrors,
  getErrorsWithState,
} from '../validator'
import {
  required,
  hasLengthGreaterThan,
  hasCapitalLetter,
  isGreaterThanOrEqual,
  sameAs,
} from '../validator/validators'

describe('validate', () => {
  describe('getErrors', () => {
    it('gets correct errors', () => {
      const rules = {
        name: [
          [hasLengthGreaterThan(6), 'Minimum length of 6 is required.'],
          [hasCapitalLetter, 'Should contain at least one uppercase letter.'],
        ],
        age: [[isGreaterThanOrEqual(18), 'Minimum age required is 18.']],
        password: [[hasLengthGreaterThan(6), 'Minimum length of 6 is required.']],
        passwordRepeat: [
          // Alternative rule syntax as an object
          {
            validator: sameAs('password'),
            // Message can also be a function
            message: (value, key, inputData, validationRules, validatorOptions) =>
              `Must be equals to field ${validatorOptions.fieldName}`,
            // You can pass options which will be passed as the
            // 5th argument for validator and message function
            options: { fieldName: 'Password' },
          },
        ],
      }

      const inputData = {
        name: 'phil',
        age: 17,
        password: '12345678',
        passwordRepeat: '1234567',
      }

      // You can pass an global options object as the 3rd
      // argument which will be passed as the 6th argument
      // for validator and message function
      const actual = getErrors(inputData, rules)

      const expected = {
        name: [
          'Minimum length of 6 is required.',
          'Should contain at least one uppercase letter.',
        ],
        age: ['Minimum age required is 18.'],
        passwordRepeat: ['Must be equals to field Password'],
      }

      expect(actual).toEqual(expected)
    })
  })

  describe('getErrors', () => {
    it('gets correct errors', () => {
      const rules = {
        name: [
          [hasLengthGreaterThan(6), 'Minimum length of 6 is required.'],
          [hasCapitalLetter, 'Should contain at least one uppercase letter.'],
        ],
        age: [[isGreaterThanOrEqual(18), 'Minimum age required is 18.']],
      }

      const inputData = {
        name: 'phil',
        age: 17,
      }

      const state = {
        name: {
          touched: true,
        },
        age: {
          touched: false,
        },
      }

      const actual = getErrorsWithState(state)(inputData, rules)

      const expected = {
        name: [
          'Minimum length of 6 is required.',
          'Should contain at least one uppercase letter.',
        ],
      }

      expect(actual).toEqual(expected)
    })
  })

  describe('required', () => {
    it('works properly', () => {
      expect(required(null)).toEqual(false)
      expect(required(undefined)).toEqual(false)
      expect(required()).toEqual(false)
      expect(required('')).toEqual(false)
      expect(required(false)).toEqual(false)
      expect(required(0)).toEqual(false)

      expect(required(' ')).toEqual(true)
      expect(required('a')).toEqual(true)
      expect(required(1)).toEqual(true)
      expect(required(0.1)).toEqual(true)
      expect(required('0')).toEqual(true)
      expect(required({})).toEqual(true)
      expect(required([])).toEqual(true)
    })
  })
})
