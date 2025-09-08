import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getTasks, getComments, addComment } from '../services/storage'
import { useAuth } from '../auth/AuthContext'

export default function TaskDetail(){
  const { id } = useParams()
  const [task, setTask] = useState(null)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const { user } = useAuth()

  useEffect(()=> {
    setTask(getTasks().find(t=>t.id===id))
    setComments(getComments().filter(c=>c.taskId===id))
    function onUpdate(){ setTask(getTasks().find(t=>t.id===id)); setComments(getComments().filter(c=>c.taskId===id)) }
    window.addEventListener('tasks-updated', onUpdate)
    return ()=> window.removeEventListener('tasks-updated', onUpdate)
  },[id])

  function send(){
    if (!text.trim()) return
    addComment({ id:'c_'+Date.now(), taskId:id, text:text.trim(), authorId:user.id, authorName: user.name, createdAt: Date.now() })
    setText('')
    setComments(getComments().filter(c=>c.taskId===id))
  }

  if (!task) return <div className="card muted">Task not found. <Link to="/dashboard">Back</Link></div>

  return (
    <div className="container">
      <div className="card task-detail">
        <h2>{task.title}</h2>
        {task.image && <img src={task.image} alt="" className="task-image" />}
        <div className="muted small">By {task.ownerName} · {task.dueDate || ''}</div>
        <p>{task.description}</p>
        <hr/>
        <h3>Comments</h3>
        <div>
          {comments.map(c=>(
            <div className="comment" key={c.id}>
              <div className="comment-meta"><strong>{c.authorName}</strong> <span className="muted small">{new Date(c.createdAt).toLocaleString()}</span></div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>
        <div className="row">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment" />
          <button className="btn" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}
