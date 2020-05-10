import React, { useState, useCallback } from 'react'

import ServiceList from '../../services/list'

export default function PanelShare({ list }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onCardClick = useCallback((e) => e.stopPropagation(), [])
  const onEmailChange = useCallback((e) => setEmail(e.target.value), [])
  const onListShare = useCallback(async (e) => {
    e.preventDefault()

    if(email) {
      setEmail('')
      setError('')
      setSuccess('')
      try {
        await ServiceList.share(list._id, email)

        setSuccess(email)
      } catch(err) {
        setError(email)
      }
    }
  }, [list, email])

  return (
    <div onClick={onCardClick} className="card" style={{ position: "relative", top: "10rem", maxWidth: "40rem", margin: "auto" }}>
      <div className="card__header text--left padding-bottom--md" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)", position: 'relative' }}>
        <span className="text--bold text--primary">{list.name}</span>
        <br />
        <span className="text--semibold text--primary" style={{ fontSize: "0.8em"}}>{list.description}</span>
        <br />
      </div>
      <div className="card__body">
        <form onSubmit={onListShare} className="row row--align-center margin-horiz--md">
          <div className="col col--8">
            <input value={email} onChange={onEmailChange} className="button button--block button--outline button--primary text--left" />
          </div>
          <div className="col col--4">
            <button type="submit" onClick={onListShare} className="button button--block button--primary">
              Share
            </button>
          </div>
        </form>

        {
          error && (
            <div className="alert alert--danger margin-top--md">
              No user with email {error}
            </div>
          )
        }

        {
          success && (
            <div className="alert alert--success margin-top--md">
             Successfully shared with {success}
            </div>
          )
        }

        <p className="text--bold text--left margin-top--md">Shared with:</p>
        <p className="padding-horiz--md">
          {
            (list.sharedTo || []).length ? (
              list.sharedTo.map(user => (<p key={user._id} className="text--primary text--left text--bold">{user.email}</p>))
            ) : (
              <p className="alert alert--secondary">
                No one
              </p>
            )
          }
        </p>
      </div>
    </div>
  )
}
