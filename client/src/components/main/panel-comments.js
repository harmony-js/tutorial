import React, { useState, useEffect, useCallback, useMemo } from 'react'

import ServiceTodo from '../../services/todo'

export default function PanelComments({ todo, list }) {
  const [loading,setLoading] = useState(true)
  const [comments,setComments] = useState([])
  const [comment,setComment] = useState('')

  const todoInfo = useMemo(() => list.todos.find(t => t._id === todo), [todo, list])

  const commentsCallback = useCallback((comments) => {
    setComments(comments)
    setLoading(false)
  }, [])

  const onCardClick = useCallback((e) => e.stopPropagation(), [])
  const onChangeComment = useCallback((e) => setComment(e.target.value), [])
  const onSubmitComment = useCallback(async (e) => {
    e.preventDefault()

    if(comment) {
      await ServiceTodo.comment(todo, comment)
    }

    setComment('')
  }, [todo, comment])

  const renderComment = useCallback((c) => (
    <div className="alert alert--secondary text--left text--normal margin--xs">
      <div className="text--bold">
        <span>{c.author.email}:</span>
        <span className="text--italic text--primary" style={{ float: 'right', fontSize: '0.8em' }}>
          {new Date(c.date).toLocaleString()}
        </span>
      </div>
      <div>{c.content}</div>
    </div>
  ), [])

  useEffect(() => {
    setLoading(true)

    const subscription = ServiceTodo.fetchComments(todo)
      .subscribe(commentsCallback)

    return () => subscription.unsubscribe(commentsCallback)
  }, [todo, commentsCallback])

  return (
    <div onClick={onCardClick} className="card" style={{ position: "relative", top: "10rem", maxWidth: "40rem", margin: "auto" }}>
      <div className="card__header text--left padding-bottom--md" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)", position: 'relative' }}>
        <span className="text--bold text--primary">{list.name}</span>
        <br />
        <span className="text--semibold text--primary" style={{ fontSize: "0.8em"}}>{list.description}</span>
        <br />
      </div>
      <div className="card__header text--left padding-bottom--md" style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.1)", position: 'relative' }}>
        <span className="text--semibold text--primary text--bold">{todoInfo.description}</span>
        <br />
      </div>
      <div className="card__body">
        {
          loading ? (
            <div className="alert alert--secondary">
              Loading...
            </div>
          ) : (
            <div>
              {
                comments.length ? (
                  comments.map(renderComment)
                ) : (
                  <div className="alert alert--secondary">
                    No comment yet
                  </div>
                )
              }

              <form onSubmit={onSubmitComment} className="row row--align-center padding-horiz--md margin-top--md">
                <div className="col col--8 margin-vert--xs">
                  <input value={comment} onChange={onChangeComment} className="button button--block button--primary button--outline text--left" />
                </div>
                <div className="col col--4 margin-vert--xs">
                  <button type="submit" onClick={onSubmitComment} className="button button--block button--primary">
                    Send
                  </button>
                </div>
              </form>
            </div>
          )
        }
      </div>
    </div>
  )
}
