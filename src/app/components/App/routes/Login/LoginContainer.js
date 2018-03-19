import { connect } from 'react-redux'
import Login from './Login'
import { attemptLogin } from '../../../../modules/auth/actions'
import { getIsLoading, getIsAuthenticated } from '../../../../modules/auth/selectors'

const mapStateToProps = state => ({
  isLoading: getIsLoading(state),
  isAuthenticated: getIsAuthenticated(state),
})

const actionCreators = {
  attemptLogin,
}

export default connect(mapStateToProps, actionCreators)(Login)
