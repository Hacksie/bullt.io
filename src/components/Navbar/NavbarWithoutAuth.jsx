import React from 'react'
import { Navbar, NavbarBrand, Nav } from 'reactstrap'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './Navbar.css'

function NavbarWithoutAuth({ children, brandPath = '/' }) {
  return (
    <header>
      <Navbar className="navbar-expand sticky-top mb-3">
        <NavbarBrand tag={Link} to={brandPath}>
          bullt.io
        </NavbarBrand>
        <Nav className="navbar-nav ml-auto" navbar>
          {children}
        </Nav>
      </Navbar>
    </header>
  )
}

NavbarWithoutAuth.propTypes = {
  children: PropTypes.element,
  brandPath: PropTypes.string
}

export default NavbarWithoutAuth
