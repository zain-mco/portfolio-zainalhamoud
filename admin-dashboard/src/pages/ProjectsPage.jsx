import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2, ExternalLink, X, Upload, GripVertical } from 'lucide-react'
import CloudinaryUpload from '../components/CloudinaryUpload'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Project Card Component
function SortableProjectCard({ project, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <GripVertical size={24} className="text-gray-400" />
        </div>

        {/* Project Image */}
        <img
          src={project.image}
          alt={project.name}
          className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
        />

        {/* Project Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900 truncate">{project.name}</h3>
                {project.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full whitespace-nowrap">
                    Featured
                  </span>
                )}
              </div>
              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded mb-2">
                {project.category}
              </span>
              <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {project.technologies?.slice(0, 5).map((tech, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              <ExternalLink size={14} />
              View
            </a>
            <button
              onClick={() => onEdit(project)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
            >
              <Edit size={14} className="inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 size={14} className="inline mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [filter, setFilter] = useState('all')

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.getAll
  })

  // Sort projects by order
  const sortedProjects = projects ? [...projects].sort((a, b) => (a.order || 0) - (b.order || 0)) : []

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm()

  // Create/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      let imageUrl = data.image

      // Upload image if file is selected
      if (imageFile) {
        const uploadedImage = await projectsAPI.uploadImage(imageFile)
        imageUrl = uploadedImage.url
      }

      const projectData = {
        ...data,
        image: imageUrl,
        technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean)
      }

      if (editingProject) {
        return projectsAPI.update(editingProject._id, projectData)
      } else {
        return projectsAPI.create(projectData)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success(editingProject ? 'Project updated!' : 'Project created!')
      handleCloseModal()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save project')
    }
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: projectsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success('Project deleted!')
    },
    onError: () => {
      toast.error('Failed to delete project')
    }
  })

  // Reorder Mutation
  const reorderMutation = useMutation({
    mutationFn: projectsAPI.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success('Projects reordered!')
    },
    onError: () => {
      toast.error('Failed to reorder projects')
    }
  })

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = sortedProjects.findIndex((p) => p._id === active.id)
    const newIndex = sortedProjects.findIndex((p) => p._id === over.id)

    const newProjects = arrayMove(sortedProjects, oldIndex, newIndex)

    // Update order values
    const reorderedProjects = newProjects.map((project, index) => ({
      id: project._id,
      order: index
    }))

    // Optimistically update the UI
    queryClient.setQueryData(['projects'], newProjects)

    // Send to backend
    reorderMutation.mutate(reorderedProjects)
  }

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project)
      setValue('name', project.name)
      setValue('description', project.description)
      setValue('category', project.category)
      setValue('image', project.image)
      setValue('projectLink', project.projectLink)
      setValue('githubLink', project.githubLink || '')
      setValue('technologies', project.technologies?.join(', ') || '')
      setValue('featured', project.featured || false)
      setImagePreview(project.image)
    } else {
      setEditingProject(null)
      reset()
      setImagePreview(null)
    }
    setImageFile(null)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProject(null)
    setImagePreview(null)
    setImageFile(null)
    reset()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id)
    }
  }

  const onSubmit = (data) => {
    saveMutation.mutate(data)
  }

  const filteredProjects = sortedProjects?.filter(p => 
    filter === 'all' || p.category === filter
  ) || []

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects Management</h1>
          <p className="text-gray-600 mt-1">Manage your portfolio projects • Drag to reorder</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {/* Filter */}
      <div className="card">
        <div className="flex gap-2 flex-wrap">
          {['all', 'Web Development', 'UI/UX Design', 'Mobile App'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? 'All Projects' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredProjects.map(p => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <SortableProjectCard
                key={project._id}
                project={project}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredProjects.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No projects found. Create your first project!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Project Name */}
              <div>
                <label className="label">Project Name *</label>
                <input
                  {...register('name', { required: 'Project name is required' })}
                  className="input"
                  placeholder="My Awesome Project"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="label">Description *</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  className="input min-h-[100px]"
                  placeholder="Describe your project..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="label">Category *</label>
                <select {...register('category', { required: true })} className="input">
                  <option value="">Select category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Mobile App">Mobile App</option>
                </select>
              </div>
              {/* Image Upload */}
              <div>
                <label className="label">Project Image *</label>
                <CloudinaryUpload
                  onUpload={(imageUrl) => {
                    setImagePreview(imageUrl)
                    setValue('image', imageUrl)
                  }}
                  currentImage={imagePreview}
                  cloudName="dhrglhjcb"
                />
                <input type="hidden" {...register('image', { required: 'Project image is required' })} />
              </div>

              {/* Project Link */}
              <div>
                <label className="label">Project Link *</label>
                <input
                  {...register('projectLink', { required: 'Project link is required' })}
                  className="input"
                  placeholder="https://example.com"
                />
              </div>

              {/* GitHub Link */}
              <div>
                <label className="label">GitHub Link (optional)</label>
                <input
                  {...register('githubLink')}
                  className="input"
                  placeholder="https://github.com/..."
                />
              </div>

              {/* Technologies */}
              <div>
                <label className="label">Technologies (comma separated)</label>
                <input
                  {...register('technologies')}
                  className="input"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('featured')}
                  id="featured"
                  className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Featured Project
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 btn-primary"
                >
                  {saveMutation.isPending ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
