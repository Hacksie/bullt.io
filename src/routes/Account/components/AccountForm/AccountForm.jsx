import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Button, Input, Label, Form, FormGroup } from 'reactstrap'
import { validateEmail } from 'utils/form'
import ProviderDataForm from '../ProviderDataForm'

function AccountForm({ account, onSubmit }) {
  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting, isValid }
  } = useForm({
    mode: 'onChange',
    nativeValidation: false,
    defaultValues: account
  })

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="form-vertical">
      <FormGroup row>
        <Label for="displayName">Name</Label>
        <Input name="displayName" label="Display Name" inputRef={register} />
      </FormGroup>
      <FormGroup row>
        <Input
          type="email"
          name="email"
          placeholder="email"
          inputRef={register({
            required: true,
            validate: validateEmail
          })}
          error={!!errors.email}
          helperText={errors.email && 'Email must be valid'}
        />
      </FormGroup>
      {!!account && !!account.providerData && (
        <div>
          <h6>Linked Accounts</h6>
          <ProviderDataForm providerData={account.providerData} />
        </div>
      )}
      <Button color="primary" type="submit" disabled={isSubmitting || !isValid}>
        {isSubmitting ? 'Saving' : 'Save'}
      </Button>
    </Form>
  )
}

AccountForm.propTypes = {
  account: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
}

export default AccountForm
