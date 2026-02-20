import React, { useState, useEffect } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import ErrorMessage from '../common/ErrorMessage'

const ClientForm = ({ client, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    extra_data: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        phone: client.phone || '',
        email: client.email || '',
        extra_data: client.extra_data ? JSON.stringify(client.extra_data, null, 2) : '',
      })
    }
  }, [client])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (formData.extra_data) {
      try {
        JSON.parse(formData.extra_data)
      } catch (e) {
        newErrors.extra_data = 'Invalid JSON format'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const submitData = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      extra_data: formData.extra_data ? JSON.parse(formData.extra_data) : null,
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        error={errors.name}
        disabled={isLoading}
      />
      <Input
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
        error={errors.phone}
        disabled={isLoading}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        disabled={isLoading}
      />
      <div className="form-group">
        <label className="form-label">Extra Data (JSON)</label>
        <textarea
          className={`form-input ${errors.extra_data ? 'error' : ''}`}
          value={formData.extra_data}
          onChange={(e) => setFormData({ ...formData, extra_data: e.target.value })}
          placeholder='{"key": "value"}'
          rows={4}
          disabled={isLoading}
        />
        {errors.extra_data && <span className="form-error">{errors.extra_data}</span>}
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : client ? 'Update Client' : 'Create Client'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default ClientForm
