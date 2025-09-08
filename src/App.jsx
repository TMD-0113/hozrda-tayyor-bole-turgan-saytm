import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateTask from './pages/CreateTask'
import TaskDetail from './pages/TaskDetail'

function Protected({children}) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App(){
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<Protected><Dashboard/></Protected>} />
        <Route path="/create" element={<Protected><CreateTask/></Protected>} />
        <Route path="/task/:id" element={<Protected><TaskDetail/></Protected>} />
      </Routes>
    </AuthProvider>
  )
}
