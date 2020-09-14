import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useFirebase } from 'react-redux-firebase'
import GoogleButton from 'react-google-button'
import { SIGNUP_PATH } from 'constants/paths'
import { useNotifications } from 'modules/notification'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import LoginForm from '../LoginForm'
import { Container } from 'reactstrap'


function LoginPage() {
  const firebase = useFirebase()
  const { showError } = useNotifications()
  const auth = useSelector(({ firebase }) => firebase.auth)
  const authExists = isLoaded(auth) && !isEmpty(auth)

  function onSubmitFail(formErrs, dispatch, err) {
    return showError(formErrs ? 'Form Invalid' : err.message || 'Error')
  }

  function googleLogin() {
    return firebase
      .login({ provider: 'google', type: 'popup' })
      .catch((err) => showError(err.message))
  }

  function emailLogin(creds) {
    return firebase.login(creds).catch((err) => showError(err.message))
  }


  if(authExists) {
    return <Redirect to='/' /> 
  }

  if(!isLoaded(auth))
  {
    return <Container><div>Loading...</div></Container>
  }


  return (
    <Container>
        <LoginForm onSubmit={emailLogin} onSubmitFail={onSubmitFail} />
      <div>or</div>
      <div>
        <GoogleButton onClick={googleLogin} data-test="google-auth-button" />
      </div>
      <div>
        <span>Need an account?</span>
        <Link to={SIGNUP_PATH}>
          Sign Up
        </Link>
      </div>
    </Container>
  )
}

export default LoginPage
