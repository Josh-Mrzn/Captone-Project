import { useState, useEffect } from 'react'
import Login from './landing/login/login'
import Landing from './landing/landing'
import './App.css'

function App() {
  return (
    <>
      {isLoggedIn ? (
        <Landing onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

export default App
