import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Menu from './Menu'

const mapStateToProps = state => ({})

const actionCreators = {}

export default withRouter(connect(mapStateToProps, actionCreators)(Menu))
