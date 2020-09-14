import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import { Container } from 'reactstrap'
import { LOGIN_PATH } from 'constants/paths'
import BulletList from '../Bullets'
import './HomePage.css'

function Home() {

  const auth = useSelector(({ firebase }) => firebase.auth)
  const authExists = isLoaded(auth) && !isEmpty(auth)

  return (
    <Container className="homepage-container">
      {authExists ? (
        <BulletList />
      ) : (
          <Link to={LOGIN_PATH} data-test="sign-in">Sign In</Link>
        )}
    </Container>
  )
}

export default Home
