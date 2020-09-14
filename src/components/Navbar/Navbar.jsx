import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import { LIST_PATH, LOGIN_PATH } from 'constants/paths'
import { NavItem, NavLink } from 'reactstrap'
import AccountMenu from './NavbarAccountMenu'
import NavbarWithoutAuth from './NavbarWithoutAuth'
import './Navbar.css'

function Navbar() {
  // Get auth from redux state
  const auth = useSelector(({ firebase }) => firebase.auth)
  const authExists = isLoaded(auth) && !isEmpty(auth)

  return (
    <NavbarWithoutAuth brandPath={authExists ? LIST_PATH : '/'}>
      {authExists ? (
        <AccountMenu />
      ) : (
        <NavItem>
          <NavLink tag={Link} className="text-dark" to={LOGIN_PATH}>
            Sign In
            <img
              className="navIcon"
              src="https://unpkg.com/ionicons@5.1.2/dist/svg/log-in-outline.svg"
              alt="account"
            />
          </NavLink>
        </NavItem>
      )}
    </NavbarWithoutAuth>
  )
}

export default Navbar
