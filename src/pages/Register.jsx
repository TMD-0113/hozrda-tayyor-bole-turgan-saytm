import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Register(){
  const { register } = useAuth()
  const nav = useNavigate()
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [photo,setPhoto]=useState(''); const [err,setErr]=useState('')
  async function submit(e){ e.preventDefault(); setErr(''); try{ register({name, email: email.trim().toLowerCase(), pass, photo}); nav('/dashboard') }catch(ex){ setErr(ex.message) } }
  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Register</h2>
        <form onSubmit={submit}>
          <label>Full name<input value={name} onChange={e=>setName(e.target.value)} /></label>
          <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} /></label>
          <label>Password<input type="password" value={pass} onChange={e=>setPass(e.target.value)} /></label>
          <label>Photo URL<input value={photo} onChange={e=>setPhoto(e.target.value)} placeholder="optional" /></label>
          <div className="row"><button className="btn">Register</button></div>
          {err && <div className="error">{err}</div>}
        </form>
      </div>
    </div>
  )
}
