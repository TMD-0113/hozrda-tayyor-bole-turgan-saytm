import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const [email,setEmail] = useState(''); const [pass,setPass]=useState(''); const [err,setErr]=useState('')
  async function submit(e){
    e.preventDefault(); setErr('')
    try{ login(email.trim().toLowerCase(), pass); nav('/dashboard') } catch(ex){ setErr(ex.message) }
  }
  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Login</h2>
        <form onSubmit={submit}>
          <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label>Password<input type="password" value={pass} onChange={e=>setPass(e.target.value)} /></label>
          <div className="row"><button className="btn">Login</button> <Link to="/register" className="muted">Register</Link></div>
          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  )
}
