import React, { useState, useCallback, useEffect } from 'react'

import ServiceClient from '../services/client'
import ServiceLogin from '../services/login'


export default function Login({ login }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const changeEmail = useCallback((e) => setEmail(e.target.value), [])
  const changePassword = useCallback((e) => setPassword(e.target.value), [])

  const onLoginSubmit = useCallback(async (e) => {
    e.preventDefault()

    const token = await ServiceLogin.login(email, password)

    if(token) {
      login(token)
    } else {
      setError('Incorrect user or password')
    }
  }, [login, email, password])
  const onSignupSubmit = useCallback(async (e) => {
    e.preventDefault()

    const user = await ServiceLogin.signup(email, password)

    if(user) {
      onLoginSubmit(e)
    } else {
      setError('Email already in use')
    }
  }, [email, password, onLoginSubmit])

  useEffect(() => {
    // Configure client on first mount, without token for login
    ServiceClient.configureClient()
  }, [])

  return (
    <div className="contents">
      <div className="card padding-bottom--md margin-top--xl shadow--md" style={{maxWidth: '480px', margin: 'auto'}}>
        <div className="card__header text--center">
          <h1>Login</h1>
        </div>

        <form onSubmit={onLoginSubmit} className="card__body text--left margin-left--xl margin-right--xl">
          <label htmlFor="email" className="text--bold">Email</label>
          <input
            type="text"
            name="email"
            className="button button--block button--outline button--primary margin--xs text--left"
            value={email}
            onChange={changeEmail}
          />
          <label htmlFor="password" className="text--bold">Password</label>
          <input
            type="password"
            name="password"
            className="button button--block button--outline button--primary margin--xs text--left"
            value={password}
            onChange={changePassword}
          />

          {
            error && (
              <div className="alert alert--danger margin-top--md">
                {error}
              </div>
            )
          }

          <div className="button-group button-group--block margin--md">
            <button type="submit" onClick={onLoginSubmit} className="button button--primary">Login</button>
            <button type="button" onClick={onSignupSubmit} className="button button--secondary">Signup</button>
          </div>
        </form>
      </div>
    </div>
  )
}
