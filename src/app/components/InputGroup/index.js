import React from 'react'
import { FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import pure from 'recompose/pure'

export const InputGroupWrapper = pure((props) => {
  const {
    validation, label, id, children, render,
  } = props
  const errors = validation && validation.errors[id]

  return (
    <FormGroup color={errors ? 'danger' : null}>
      <Label for={id}>{label}</Label>
      {children || render(props)}
      {errors && (
        <FormFeedback style={{ display: 'block !important' }}>{errors[0]}</FormFeedback>
      )}
    </FormGroup>
  )
})

const InputGroup = pure((props) => {
  const {
    validation, bindInput, label, id, type = 'text', ...rest
  } = props
  const errors = validation && validation.errors[id]

  return (
    <InputGroupWrapper {...props}>
      <Input
        type={type}
        id={id}
        placeholder={label}
        onBlur={() => validation.setTouched(id)}
        valid={errors ? false : undefined}
        {...(bindInput ? bindInput(id) : {})}
        {...rest}
      />
    </InputGroupWrapper>
  )
})

export default InputGroup
