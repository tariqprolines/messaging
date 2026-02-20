import React, { useState } from 'react'
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../hooks/useClients'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'
import ClientForm from '../components/clients/ClientForm'
import './Clients.css'

const Clients = () => {
  const { data: clients = [], isLoading, error } = useClients()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()
  const deleteClient = useDeleteClient()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const handleCreate = () => {
    setEditingClient(null)
    setIsModalOpen(true)
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient.mutateAsync(id)
      } catch (error) {
        alert('Failed to delete client: ' + (error.response?.data?.detail || error.message))
      }
    }
  }

  const handleSubmit = async (formData) => {
    try {
      if (editingClient) {
        await updateClient.mutateAsync({ id: editingClient.id, data: formData })
      } else {
        await createClient.mutateAsync(formData)
      }
      setIsModalOpen(false)
      setEditingClient(null)
    } catch (error) {
      alert('Failed to save client: ' + (error.response?.data?.detail || error.message))
    }
  }

  const filteredClients = clients.filter((client) =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <LoadingSpinner text="Loading clients..." />
  }

  if (error) {
    return <ErrorMessage message="Failed to load clients. Please try again." />
  }

  return (
    <div className="clients-page">
      <div className="page-header">
        <h1>Client Contacts</h1>
        <Button onClick={handleCreate}>Add Client</Button>
      </div>

      <div className="clients-search">
        <input
          type="text"
          placeholder="Search clients by name, phone, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? 'No clients found matching your search.' : 'No clients yet. Add your first client to get started!'}</p>
        </div>
      ) : (
        <div className="clients-table-container">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                  <td>{client.email || '-'}</td>
                  <td>{new Date(client.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={() => handleEdit(client)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="danger"
                        onClick={() => handleDelete(client.id)}
                        disabled={deleteClient.isLoading}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingClient(null)
        }}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
      >
        <ClientForm
          client={editingClient}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false)
            setEditingClient(null)
          }}
          isLoading={createClient.isLoading || updateClient.isLoading}
        />
      </Modal>
    </div>
  )
}

export default Clients
