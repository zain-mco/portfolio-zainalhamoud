import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactAPI } from '../services/api'
import toast from 'react-hot-toast'
import { Mail, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

export default function MessagesPage() {
  const queryClient = useQueryClient()

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: contactAPI.getMessages
  })

  const markReadMutation = useMutation({
    mutationFn: contactAPI.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: contactAPI.deleteMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages'])
      toast.success('Message deleted!')
    }
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-gray-600 mt-1">View and manage messages from visitors</p>
      </div>

      <div className="space-y-4">
        {messages?.map((message) => (
          <div key={message._id} className={`card ${!message.isRead ? 'border-l-4 border-blue-500' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg">{message.name}</h3>
                  {!message.isRead && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">New</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                <p className="text-sm text-gray-500 mb-3">{message.subject}</p>
                <p className="text-gray-800">{message.message}</p>
                <p className="text-xs text-gray-400 mt-3">
                  {format(new Date(message.createdAt), 'PPpp')}
                </p>
              </div>
              <div className="flex gap-2">
                {!message.isRead && (
                  <button
                    onClick={() => markReadMutation.mutate(message._id)}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg"
                  >
                    <Mail size={16} />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Delete this message?')) {
                      deleteMutation.mutate(message._id)
                    }
                  }}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {messages?.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
