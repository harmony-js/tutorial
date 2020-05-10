import React, { useState, useCallback } from 'react'

import ServiceTodo from '../../../services/todo'

export default function NewTodo({ list }) {
  const [description,setDescription] = useState('')
  const changeDescription = useCallback((e) => setDescription(e.target.value), [setDescription])

  const onCreateSubmit = useCallback(async (e) => {
    e.preventDefault()

    if(description) {
      await ServiceTodo.create(list, description)
    }

    setDescription('')
  }, [list, description])

  return (
    <form onSubmit={onCreateSubmit} className="row padding--md">
      <div className="col col--8">
        <input
          type="text"
          name="new-list"
          placeholder="New todo"
          className="button button--block button--outline button--primary text--left"
          value={description}
          onChange={changeDescription}
        />
      </div>
      <div className="col col--4">
        <button
          type="submit"
          onClick={onCreateSubmit}
          className="button button--block button--primary"
        >
          Create
        </button>
      </div>
    </form>
  )
}
