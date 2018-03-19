import get from 'lodash/get'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

export const getErrors = (inputData, validationRules, globalOptions) => {
  const errors = {}
  const promises = []

  const addError = (key, errorMessage) => {
    if (!(key in errors)) errors[key] = []

    errors[key].push(errorMessage)
  }

  Object.entries(validationRules).forEach(([key, rules]) => {
    const value = get(inputData, key)

    rules.filter(rule => !!rule).forEach((rule) => {
      const [validator, message, validatorOptions] = Array.isArray(rule)
        ? rule // Array syntax
        : [rule.validator, rule.message, rule.options] // Object syntax

      // same props are used for the validator and message functions
      const props = [
        value,
        key,
        inputData,
        validationRules,
        validatorOptions,
        globalOptions,
      ]

      const result = validator(...props)

      const addResult = (valid) => {
        if (!valid) {
          const errorMessage =
            typeof message === 'function'
              ? message(...props) // String maker
              : message // String

          addError(key, errorMessage)
        }
      }

      if (result.then) {
        // promise
        promises.push(result)
        result.then(addResult)
      } else {
        // sync
        addResult(result)
      }
    })
  })

  return Promise.all(promises).then(() => errors)
}

export const getErrorsWithState = state => (inputData, validationRules, ...rest) => {
  const only = Object.keys(pickBy(state, identity))
  const activeRules = pick(validationRules, only)

  return getErrors(inputData, activeRules, ...rest)
}

//
// const rules = {
//   name: [
//     [hasLengthGreaterThan(6), 'Minimum length of 6 is required.'],
//     [hasCapitalLetter, 'Should contain at least one uppercase letter.'],
//   ],
//   age: [
//     [isGreaterOrEqualsThan(18), 'Minimum age required is 18.'],
//   ],
//   password: [
//     [hasLengthGreaterThan(6), 'Minimum length of 6 is required.'],
//   ],
//   passwordRepeat: [
//     // Alternative rule syntax as an object
//     {
//       validator: passwordMatches('password'),
//       // Message can also be a function
//       message: (value, key, inputData, validationRules, validatorOptions) =>
//         `Must be equals to field ${validatorOptions.fieldName}`,
//       // You can pass options which will be passed as the
//       // 5th argument for validator and message function
//       options: { fieldName: 'Password' },
//     },
//   ],
// }
//
// const inputData = {
//   name: 'phil',
//   age: 17,
//   password: '12345678',
//   passwordRepeat: '1234567',
// }
//
// // You can pass an global options object as the 3rd
// // argument which will be passed as the 6th argument
// // for validator and message function
// const errors = getErrors(inputData, rules)
//
// // {
// //  name: [ 'Minimum length of 6 is required.',
// 'Should contain at least one uppercase letter.' ],
// //  age: [ 'Minimum age required is 18.' ],
// //  passwordRepeat: [ 'Must be equals to field Password' ]
// // }
