import React, { useCallback } from 'react'

import { FaTrash, FaShareAlt } from 'react-icons/all'

import ServiceList from '../../services/list'

import NewTodo from './list/new-todo'
import Todo from './list/todo'

export default function List({ list, setShareList, setCommentsTodo }) {
  const changeName = useCallback((e) => ServiceList.updateName(list._id, e.target.value), [list._id])
  const changeDescription = useCallback((e) => ServiceList.updateDescription(list._id, e.target.value), [list._id])

  const onListShare = useCallback(() => setShareList(list._id), [setShareList, list])
  const onListDelete = useCallback(() => ServiceList.delete(list._id), [list._id])

  const canDelete = ((list.todos || []).length < 1) && (list.isOwner)

  return (
    <div className="col col--4">
      <div className="card margin-vert--md">
        <div className="card__header" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)", position: 'relative' }}>
          <input
            value={list.name}
            onChange={changeName}
            placeholder="Title"
            className="button button--link button--lg button--block text--left padding--xs"
          />
          <input
            value={list.description}
            onChange={changeDescription}
            placeholder="Description"
            className="button button--link button--md button--block text--left padding--xs"
          />
          <p className="padding--xs margin-bottom--md">
            {list.info.nbTotal} todo{list.info.nbTotal > 1 ? 's' : ''}
            {', '}
            {list.info.nbPending} pending
            {', '}
            {list.info.nbDone} done!
          </p>

          {
            list.isOwner && (
              <div
                className="actions row margin-horiz--xs "
                style={{ position: 'absolute', top: '1rem', right: '1rem' }}
              >
                <button
                  onClick={onListShare}
                  className="padding-horiz--xs button button--sm button--outline button--primary text--left"
                  style={{ border: 0 }}
                >
                  &nbsp;
                  <FaShareAlt />
                  &nbsp;
                  { list.sharedTo.length }
                  &nbsp;
                </button>

                <button
                  onClick={canDelete ? onListDelete : undefined}
                  className={"padding-horiz--md button button--sm button--outline button--danger text--left" + (canDelete ? '' : ' disabled')}
                  style={{ border: 0 }}
                >
                  <FaTrash />
                </button>
              </div>
            )
          }
        </div>
        <div className="card__body">
          {
            (list.todos || []).map((todo) => (<Todo key={todo._id} todo={todo} list={list._id} setCommentsTodo={setCommentsTodo} />))
          }
          <NewTodo list={list._id} />
        </div>
      </div>
    </div>
  )
}
