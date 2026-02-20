import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import './Dashboard.css'

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboard()
  const navigate = useNavigate()

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />
  }

  const {
    totalMessages = 0,
    totalClients = 0,
    totalTemplates = 0,
    messagesToday = 0,
    messagesThisWeek = 0,
    deliveredMessages = 0,
    failedMessages = 0,
    recentMessages = [],
    recentClients = [],
  } = stats || {}

  const successRate = totalMessages > 0
    ? Math.round((deliveredMessages / totalMessages) * 100)
    : 0

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="quick-actions">
          <Button onClick={() => navigate('/messages')}>Send Message</Button>
          <Button variant="secondary" onClick={() => navigate('/clients')}>
            Add Client
          </Button>
          <Button variant="secondary" onClick={() => navigate('/templates')}>
            Create Template
          </Button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Messages Sent</h3>
          <p className="stat-value">{totalMessages}</p>
          <p className="stat-subtitle">
            {messagesToday} today • {messagesThisWeek} this week
          </p>
        </div>
        <div className="stat-card">
          <h3>Clients</h3>
          <p className="stat-value">{totalClients}</p>
          <p className="stat-subtitle">Total contacts</p>
        </div>
        <div className="stat-card">
          <h3>Templates</h3>
          <p className="stat-value">{totalTemplates}</p>
          <p className="stat-subtitle">Message templates</p>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <p className="stat-value">{successRate}%</p>
          <p className="stat-subtitle">
            {deliveredMessages} delivered • {failedMessages} failed
          </p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h2>Recent Messages</h2>
          {recentMessages.length === 0 ? (
            <p className="empty-text">No messages yet. Send your first message!</p>
          ) : (
            <div className="recent-list">
              {recentMessages.slice(0, 5).map((message) => (
                <div key={message.id} className="recent-item">
                  <div className="recent-item-content">
                    <strong>{message.content?.substring(0, 50)}...</strong>
                    <span className={`status-badge status-${message.status}`}>
                      {message.status}
                    </span>
                  </div>
                  <span className="recent-item-date">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Recent Clients</h2>
          {recentClients.length === 0 ? (
            <p className="empty-text">No clients yet. Add your first client!</p>
          ) : (
            <div className="recent-list">
              {recentClients.slice(0, 5).map((client) => (
                <div key={client.id} className="recent-item">
                  <div className="recent-item-content">
                    <strong>{client.name}</strong>
                    <span className="recent-item-meta">{client.phone}</span>
                  </div>
                  <span className="recent-item-date">
                    {new Date(client.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
