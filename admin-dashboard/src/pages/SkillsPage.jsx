import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { skillsAPI } from '../services/api'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { Plus, Edit, Trash2, X, GripVertical, Award, FolderOpen, Tag } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Skill Card Component
function SortableSkillCard({ skill, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill._id })

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
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
        >
          <GripVertical size={24} className="text-gray-400" />
        </div>

        {/* Skill Icon */}
        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl flex-shrink-0">
          <i className={skill.icon}></i>
        </div>

        {/* Skill Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{skill.name}</h3>
              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                {skill.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{skill.percentage}%</div>
                <div className="text-xs text-gray-500">Proficiency</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${skill.percentage}%` }}
            ></div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(skill)}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
            >
              <Edit size={14} className="inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => onDelete(skill._id)}
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

export default function SkillsPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [filter, setFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('skills') // 'skills' or 'categories'

  const { data: skillsData, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: skillsAPI.getAll
  })

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['skill-categories'],
    queryFn: skillsAPI.getCategories
  })

  const skills = skillsData?.skills || []
  const sortedSkills = [...skills].sort((a, b) => (a.order || 0) - (b.order || 0))

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm()
  const { register: registerCategory, handleSubmit: handleSubmitCategory, reset: resetCategory, formState: { errors: categoryErrors } } = useForm()

  const watchPercentage = watch('percentage', 0)

  // Create/Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingSkill) {
        return skillsAPI.update(editingSkill._id, data)
      } else {
        return skillsAPI.create(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['skills'])
      toast.success(editingSkill ? 'Skill updated!' : 'Skill created!')
      handleCloseModal()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save skill')
    }
  })

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: skillsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['skills'])
      toast.success('Skill deleted!')
    },
    onError: () => {
      toast.error('Failed to delete skill')
    }
  })

  // Reorder Mutation
  const reorderMutation = useMutation({
    mutationFn: skillsAPI.reorder,
    onSuccess: () => {
      queryClient.invalidateQueries(['skills'])
      toast.success('Skills reordered!')
    },
    onError: () => {
      toast.error('Failed to reorder skills')
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

    const oldIndex = sortedSkills.findIndex((s) => s._id === active.id)
    const newIndex = sortedSkills.findIndex((s) => s._id === over.id)

    const newSkills = arrayMove(sortedSkills, oldIndex, newIndex)

    // Update order values
    const reorderedSkills = newSkills.map((skill, index) => ({
      id: skill._id,
      order: index
    }))

    // Optimistically update the UI
    queryClient.setQueryData(['skills'], { skills: newSkills, additionalTechnologies: skillsData?.additionalTechnologies })

    // Send to backend
    reorderMutation.mutate(reorderedSkills)
  }

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setEditingSkill(skill)
      reset({
        name: skill.name,
        percentage: skill.percentage,
        icon: skill.icon,
        category: skill.category
      })
    } else {
      setEditingSkill(null)
      reset({
        name: '',
        percentage: 50,
        icon: 'fas fa-code',
        category: 'Frontend Development'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSkill(null)
    reset()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      deleteMutation.mutate(id)
    }
  }

  const onSubmit = (data) => {
    saveMutation.mutate({
      ...data,
      percentage: parseInt(data.percentage)
    })
  }

  // ============ CATEGORY MANAGEMENT ============

  // Category Mutations
  const saveCategoryMutation = useMutation({
    mutationFn: async (data) => {
      if (editingCategory) {
        return skillsAPI.updateCategory(editingCategory._id, data)
      } else {
        return skillsAPI.createCategory(data)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['skill-categories'])
      toast.success(editingCategory ? 'Category updated!' : 'Category created!')
      handleCloseCategoryModal()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save category')
    }
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: skillsAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['skill-categories'])
      toast.success('Category deleted!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete category')
    }
  })

  const handleOpenCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      resetCategory({
        name: category.name,
        icon: category.icon
      })
    } else {
      setEditingCategory(null)
      resetCategory({
        name: '',
        icon: 'fas fa-code'
      })
    }
    setShowCategoryModal(true)
  }

  const handleCloseCategoryModal = () => {
    setShowCategoryModal(false)
    setEditingCategory(null)
    resetCategory()
  }

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category? Skills using this category must be reassigned first.')) {
      deleteCategoryMutation.mutate(id)
    }
  }

  const onSubmitCategory = (data) => {
    saveCategoryMutation.mutate(data)
  }

  const filteredSkills = sortedSkills.filter(s => 
    filter === 'all' || s.category === filter
  )

  // Get dynamic stats
  const categoryStats = categories.reduce((acc, cat) => {
    acc[cat.name] = skills.filter(s => s.category === cat.name).length
    return acc
  }, {})

  const stats = {
    total: skills.length,
    categories: categories.length,
    avgProficiency: skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + s.percentage, 0) / skills.length) : 0
  }

  if (isLoading || categoriesLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skills Management</h1>
          <p className="text-gray-600 mt-1">Manage your technical skills & categories</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenCategoryModal()}
            className="btn-secondary flex items-center gap-2"
          >
            <FolderOpen size={20} />
            Manage Categories
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Skill
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Skills</p>
              <p className="text-3xl font-bold mt-1">{stats.total}</p>
            </div>
            <Award size={32} className="text-blue-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Categories</p>
              <p className="text-3xl font-bold mt-1">{stats.categories}</p>
            </div>
            <FolderOpen size={32} className="text-purple-200" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Avg Proficiency</p>
              <p className="text-3xl font-bold mt-1">{stats.avgProficiency}%</p>
            </div>
            <Tag size={32} className="text-green-200" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'skills'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award className="inline mr-2" size={18} />
            Skills ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FolderOpen className="inline mr-2" size={18} />
            Categories ({categories.length})
          </button>
        </div>
      </div>

      {activeTab === 'skills' && (
        <>
          {/* Filter */}
          <div className="card">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Skills
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setFilter(cat.name)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === cat.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <i className={cat.icon + ' mr-2'}></i>
                  {cat.name} ({categoryStats[cat.name] || 0})
                </button>
              ))}
            </div>
          </div>

      {/* Skills List with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredSkills.map(s => s._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {filteredSkills.map((skill) => (
              <SortableSkillCard
                key={skill._id}
                skill={skill}
                onEdit={handleOpenModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredSkills.length === 0 && (
        <div className="card text-center py-12">
          <Award size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No skills found. Add your first skill!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Skill Name */}
              <div>
                <label className="label">Skill Name *</label>
                <input
                  {...register('name', { required: 'Skill name is required' })}
                  className="input"
                  placeholder="React.js"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              {/* Icon */}
              <div>
                <label className="label">Icon Class *</label>
                <input
                  {...register('icon', { required: 'Icon is required' })}
                  className="input"
                  placeholder="fab fa-react"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use Font Awesome classes (e.g., fab fa-react, fas fa-code, fab fa-figma)
                </p>
                {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="label">Category *</label>
                <select {...register('category', { required: true })} className="input">
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Percentage Slider */}
              <div>
                <label className="label">Proficiency Level: {watchPercentage}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  {...register('percentage', { 
                    required: true,
                    min: 0,
                    max: 100
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
                {/* Visual Preview */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${watchPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 btn-primary"
                >
                  {saveMutation.isPending ? 'Saving...' : editingSkill ? 'Update Skill' : 'Create Skill'}
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
        </>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="card">
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg">
                    <i className={category.icon}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{categoryStats[category.name] || 0} skills</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenCategoryModal(category)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit size={14} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category._id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 size={14} className="inline mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No categories found. Create your first category!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={handleCloseCategoryModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory(onSubmitCategory)} className="p-6 space-y-4">
              {/* Category Name */}
              <div>
                <label className="label">Category Name *</label>
                <input
                  {...registerCategory('name', { required: 'Category name is required' })}
                  className="input"
                  placeholder="Backend Development"
                />
                {categoryErrors.name && <p className="text-red-500 text-sm mt-1">{categoryErrors.name.message}</p>}
              </div>

              {/* Icon */}
              <div>
                <label className="label">Icon Class *</label>
                <input
                  {...registerCategory('icon', { required: 'Icon is required' })}
                  className="input"
                  placeholder="fas fa-server"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use Font Awesome classes (e.g., fas fa-code, fas fa-database, fas fa-palette)
                </p>
                {categoryErrors.icon && <p className="text-red-500 text-sm mt-1">{categoryErrors.icon.message}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saveCategoryMutation.isPending}
                  className="flex-1 btn-primary"
                >
                  {saveCategoryMutation.isPending ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseCategoryModal}
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
