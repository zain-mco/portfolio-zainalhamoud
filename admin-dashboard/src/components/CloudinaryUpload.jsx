import { useEffect, useRef, useState } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'

export default function CloudinaryUpload({ 
  onUpload, 
  currentImage, 
  cloudName = 'dhrglhjcb'
}) {
  const [preview, setPreview] = useState(currentImage)
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
      (error, result) => {
        if (!error && result && result.event === 'success') {
          const imageUrl = result.info.secure_url
          setPreview(imageUrl)
          onUpload(imageUrl)
        }
      }
    )

    widgetRef.current.open()
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
          Upload New Image
        </button>

        <button
          type="button"
          onClick={openUploadWidget}
          className="btn-secondary flex items-center gap-2"
        >
          <ImageIcon size={20} />
          Choose from Library
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Upload a new image or choose from previously uploaded images (widget shows both options)
      </p>
    </div>
  )
}