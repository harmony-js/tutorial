import React, { useEffect, useState, useCallback, useMemo } from 'react'

import { FaPowerOff } from 'react-icons/fa'

import ServiceClient from '../services/client'
import ServiceList from '../services/list'

import NewList from './main/new-list'
import List from './main/list'

import PanelShare from './main/panel-share'
import PanelComments from './main/panel-comments'

export default function Main({ logout, token }) {
  const [lists, setLists] = useState([])
  const [shareList, setShareList] = useState(null)
  const [commentsTodo, setCommentsTodo] = useState(null)

  const listForPanelShare = useMemo(() => lists.find(l => l._id === shareList), [lists, shareList])
  const listForPanelComments = useMemo(() => lists.find(l => l.todos.find(t => t._id === commentsTodo)), [lists, commentsTodo])

  const onCloseShare = useCallback(() => setShareList(null), [])
  const onCloseComments = useCallback(() => setCommentsTodo(null), [])

  useEffect(() => {
    // Configure client with token
    ServiceClient.configureClient(token)

    // Subscribe to lists
    const subscription = ServiceList.fetchAll()
      .subscribe(setLists)

    // Cancel subscription on unmount
    return () => subscription.unsubscribe(setLists)
  }, [token, setLists])

  return (
    <React.Fragment>
      <header className="navbar navbar--fixed-top">
        <div className="navbar__items">
          <div className="navbar__brand">
            Todo-lists
          </div>
        </div>
        <div className="navbar__items navbar__items--right">
          <button className="navbar__item button button--link" onClick={logout}>
            <FaPowerOff />
          </button>
        </div>
      </header>
      <main className="contents" style={{backgroundColor: "#F5F5FA", minHeight: "calc(100vh - 4rem)"}}>
        <NewList />

        <div className="container container--fluid row row--align-top">
          {
            lists.map((list) => <List list={list} setShareList={setShareList} setCommentsTodo={setCommentsTodo} />)
          }
        </div>
      </main>

      {
        listForPanelShare && (
          <div
            className="backdrop"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", textAlign: "center" }}
            onClick={onCloseShare}
          >
            <PanelShare list={listForPanelShare} />
          </div>
        )
      }

      {
        listForPanelComments && (
          <div
            className="backdrop"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", textAlign: "center" }}
            onClick={onCloseComments}
          >
            <PanelComments list={listForPanelComments} todo={commentsTodo} />
          </div>
        )
      }
    </React.Fragment>
  )
}
