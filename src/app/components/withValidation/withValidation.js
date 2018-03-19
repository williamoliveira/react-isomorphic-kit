/* eslint-disable no-shadow */
import isEmpty from 'lodash/isEmpty'
import React, { Component } from 'react'
import { getErrors, getErrorsWithState } from '../../utils/validator'

const withValidation = ({ rules = {}, validateOn = 'touched' } = {}) => (WrappedComponent) => {
  class Wrapper extends Component {
    constructor(props) {
      super(props)

      if (props.validation) {
        console.warn('"validation" found on props, nested validation?')
      }

      this.state = {
        rules,
        errors: {},
        touched: {},
        dirty: {},
        triedSubmitting: false,
        validateOn,
      }

      this.isValid = this.isValid.bind(this)
      this.setDirty = this.setDirty.bind(this)
      this.setTouched = this.setTouched.bind(this)
      this.setRules = this.setRules.bind(this)
      this.validateAll = this.validateAll.bind(this)
    }

    componentWillReceiveProps(newProps) {
      const { model: oldModel } = this.props
      const { model } = newProps

      Object.keys(model).forEach((key) => {
        if (!oldModel[key] && model[key]) {
          this.setDirty(key)
        }
      })
    }

    /**
     * @param {object} rules
     */
    setRules(rules) {
      this.setState(() => ({
        rules,
      }))
    }

    /**
     * @param {string} key
     * @param {string} statusType
     * @param {Function} callback
     */
    setStatus(key, statusType, callback) {
      this.setState(
        prevState => ({
          [statusType]: {
            ...prevState[statusType],
            [key]: {
              ...prevState[statusType][key],
              [statusType]: true,
            },
          },
        }),
        () => this.updateErrors(callback),
      )
    }

    /**
     * @param {string} key
     * @param {Function} callback
     */
    setDirty(key, callback) {
      this.setStatus(key, 'dirty', callback)
    }

    /**
     * @param {string} key
     * @param {Function} callback
     */
    setTouched(key, callback) {
      this.setStatus(key, 'touched', callback)
    }

    /**
     * @returns {Promise}
     */
    updateErrors() {
      const { model } = this.props
      const { triedSubmitting, rules, dirty, touched, validateOn } = this.state

      const getErrorFun = triedSubmitting
        ? // display all errors after user tried submitting
        getErrors
        : // display errors only on touched/changed field
        getErrorsWithState(validateOn === 'touched' ? touched : dirty)

      return new Promise((resolve) => {
        getErrorFun(model, rules).then((errors) => {
          this.setState(() => ({ errors }), () => resolve(errors))
        })
      })
    }

    /**
     * @returns {boolean}
     */
    isValid() {
      const { errors } = this.state

      return isEmpty(errors)
    }

    /**
     * @returns {Promise}
     */
    validateAll() {
      return new Promise((resolve) => {
        this.setState(
          () => ({ triedSubmitting: true }),
          () => this.updateErrors().then(() => resolve(this.isValid())),
        )
      })
    }

    render() {
      const { errors, dirty, touched } = this.state

      const validation = {
        errors,
        dirty,
        touched,
        isValid: this.isValid,
        setDirty: this.setDirty,
        setTouched: this.setTouched,
        setRules: this.setRules,
        validateAll: this.validateAll,
      }

      return <WrappedComponent validation={validation} {...this.props} />
    }
  }

  Wrapper.displayName = `withValidation(${WrappedComponent.displayName || WrappedComponent.name})`

  return Wrapper
}

export default withValidation
