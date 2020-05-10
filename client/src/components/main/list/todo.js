import React, { useCallback } from 'react'

import { FaCheckCircle, FaInfoCircle, FaRegCircle, FaTrash } from 'react-icons/all'

import ServiceTodo from '../../../services/todo.js'

export default function Todo({ todo, list, setCommentsTodo }) {
  const onToggleTodo = useCallback(() => ServiceTodo.toggle(todo, list), [todo, list])
  const onDeleteTodo = useCallback(() => ServiceTodo.delete(todo), [todo])
  const onCommentsTodo = useCallback(() => setCommentsTodo(todo._id), [todo, setCommentsTodo])

  return (
    <div className="row row--align-center padding-horiz--md">
      <button
        onClick={onToggleTodo}
        className="row row--align-center margin-right--xs padding-horiz--md button button--secondary button--outline text--left text--truncate"
        style={{ border: 0, marginLeft: '0.05rem', flex: 1 }}
      >
        { todo.status ? <FaCheckCircle className="text--primary margin-right--xs" /> : <FaRegCircle className="text--primary margin-right--xs" /> }
        <span
          className={"margin-left--xs text--truncate" + (todo.status ? ' text--primary' : '')}
          style={{
            textDecoration: todo.status ? 'line-through' : 'none'
          }}
        >
          { todo.description }
        </span>
      </button>
      <div className="row padding-horiz--md" style={{ flex: "none" }}>
        <button
          onClick={onCommentsTodo}
          className="margin-horiz--xs padding-horiz--md button button--sm button--outline button--secondary text--left"
          style={{ border: 0, marginLeft: '0.05rem' }}
        >
          <FaInfoCircle />
        </button>
        <button
          onClick={onDeleteTodo}
          className="margin-horiz--xs padding-horiz--md button button--sm button--outline button--danger text--left"
          style={{ border: 0, marginLeft: '0.05rem' }}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  )
}
