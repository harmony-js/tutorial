import React, { useState, useCallback, useEffect } from 'react'

import Login from './login'
import Main from './main'

export default function App() {
  const [token, setToken] = useState(null)

  // Login function - sets and saves a new token
  const login = useCallback((token) => {
    window.localStorage.setItem('token', token)
    setToken(token)
  }, [])

  // Logout function - erases and unsets the token
  const logout = useCallback(() => {
    window.localStorage.removeItem('token')
    setToken(null)
  }, [])

  // On mount: check if a token was previously saved and restore it
  useEffect(() => {
    const savedToken = window.localStorage.getItem('token')

    if(savedToken) {
      login(savedToken)
    }
  }, [login])

  if(!token) {
    return <Login login={login} />
  }

  return <Main logout={logout} token={token} />
}
