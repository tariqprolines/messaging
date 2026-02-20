import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = ({ currentPath }) => {
  const navigate = useNavigate()

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/clients', label: 'Clients', icon: '👥' },
    { path: '/messages', label: 'Messages', icon: '💬' },
    { path: '/templates', label: 'Templates', icon: '📝' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Messaging Portal</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={currentPath === item.path ? 'active' : ''}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
