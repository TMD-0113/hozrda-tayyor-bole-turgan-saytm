import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function useAuth(){ return useContext(AuthContext) }

function read(key,fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch(e){return fallback} }
function write(key,val){ localStorage.setItem(key, JSON.stringify(val)) }

export function AuthProvider({children}){
  const [user, setUser] = useState(()=> {
    const s = read('session', null)
    const users = read('users', [])
    if (s && users) return users.find(u=>u.id===s.userId) || null
    return null
  })

  useEffect(()=> {
    // bootstrap demo users
    const users = read('users', null)
    if (!users) {
      write('users', [
        {id:'u_alice', name:'Alice Smith', email:'alice@example.com', pass:'alice123', photo:'https://i.pravatar.cc/150?img=32'},
        {id:'u_bob', name:'Bob Chen', email:'bob@example.com', pass:'bob123', photo:'https://i.pravatar.cc/150?img=12'}
      ])
    }
  },[])

  useEffect(()=> {
    // presence ping
    let t
    if (user) {
      const bc = new BroadcastChannel('tasker_channel')
      function ping(){ 
        const online = read('online', {})
        online[user.id] = Date.now()
        write('online', online)
        bc.postMessage({type:'ping', id:user.id, ts:Date.now()})
      }
      ping()
      t = setInterval(ping, 3000)
      return ()=> {
        clearInterval(t)
        const online = read('online', {})
        delete online[user.id]
        write('online', online)
        bc.postMessage({type:'logout', id:user.id})
        bc.close()
      }
    }
    return ()=> clearInterval(t)
  },[user])

  function login(email, pass){
    const users = read('users', [])
    const u = users.find(x=>x.email===email && x.pass===pass)
    if (!u) throw new Error('Invalid credentials')
    write('session',{userId:u.id})
    setUser(u)
  }

  function register({name,email,pass,photo}){
    const users = read('users', [])
    if (users.find(x=>x.email===email)) throw new Error('Email exists')
    const u = { id: 'u_'+Date.now(), name, email, pass, photo: photo || ('https://i.pravatar.cc/150?u='+email) }
    users.push(u); write('users', users)
    write('session',{userId:u.id})
    setUser(u)
  }

  function signout(){
    const s = read('session', null)
    if (s && s.userId) {
      const online = read('online', {})
      delete online[s.userId]
      write('online', online)
      const bc = new BroadcastChannel('tasker_channel'); bc.postMessage({type:'logout', id:s.userId}); bc.close()
    }
    localStorage.removeItem('session')
    setUser(null)
  }

  function updatePassword(current, next){
    if (!user) throw new Error('Not logged in')
    if (user.pass !== current) throw new Error('Current password incorrect')
    if (!next || next.length < 4) throw new Error('New password too short')
    const users = read('users', [])
    const updated = users.map(u => u.id===user.id ? {...u, pass: next} : u)
    write('users', updated)
    setUser(updated.find(u=>u.id===user.id))
  }

  function updateProfile(patch){
    const users = read('users', [])
    const updated = users.map(u => u.id===user.id ? {...u, ...patch} : u)
    write('users', updated)
    setUser(updated.find(u=>u.id===user.id))
  }

  return <AuthContext.Provider value={{user, login, register, signout, updatePassword, updateProfile}}>
    {children}
  </AuthContext.Provider>
}
