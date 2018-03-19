/* eslint-disable jsx-a11y/href-no-hash */
import React from 'react'
import Link from 'react-router-dom/Link'
import NavLink from 'react-router-dom/NavLink'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
} from 'reactstrap'

const NavItemLink = ({ children, to, disabled = false }) => (
  <NavItem>
    <NavLink
      to={!disabled ? to : '/#'}
      className={`nav-link${disabled ? ' disabled' : ''}`}
      activeClassName="active"
    >
      {children}
    </NavLink>
  </NavItem>
)

class Menu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: false,
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  render() {
    return (
      <div>
        <Navbar color="primary" dark expand>
          <NavbarToggler onClick={this.toggle} />
          <Link to="/" className="navbar-brand">
            React Universal Boilerplate
          </Link>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItemLink to="/tags">Tags</NavItemLink>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}

export default Menu
