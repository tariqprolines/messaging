import React from 'react'
import './Header.css'

const Header = ({ onLogout }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Messaging Portal</h1>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}

export default Header
