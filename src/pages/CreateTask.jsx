import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { addTask } from '../services/storage'

export default function CreateTask(){
  const { user } = useAuth()
  const nav = useNavigate()
  const [title,setTitle]=useState(''); const [desc,setDesc]=useState(''); const [due,setDue]=useState(''); const [image,setImage]=useState(''); const [err,setErr]=useState('')

  function save(e){
    e.preventDefault(); setErr('')
    if (!title) { setErr('Title required'); return; }
    const t = { id:'t_'+Date.now(), title, description:desc, dueDate:due || null, image: image || null, ownerId: user.id, ownerName: user.name, createdAt: Date.now() }
    addTask(t)
    nav('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Create Task</h2>
        <form onSubmit={save}>
          <label>Title<input value={title} onChange={e=>setTitle(e.target.value)} /></label>
          <label>Description<textarea value={desc} onChange={e=>setDesc(e.target.value)} /></label>
          <label>Due date<input type="date" value={due} onChange={e=>setDue(e.target.value)} /></label>
          <label>Image URL<input value={image} onChange={e=>setImage(e.target.value)} /></label>
          <div className="row">
            <button className="btn">Save</button>
            <button type="button" className="btn ghost" onClick={()=>nav('/dashboard')}>Cancel</button>
          </div>
          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  )
}
