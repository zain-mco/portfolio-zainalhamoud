import { useEffect, useRef, useState } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'

export default function CloudinaryUpload({ 
  onUpload, 
  currentImage, 
  cloudName = 'dhrglhjcb',
  apiKey = '797178848664695' 
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
        uploadPreset: 'ml_default', // You might need to create this in Cloudinary settings
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        maxFileSize: 5000000, // 5MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        cropping: true,
        croppingAspectRatio: 1,
        croppingShowDimensions: true,
        folder: 'portfolio',
        resourceType: 'image'
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

  const openMediaLibrary = () => {
    if (!window.cloudinary) {
      alert('Cloudinary widget is loading... Please try again in a moment.')
      return
    }

    widgetRef.current = window.cloudinary.createMediaLibrary(
      {
        cloudName: cloudName,
        apiKey: apiKey,
        multiple: false,
        maxFiles: 1,
        insertCaption: 'Select Image'
      },
      {
        insertHandler: (data) => {
          const imageUrl = data.assets[0].secure_url
          setPreview(imageUrl)
          onUpload(imageUrl)
        }
      }
    )

    widgetRef.current.show()
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
          onClick={openMediaLibrary}
          className="btn-secondary flex items-center gap-2"
        >
          <ImageIcon size={20} />
          Choose from Library
        </button>
      </div>

      <p className="text-sm text-gray-500">
        Upload a new image or choose from previously uploaded images
      </p>
    </div>
  )
}
