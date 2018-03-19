import React from 'react'
import Helmet from 'react-helmet-async'
import { compose } from 'recompose'
import reformed from 'react-reformed'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Row,
  Col,
  Form,
  CardFooter,
} from 'reactstrap'
import redirectIf from '../../../redirectIf'
import withValidation from '../../../withValidation'
import { required } from '../../../../utils/validator/rules'
import InputGroup from '../../../InputGroup'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount() {
    const { setModel, validation } = this.props

    setModel({
      username: '',
      password: '',
    })

    validation.setRules({
      username: [[required, 'Campo obrigatório.']],
      password: [[required, 'Campo obrigatório.']],
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const { attemptLogin, validation, model } = this.props

    validation.validateAll().then((valid) => {
      if (!valid) return
      attemptLogin(model)
    })
  }

  render() {
    const { bindInput, validation, isLoading } = this.props

    return (
      <div className="full-height" style={{ backgroundColor: '#EEE' }}>
        <Helmet>
          <title>Login</title>
        </Helmet>

        <div className="container">
          <Row className="justify-content-center">
            <Col md={6} className="mt-md-5">
              <Form onSubmit={this.handleSubmit}>
                <h2>Login</h2>
                <Card>
                  <CardBody>
                    <InputGroup
                      id="username"
                      label="Nome de usuário"
                      {...{ bindInput, validation }}
                    />

                    <InputGroup
                      id="password"
                      label="Senha"
                      type="password"
                      {...{ bindInput, validation }}
                    />
                  </CardBody>
                  <CardFooter>
                    <Button color="primary" type="submit" disabled={isLoading}>
                      Login
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default compose(
  redirectIf(({ isAuthenticated }) => isAuthenticated, '/'),
  reformed(),
  withValidation(),
)(Login)
