import { useQuery } from '@tanstack/react-query'
import { mediaAPI } from '../services/api'
import { X, Image as ImageIcon, Check } from 'lucide-react'

export default function MediaLibraryModal({ isOpen, onClose, onSelect }) {
  const { data: mediaFiles = [], isLoading } = useQuery({
    queryKey: ['media'],
    queryFn: mediaAPI.getAll,
    enabled: isOpen // Only fetch when modal is open
  })

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ImageIcon className="text-primary-600" />
            Media Library
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <ImageIcon size={48} className="mb-2 opacity-20" />
              <p>No media files found in the database.</p>
              <p className="text-sm mt-1">Upload new images to populate the library.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediaFiles.map((media) => (
                <div 
                  key={media.id} 
                  className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square cursor-pointer hover:border-primary-500 transition-colors"
                  onClick={() => onSelect(media.url)}
                >
                  <img 
                    src={media.url} 
                    alt="Media file" 
                    className="w-full h-full object-cover"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary-600/0 group-hover:bg-primary-600/10 transition-colors flex flex-col justify-end">
                    <div className="p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <button 
                        className="w-full btn-primary py-1 text-sm flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(media.url);
                        }}
                      >
                        <Check size={16} /> Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
