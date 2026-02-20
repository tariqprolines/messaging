import React, { useState } from 'react'
import { useTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from '../hooks/useTemplates'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import './Templates.css'

const Templates = () => {
  const { data: templates = [], isLoading, error } = useTemplates()
  const createTemplate = useCreateTemplate()
  const updateTemplate = useUpdateTemplate()
  const deleteTemplate = useDeleteTemplate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    variables: '',
  })

  const handleCreate = () => {
    setEditingTemplate(null)
    setFormData({ name: '', content: '', variables: '' })
    setIsModalOpen(true)
  }

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name || '',
      content: template.content || '',
      variables: template.variables ? JSON.stringify(template.variables, null, 2) : '',
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await deleteTemplate.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete template: ' + (error.response?.data?.detail || error.message))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.content.trim()) {
      alert('Name and content are required')
      return
    }

    let variables = null
    if (formData.variables.trim()) {
      try {
        variables = JSON.parse(formData.variables)
      } catch (e) {
        alert('Invalid JSON format for variables')
        return
      }
    }

    try {
      const submitData = {
        name: formData.name.trim(),
        content: formData.content.trim(),
        variables: variables,
      }

      if (editingTemplate) {
        await updateTemplate.mutateAsync({ id: editingTemplate.id, data: submitData })
      } else {
        await createTemplate.mutateAsync(submitData)
      }
      setIsModalOpen(false)
      setEditingTemplate(null)
      setFormData({ name: '', content: '', variables: '' })
    } catch (error) {
      alert('Failed to save template: ' + (error.response?.data?.detail || error.message))
    }
  }

  if (isLoading) {
    return <LoadingSpinner text="Loading templates..." />
  }

  if (error) {
    return <ErrorMessage message="Failed to load templates. Please try again." />
  }

  return (
    <div className="templates-page">
      <div className="page-header">
        <h1>Message Templates</h1>
        <Button onClick={handleCreate}>Create Template</Button>
      </div>

      {templates.length === 0 ? (
        <div className="empty-state">
          <p>No templates yet. Create your first template to get started!</p>
        </div>
      ) : (
        <div className="templates-grid">
          {templates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-header">
                <h3>{template.name}</h3>
                <div className="template-actions">
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => handleEdit(template)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="danger"
                    onClick={() => handleDelete(template.id)}
                    disabled={deleteTemplate.isLoading}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="template-content">
                <p>{template.content}</p>
              </div>
              {template.variables && (
                <div className="template-variables">
                  <strong>Variables:</strong> {JSON.stringify(template.variables)}
                </div>
              )}
              <div className="template-footer">
                <span className="template-date">
                  Created: {new Date(template.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTemplate(null)
        }}
        title={editingTemplate ? 'Edit Template' : 'Create New Template'}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Template Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={createTemplate.isLoading || updateTemplate.isLoading}
          />
          <div className="form-group">
            <label className="form-label">
              Template Content
              <span className="help-text">Use variables like {'{{name}}'} or {'{{phone}}'}</span>
            </label>
            <textarea
              className="form-input"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              required
              placeholder="Hello {{name}}, your message here..."
              disabled={createTemplate.isLoading || updateTemplate.isLoading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Variables (JSON - Optional)</label>
            <textarea
              className="form-input"
              value={formData.variables}
              onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
              rows={4}
              placeholder='{"name": "John", "phone": "+1234567890"}'
              disabled={createTemplate.isLoading || updateTemplate.isLoading}
            />
            <small className="help-text">Optional: Define default variable values</small>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button
              type="submit"
              disabled={createTemplate.isLoading || updateTemplate.isLoading}
            >
              {createTemplate.isLoading || updateTemplate.isLoading
                ? 'Saving...'
                : editingTemplate
                ? 'Update Template'
                : 'Create Template'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false)
                setEditingTemplate(null)
              }}
              disabled={createTemplate.isLoading || updateTemplate.isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Templates
