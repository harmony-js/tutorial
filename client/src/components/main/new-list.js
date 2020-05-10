import React, { useState, useCallback } from 'react'

import ServiceList from '../../services/list'

export default function NewList() {
  const [name,setName] = useState('')
  const changeName = useCallback((e) => setName(e.target.value), [setName])

  const onCreateSubmit = useCallback(async (e) => {
    e.preventDefault()

    if(name) {
      await ServiceList.create(name)
    }

    setName('')
  }, [name, setName])

  return (
    <div className="card margin-top--xs" style={{maxWidth: '480px', margin: 'auto'}}>
      <form onSubmit={onCreateSubmit} className="card__body text--left">
        <div className="row">
          <div className="col col--8">
            <input
              type="text"
              name="new-list"
              placeholder="New list name"
              className="button button--block button--outline button--primary text--left"
              value={name}
              onChange={changeName}
            />
          </div>
          <div className="col col--4">
            <button
              type="submit"
              onClick={onCreateSubmit}
              className="button button--block  button--primary"
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
