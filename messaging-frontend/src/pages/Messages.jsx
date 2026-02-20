import React, { useState } from 'react'
import { useMessages, useSendMessage, useRetryMessage } from '../hooks/useMessages'
import { useClients } from '../hooks/useClients'
import { useTemplates } from '../hooks/useTemplates'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import './Messages.css'

const Messages = () => {
  const { data: messages = [], isLoading: messagesLoading } = useMessages()
  const { data: clients = [] } = useClients()
  const { data: templates = [] } = useTemplates()
  const sendMessage = useSendMessage()
  const retryMessage = useRetryMessage()

  const [showComposer, setShowComposer] = useState(false)
  const [formData, setFormData] = useState({
    client_contact_id: '',
    template_id: '',
    content: '',
    message_type: 'sms',
  })
  const [statusFilter, setStatusFilter] = useState('all')

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === parseInt(templateId))
    if (template) {
      setFormData({ ...formData, template_id: templateId, content: template.content })
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!formData.client_contact_id || !formData.content.trim()) {
      alert('Please select a client and enter message content')
      return
    }

    try {
      await sendMessage.mutateAsync({
        client_contact_id: parseInt(formData.client_contact_id),
        content: formData.content.trim(),
        message_type: formData.message_type,
      })
      setFormData({
        client_contact_id: '',
        template_id: '',
        content: '',
        message_type: 'sms',
      })
      setShowComposer(false)
      alert('Message sent successfully!')
    } catch (error) {
      alert('Failed to send message: ' + (error.response?.data?.detail || error.message))
    }
  }

  const handleRetry = async (messageId) => {
    try {
      await retryMessage.mutateAsync(messageId)
      alert('Message retry initiated!')
    } catch (error) {
      alert('Failed to retry message: ' + (error.response?.data?.detail || error.message))
    }
  }

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      queued: 'status-queued',
      sending: 'status-sending',
      sent: 'status-sent',
      delivered: 'status-delivered',
      failed: 'status-failed',
    }
    return statusClasses[status] || 'status-unknown'
  }

  const filteredMessages = statusFilter === 'all'
    ? messages
    : messages.filter((msg) => msg.status === statusFilter)

  const clientOptions = clients.map((client) => ({
    value: client.id.toString(),
    label: `${client.name} (${client.phone})`,
  }))

  const templateOptions = templates.map((template) => ({
    value: template.id.toString(),
    label: template.name,
  }))

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1>Messages</h1>
        <Button onClick={() => setShowComposer(!showComposer)}>
          {showComposer ? 'Hide Composer' : 'Send Message'}
        </Button>
      </div>

      {showComposer && (
        <div className="message-composer">
          <h2>Send Message</h2>
          <form onSubmit={handleSend}>
            <Select
              label="Select Client"
              value={formData.client_contact_id}
              onChange={(e) => setFormData({ ...formData, client_contact_id: e.target.value })}
              options={clientOptions}
              required
            />
            <Select
              label="Use Template (Optional)"
              value={formData.template_id}
              onChange={(e) => {
                setFormData({ ...formData, template_id: e.target.value })
                if (e.target.value) {
                  handleTemplateSelect(e.target.value)
                }
              }}
              options={[{ value: '', label: 'None' }, ...templateOptions]}
            />
            <div className="form-group">
              <label className="form-label">Message Content</label>
              <textarea
                className="form-input"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                required
                placeholder="Enter your message..."
              />
            </div>
            <Select
              label="Message Type"
              value={formData.message_type}
              onChange={(e) => setFormData({ ...formData, message_type: e.target.value })}
              options={[
                { value: 'sms', label: 'SMS' },
                { value: 'email', label: 'Email' },
              ]}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <Button type="submit" disabled={sendMessage.isLoading}>
                {sendMessage.isLoading ? 'Sending...' : 'Send Message'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowComposer(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="messages-filters">
        <Select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Messages' },
            { value: 'pending', label: 'Pending' },
            { value: 'sent', label: 'Sent' },
            { value: 'delivered', label: 'Delivered' },
            { value: 'failed', label: 'Failed' },
          ]}
        />
      </div>

      {messagesLoading ? (
        <LoadingSpinner text="Loading messages..." />
      ) : filteredMessages.length === 0 ? (
        <div className="empty-state">
          <p>No messages found.</p>
        </div>
      ) : (
        <div className="messages-list">
          {filteredMessages.map((message) => {
            const client = clients.find((c) => c.id === message.client_contact_id)
            return (
              <div key={message.id} className="message-card">
                <div className="message-header">
                  <div>
                    <strong>{client?.name || 'Unknown Client'}</strong>
                    <span className="message-phone">{client?.phone}</span>
                  </div>
                  <span className={`status-badge ${getStatusBadgeClass(message.status)}`}>
                    {message.status}
                  </span>
                </div>
                <div className="message-content">{message.content}</div>
                <div className="message-footer">
                  <span className="message-date">
                    {new Date(message.created_at).toLocaleString()}
                  </span>
                  {message.status === 'failed' && (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => handleRetry(message.id)}
                      disabled={retryMessage.isLoading}
                    >
                      Retry
                    </Button>
                  )}
                  {message.error_message && (
                    <span className="error-message-text">Error: {message.error_message}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Messages
