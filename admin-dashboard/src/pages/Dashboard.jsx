import { useQuery } from '@tanstack/react-query'
import { projectsAPI, skillsAPI, contactAPI, personalAPI, visitorsAPI } from '../services/api'
import { FolderKanban, Award, MessageSquare, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: projectsAPI.getAll })
  const { data: skillsData } = useQuery({ queryKey: ['skills'], queryFn: skillsAPI.getAll })
  const { data: messages } = useQuery({ queryKey: ['messages'], queryFn: contactAPI.getMessages })
  const { data: personal } = useQuery({ queryKey: ['personal'], queryFn: personalAPI.get })
  const { data: visitorStats } = useQuery({ 
    queryKey: ['visitorStats'], 
    queryFn: visitorsAPI.getStats,
    refetchInterval: 60000 // Refetch every minute
  })

  // Format visitor count for display
  const formatVisitorCount = (count) => {
    if (!count) return '0';
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const stats = [
    {
      icon: FolderKanban,
      label: 'Total Projects',
      value: projects?.length || 0,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: Award,
      label: 'Skills',
      value: skillsData?.skills?.length || 0,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      value: messages?.length || 0,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: TrendingUp,
      label: 'Profile Views',
      value: formatVisitorCount(visitorStats?.totalVisitors),
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      subtitle: visitorStats?.visitorsToday ? `${visitorStats.visitorsToday} today` : null
    }
  ]

  const recentProjects = projects?.slice(0, 5) || []
  const unreadMessages = messages?.filter(m => !m.isRead) || []

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {personal?.name || 'Admin'}! 👋</h1>
        <p className="text-blue-100">Here's what's happening with your portfolio today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
              <div className={`${stat.bgColor} p-4 rounded-xl`}>
                <stat.icon className={stat.textColor} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
            <a href="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div key={project._id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.category}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No projects yet</p>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
            <a href="/messages" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-4">
            {unreadMessages.length > 0 ? (
              unreadMessages.slice(0, 5).map((message) => (
                <div key={message._id} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{message.name}</h3>
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">New</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{message.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{message.email}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No new messages</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/projects" className="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-md transition-shadow">
            <FolderKanban className="text-blue-600 mb-2" size={32} />
            <span className="font-medium text-gray-900">Add Project</span>
          </a>
          <a href="/skills" className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-md transition-shadow">
            <Award className="text-purple-600 mb-2" size={32} />
            <span className="font-medium text-gray-900">Manage Skills</span>
          </a>
          <a href="/personal" className="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-md transition-shadow">
            <TrendingUp className="text-green-600 mb-2" size={32} />
            <span className="font-medium text-gray-900">Update Profile</span>
          </a>
          <a href="/settings" className="flex flex-col items-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-md transition-shadow">
            <MessageSquare className="text-orange-600 mb-2" size={32} />
            <span className="font-medium text-gray-900">Settings</span>
          </a>
        </div>
      </div>
    </div>
  )
}
