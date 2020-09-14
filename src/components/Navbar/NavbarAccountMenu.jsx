import React from 'react'
import { useFirebase } from 'react-redux-firebase'
import { Link } from 'react-router-dom'
import { NavItem, NavLink } from 'reactstrap'
import { ACCOUNT_PATH } from 'constants/paths'
import './Navbar.css'

function AccountMenu() {
  const firebase = useFirebase()

  function handleLogout() {
    return firebase.logout()
  }

  return (
    <>
      <NavItem>
        <NavLink tag={Link} className="text-dark" to={ACCOUNT_PATH}>
          <img
            className="navIcon"
            src="https://unpkg.com/ionicons@5.1.2/dist/svg/person-circle-outline.svg"
            alt="account"
          />
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          tag={Link}
          className="text-dark"
          to="#"
          onClick={() => handleLogout()}>
          <img
            className="navIcon"
            src="https://unpkg.com/ionicons@5.1.2/dist/svg/log-out-outline.svg"
            alt="account"
          />
        </NavLink>
      </NavItem>
    </>
  )
}

export default AccountMenu
