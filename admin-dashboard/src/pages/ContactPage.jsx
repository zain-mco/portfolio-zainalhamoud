import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const queryClient = useQueryClient()
  
  // Fetch contact data
  const { data: contact, isLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: contactAPI.get
  })

  // Fetch messages
  const { data: messages } = useQuery({
    queryKey: ['messages'],
    queryFn: contactAPI.getMessages
  })

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
    whatsapp: ''
  })

  // Social link state
  const [socialLinks, setSocialLinks] = useState([])
  const [newSocialLink, setNewSocialLink] = useState({
    platform: '',
    url: '',
    icon: ''
  })
  const [editingLinkIndex, setEditingLinkIndex] = useState(null)

  // Available social platforms with their default icons
  const platforms = [
    { name: 'WhatsApp', icon: 'fab fa-whatsapp' },
    { name: 'LinkedIn', icon: 'fab fa-linkedin' },
    { name: 'GitHub', icon: 'fab fa-github' },
    { name: 'Twitter', icon: 'fab fa-twitter' },
    { name: 'Instagram', icon: 'fab fa-instagram' },
    { name: 'Facebook', icon: 'fab fa-facebook' },
    { name: 'YouTube', icon: 'fab fa-youtube' },
    { name: 'Telegram', icon: 'fab fa-telegram' },
    { name: 'Discord', icon: 'fab fa-discord' },
    { name: 'Email', icon: 'fas fa-envelope' }
  ]

  // Update form data when contact loads
  useEffect(() => {
    if (contact) {
      setFormData({
        email: contact.email || '',
        phone: contact.phone || '',
        location: contact.location || '',
        whatsapp: contact.whatsapp || ''
      })
      setSocialLinks(contact.socialLinks || [])
    }
  }, [contact])

  // Update contact mutation
  const updateMutation = useMutation({
    mutationFn: (data) => contactAPI.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['contact'])
      toast.success('Contact information updated successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update contact information')
    }
  })

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (id) => contactAPI.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
      toast.success('Message deleted successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete message')
    }
  })

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id) => contactAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to mark message as read')
    }
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate({
      ...formData,
      socialLinks
    })
  }

  const handleAddSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      toast.error('Please fill in platform and URL')
      return
    }

    if (editingLinkIndex !== null) {
      // Edit existing link
      const updated = [...socialLinks]
      updated[editingLinkIndex] = newSocialLink
      setSocialLinks(updated)
      setEditingLinkIndex(null)
      toast.success('Social link updated!')
    } else {
      // Add new link
      setSocialLinks([...socialLinks, newSocialLink])
      toast.success('Social link added!')
    }

    setNewSocialLink({ platform: '', url: '', icon: '' })
  }

  const handleEditSocialLink = (index) => {
    setNewSocialLink(socialLinks[index])
    setEditingLinkIndex(index)
  }

  const handleDeleteSocialLink = (index) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index))
    toast.success('Social link removed!')
  }

  const handlePlatformChange = (platform) => {
    const platformData = platforms.find(p => p.name === platform)
    setNewSocialLink({
      ...newSocialLink,
      platform,
      icon: platformData?.icon || 'fas fa-link'
    })
  }

  const handleDeleteMessage = (id) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteMessageMutation.mutate(id)
    }
  }

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id)
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Contact Information</h1>

      {/* Contact Info Form */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="input"
                placeholder="971504235113"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Contact Info'}
          </button>
        </form>
      </div>

      {/* Social Links Management */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Social Media Links</h2>
        
        {/* Add/Edit Social Link */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">
            {editingLinkIndex !== null ? 'Edit Social Link' : 'Add New Social Link'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Platform</label>
              <select
                value={newSocialLink.platform}
                onChange={(e) => handlePlatformChange(e.target.value)}
                className="input"
              >
                <option value="">Select Platform</option>
                {platforms.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL</label>
              <input
                type="url"
                value={newSocialLink.url}
                onChange={(e) => setNewSocialLink({...newSocialLink, url: e.target.value})}
                className="input"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Icon Class</label>
              <input
                type="text"
                value={newSocialLink.icon}
                onChange={(e) => setNewSocialLink({...newSocialLink, icon: e.target.value})}
                className="input"
                placeholder="fab fa-linkedin"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={handleAddSocialLink}
              className="btn-primary"
            >
              {editingLinkIndex !== null ? 'Update Link' : 'Add Link'}
            </button>
            {editingLinkIndex !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingLinkIndex(null)
                  setNewSocialLink({ platform: '', url: '', icon: '' })
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Current Social Links */}
        <div className="space-y-3">
          <h3 className="font-medium">Current Links</h3>
          {socialLinks.length === 0 ? (
            <p className="text-gray-500 text-sm">No social links added yet</p>
          ) : (
            <div className="space-y-2">
              {socialLinks.map((link, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex items-center gap-3">
                    <i className={`${link.icon} text-xl`}></i>
                    <div>
                      <p className="font-medium">{link.platform}</p>
                      <a href={link.url} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-blue-600 hover:underline">
                        {link.url}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSocialLink(index)}
                      className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSocialLink(index)}
                      className="text-red-600 hover:text-red-700 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Inbox */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Contact Messages</h2>
        
        {!messages || messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`p-4 border rounded-lg ${
                  message.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {!message.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(message._id)}
                        className="text-sm text-blue-600 hover:text-blue-700 px-2 py-1"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteMessage(message._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <p className="font-medium mb-2">Subject: {message.subject}</p>
                <p className="text-gray-700 mb-2">{message.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
