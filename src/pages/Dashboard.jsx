import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { getTasks, getComments, addTask } from '../services/storage'
import useStorageSync from '../hooks/useStorageSync'

function smallDate(ts){ if(!ts) return ''; const d=new Date(ts); return d.toLocaleString() }

export default function Dashboard(){
  const { user, signout, updatePassword, updateProfile } = useAuth()
  const [tasks, setTasks] = useState(getTasks())
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('users')||'[]'))
  const [online, setOnline] = useState(JSON.parse(localStorage.getItem('online')||'{}'))
  const [showModal, setShowModal] = useState(false)
  const [curPass, setCurPass] = useState(''); const [newPass, setNewPass] = useState(''); const [err, setErr] = useState('')

  function refresh(){ setTasks(getTasks()); setUsers(JSON.parse(localStorage.getItem('users')||'[]')); setOnline(JSON.parse(localStorage.getItem('online')||'{}')) }
  useStorageSync(refresh)
  useEffect(()=> {
    window.addEventListener('presence-update', refresh)
    window.addEventListener('tasks-updated', refresh)
    return ()=> { window.removeEventListener('presence-update', refresh); window.removeEventListener('tasks-updated', refresh) }
  },[])

  function handleSavePass(){
    try{ updatePassword(curPass, newPass); setShowModal(false); alert('Password updated') } catch(ex){ setErr(ex.message) }
  }

  return (
    <div>
      <header className="topbar">
        <div className="logo">Tasker</div>
        <div className="actions">
          <Link to="/create" className="btn">Create Task</Link>
          <div className="profile">
            <img src={user.photo} alt="" className="avatar" />
            <div className="profile-info">
              <strong>{user.name}</strong><div className="muted">{user.email}</div>
              <div className="profile-links">
                <button className="link" onClick={()=>setShowModal(true)}>Update Password</button>
                <button className="link" onClick={signout}>Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <aside className="card sidebar">
          <h3>Users</h3>
          <div className="users-list">
            {users.map(u=>{
              const isOn = online[u.id] && (Date.now() - online[u.id] < 1000*60*5)
              return (<div className="user-item" key={u.id}>
                <img src={u.photo} alt="" className="avatar-small" />
                <div>
                  <div><strong>{u.name}</strong> {isOn && <span className="online-badge" />}</div>
                  <div className="muted small">{u.email}</div>
                </div>
              </div>)
            })}
          </div>
        </aside>

        <section className="card content">
          <h2>Your Tasks</h2>
          <div className="tasks-grid">
            {tasks.length===0 && <div className="muted">No tasks yet.</div>}
            {tasks.map(t => (
              <div className="task-card" key={t.id}>
                {t.image && <img src={t.image} alt="" className="task-image" />}
                <h4><a href={'/task/'+t.id}>{t.title}</a></h4>
                <div className="muted">{t.description?.slice(0,120)}</div>
                <div className="task-meta">{t.ownerName} · <small>{t.dueDate || ''}</small></div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showModal && <div className="modal">
        <div className="modal-card">
          <h3>Update Password</h3>
          <label>Current<input type="password" value={curPass} onChange={e=>setCurPass(e.target.value)} /></label>
          <label>New<input type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} /></label>
          {err && <div className="error">{err}</div>}
          <div className="row">
            <button className="btn" onClick={handleSavePass}>Save</button>
            <button className="btn ghost" onClick={()=>{setShowModal(false); setErr('')}}>Cancel</button>
          </div>
        </div>
      </div>}
    </div>
  )
}
