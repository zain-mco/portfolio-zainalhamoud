import { useEffect, useRef, useState } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { mediaAPI } from '../services/api'
import MediaLibraryModal from './MediaLibraryModal'

export default function CloudinaryUpload({ 
  onUpload, 
  currentImage, 
  cloudName = 'dhrglhjcb'
}) {
  const [preview, setPreview] = useState(currentImage)
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false)
  const widgetRef = useRef()

  useEffect(() => {
    // Load Cloudinary Upload Widget script
    if (!window.cloudinary) {
      const script = document.createElement('script')
      script.src = 'https://upload-widget.cloudinary.com/global/all.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  useEffect(() => {
    setPreview(currentImage)
  }, [currentImage])

  const openUploadWidget = () => {
    if (!window.cloudinary) {
      alert('Cloudinary widget is loading... Please try again in a moment.')
      return
    }

    widgetRef.current = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: 'ml_default',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 5000000, // 5MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        cropping: false,
        folder: 'portfolio',
        resourceType: 'image',
        showUploadMoreButton: false
      },
      async (error, result) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url
          const publicId = result.info.public_id
          const folder = result.info.folder || 'portfolio'
          
          setPreview(imageUrl)
          onUpload(imageUrl)

          // Save to our custom Media Database securely matching the schema
          try {
             await mediaAPI.create({ url: imageUrl, publicId: publicId, folder: folder });
          } catch(e) {
             console.error("Failed to register media in database: ", e);
          }
        }
      }
    )

    widgetRef.current.open()
  }

  const handleLibrarySelect = (imageUrl) => {
    setPreview(imageUrl)
    onUpload(imageUrl)
    setIsMediaModalOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Preview */}
      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs max-h-64 rounded-lg border-2 border-gray-200 object-contain"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={openUploadWidget}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={20} />
          Upload Image
        </button>

        <button
          type="button"
          onClick={() => setIsMediaModalOpen(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <ImageIcon size={20} />
          Choose from Library
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Upload a new image or explore the portfolio image database.
      </p>

      {/* Media Library Modal */}
      <MediaLibraryModal 
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleLibrarySelect}
      />
    </div>
  )
}