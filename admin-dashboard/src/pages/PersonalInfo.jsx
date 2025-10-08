import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { personalAPI } from '../services/api'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'
import { useState } from 'react'
import CloudinaryUpload from '../components/CloudinaryUpload'

export default function PersonalInfo() {
  const queryClient = useQueryClient()
  const [imagePreview, setImagePreview] = useState(null)

  const { data: personal, isLoading } = useQuery({
    queryKey: ['personal'],
    queryFn: personalAPI.get
  })

  const { register, handleSubmit, setValue } = useForm()

  const updateMutation = useMutation({
    mutationFn: personalAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['personal'])
      toast.success('Personal info updated!')
    }
  })

  const handleCloudinaryUpload = (imageUrl) => {
    setImagePreview(imageUrl)
    toast.success('Image uploaded!')
    // Update personal info with new image URL
    updateMutation.mutate({ 
      ...personal, 
      profileImage: imageUrl 
    })
  }

  const onSubmit = (data) => {
    const typewriterTexts = data.typewriterTexts.split(',').map(t => t.trim())
    updateMutation.mutate({ ...data, typewriterTexts })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personal Information</h1>
        <p className="text-gray-600 mt-1">Update your personal details</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Profile Image</h2>
          <CloudinaryUpload
            onUpload={handleCloudinaryUpload}
            currentImage={imagePreview || personal?.profileImage}
            cloudName="dhrglhjcb"
          />
        </div>

        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="text-lg font-bold">Basic Information</h2>
          
          <div>
            <label className="label">Full Name</label>
            <input
              {...register('name')}
              defaultValue={personal?.name}
              className="input"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="label">Title</label>
            <input
              {...register('title')}
              defaultValue={personal?.title}
              className="input"
              placeholder="Web Developer & Designer"
            />
          </div>

          <div>
            <label className="label">Bio</label>
            <textarea
              {...register('bio')}
              defaultValue={personal?.bio}
              className="input min-h-[100px]"
              placeholder="A brief bio about yourself..."
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description')}
              defaultValue={personal?.description}
              className="input min-h-[100px]"
            />
          </div>
        </div>

        {/* Typewriter Texts */}
        <div className="card space-y-4">
          <h2 className="text-lg font-bold">Hero Section</h2>
          
          <div>
            <label className="label">Typewriter Texts (comma separated)</label>
            <input
              {...register('typewriterTexts')}
              defaultValue={personal?.typewriterTexts?.join(', ')}
              className="input"
              placeholder="Web Developer, UI/UX Designer, Creative Thinker"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Projects Count</label>
              <input
                {...register('heroStats.projects')}
                defaultValue={personal?.heroStats?.projects}
                className="input"
                placeholder="15+"
              />
            </div>
            <div>
              <label className="label">Experience</label>
              <input
                {...register('heroStats.experience')}
                defaultValue={personal?.heroStats?.experience}
                className="input"
                placeholder="3+"
              />
            </div>
            <div>
              <label className="label">Satisfaction</label>
              <input
                {...register('heroStats.satisfaction')}
                defaultValue={personal?.heroStats?.satisfaction}
                className="input"
                placeholder="100%"
              />
            </div>
          </div>
        </div>

        <button type="submit" disabled={updateMutation.isPending} className="btn-primary w-full flex items-center justify-center gap-2">
          <Save size={20} />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
