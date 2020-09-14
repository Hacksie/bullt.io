import React from 'react'
import { useSelector } from 'react-redux'
import { isLoaded, useFirebase } from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import { useNotifications } from 'modules/notification'
import AccountForm from '../AccountForm'
import { Row, Col } from 'reactstrap'

function AccountEditor() {
  const { showSuccess, showError } = useNotifications()
  const firebase = useFirebase()

  // Get profile from redux state
  const profile = useSelector(({ firebase }) => firebase.profile)

  if (!isLoaded(profile)) {
    return <LoadingSpinner />
  }

  async function updateAccount(newAccount) {
    try {
      await firebase.updateProfile(newAccount)
      showSuccess('Profile updated successfully')
    } catch (err) {
      console.error('Error updating profile', err) // eslint-disable-line no-console
      showError(`Error updating profile: ${err.message}`)
    }
  }

  return (
    <Row>
      <Col>
        <AccountForm onSubmit={updateAccount} account={profile} />
      </Col>
    </Row>
  )
}

export default AccountEditor
