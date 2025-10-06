import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import AOS from 'aos'
import { 
  getPersonalInfo, 
  getAbout, 
  getSkills, 
  getProjects, 
  getContact,
  trackVisitor 
} from './services/api'
import { 
  useMotionGraphics, 
  useScrollAnimations, 
  useCardEffects, 
  useSkillAnimations 
} from './hooks/useMotionGraphics'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      cacheTime: 60000, // 1 minute
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnMount: true
    }
  }
})

function PortfolioApp() {
  const [filter, setFilter] = useState('all')
  
  const { data: personal } = useQuery({ 
    queryKey: ['personal'], 
    queryFn: getPersonalInfo,
    refetchInterval: 30000 // Refetch every 30 seconds
  })
  const { data: about } = useQuery({ queryKey: ['about'], queryFn: getAbout })
  const { data: skillsData } = useQuery({ queryKey: ['skills'], queryFn: getSkills })
  const { data: projects } = useQuery({ queryKey: ['projects'], queryFn: getProjects })
  const { data: contact } = useQuery({ queryKey: ['contact'], queryFn: getContact })

  // Initialize all motion graphics
  useMotionGraphics()
  useScrollAnimations()
  useCardEffects()
  useSkillAnimations()

  useEffect(() => {
    // Track visitor on first load
    trackVisitor();
    
    // Remove loading screen
    const loader = document.querySelector('.loader')
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0'
        setTimeout(() => {
          loader.style.display = 'none'
        }, 500)
      }, 1500)
    }

    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })

    // Initialize Particles.js
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#0066FF' },
          shape: { type: 'circle' },
          opacity: { value: 0.5 },
          size: { value: 3, random: true },
          line_linked: { enable: true, distance: 150, color: '#0066FF', opacity: 0.4, width: 1 },
          move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
        },
        interactivity: {
          detect_on: 'canvas',
          events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
          modes: { repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 } }
        },
        retina_detect: true
      })
    }
  }, [])

  const filteredProjects = projects?.filter(project => 
    filter === 'all' || project.category === filter
  ) || []

  // Get unique categories that have projects
  const availableCategories = [...new Set(projects?.map(p => p.category) || [])]

  return (
    <>
      {/* Loading Screen */}
      <div className="loader">
        <div className="loader-content">
          <div className="loader-logo"><span className="gradient-text">Z</span></div>
          <div className="loader-text">Loading Portfolio...</div>
          <div className="loader-bar"><div className="loader-progress"></div></div>
        </div>
      </div>

      {/* Particle Background */}
      <div id="particles-js"></div>

      {/* Floating Geometric Shapes */}
      <div className="geometric-shapes">
        <div className="shape triangle"></div>
        <div className="shape circle"></div>
        <div className="shape square"></div>
        <div className="shape triangle"></div>
        <div className="shape circle"></div>
      </div>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#home">
            <span className="gradient-text">{personal?.name?.split(' ')[0] || 'Zain'}</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
              <li className="nav-item"><a className="nav-link" href="#skills">Skills</a></li>
              <li className="nav-item"><a className="nav-link" href="#projects">Projects</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="hero-content">
                <h1 className="hero-title">
                  Hi, I'm <br></br><span className="gradient-text">{personal?.name}</span>
                </h1>
                <h2 className="hero-subtitle">
                  <span id="typewriter">{personal?.title}</span>
                </h2>
                <p className="hero-description">{personal?.bio} {personal?.description}</p>
                
                <div className="stats-container">
                  <div className="stat-item">
                    <span className="stat-number">{personal?.heroStats?.projects}</span>
                    <span className="stat-label">Projects</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{personal?.heroStats?.experience}</span>
                    <span className="stat-label">Years Exp</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{personal?.heroStats?.satisfaction}</span>
                    <span className="stat-label">Satisfaction</span>
                  </div>
                </div>
                
                <div className="cta-buttons">
                  <a href="#projects" className="btn-3d primary">View My Work</a>
                  <a href="#contact" className="btn-3d secondary">Get In Touch</a>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="hero-visual">
                <div className="profile-container">
                  <div className="orbital-ring ring-1"></div>
                  <div className="orbital-ring ring-2"></div>
                  <div className="profile-image">
                    <img 
                      src={personal?.profileImage ? `${personal.profileImage}?t=${Date.now()}` : "/assets/zain.svg"} 
                      alt={personal?.name} 
                      key={personal?.profileImage} 
                    />
                  </div>
                  <div className="floating-skill skill-1">HTML</div>
                  <div className="floating-skill skill-2">UI/UX</div>
                  <div className="floating-skill skill-3">Figma</div>
                  <div className="floating-skill skill-4">CSS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title" data-aos="fade-up">About Me</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12" data-aos="fade-up">
              <div className="about-content">
                <h3>{personal?.title}</h3>
                <p>{about?.description}</p>
                
                <h4 style={{color: 'var(--primary-color)', marginTop: '2rem', marginBottom: '1rem'}}>Experience</h4>
                
                {about?.workExperience?.map((exp, index) => (
                  <div key={index} style={{marginBottom: '2rem'}}>
                    <h5 style={{color: 'var(--text-light)', marginBottom: '0.5rem'}}>{exp.title}</h5>
                    <p style={{fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem'}}>
                      {exp.company} | {exp.duration} | {exp.location}
                    </p>
                    <ul style={{paddingLeft: '1.5rem', color: '#94a3b8', fontSize: '0.95rem'}}>
                      {exp.responsibilities?.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                <h4 style={{color: 'var(--primary-color)', marginTop: '2rem', marginBottom: '1rem'}}>Education</h4>
                
                {about?.education?.map((edu, index) => (
                  <div key={index} style={{marginBottom: '1.5rem'}}>
                    <h5 style={{color: 'var(--text-light)', marginBottom: '0.5rem'}}>{edu.degree}</h5>
                    <p style={{fontSize: '0.9rem', color: '#94a3b8'}}>
                      {edu.institution} | {edu.duration}
                    </p>
                    {edu.description && (
                      <p style={{fontSize: '0.9rem', color: '#94a3b8', marginTop: '0.5rem'}}>
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}

                {about?.certifications && about.certifications.length > 0 && (
                  <>
                    <h4 style={{color: 'var(--primary-color)', marginTop: '2rem', marginBottom: '1rem'}}>Training & Certifications</h4>
                    
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem'}}>
                      {about.certifications.map((cert, index) => (
                        <div key={index} style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '12px',
                          padding: '1.5rem',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                          cursor: cert.link ? 'pointer' : 'default'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.borderColor = 'var(--primary-color)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onClick={() => cert.link && window.open(cert.link, '_blank')}>
                          {cert.image && (
                            <div style={{marginBottom: '1rem', textAlign: 'center'}}>
                              <img 
                                src={cert.image} 
                                alt={cert.name} 
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  objectFit: 'contain',
                                  borderRadius: '8px'
                                }}
                              />
                            </div>
                          )}
                          <h5 style={{color: 'var(--text-light)', marginBottom: '0.5rem', fontSize: '1rem'}}>
                            {cert.name}
                          </h5>
                          <p style={{fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.5rem'}}>
                            {cert.issuer}
                          </p>
                          {cert.link && (
                            <a 
                              href={cert.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--primary-color)',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                              onClick={(e) => e.stopPropagation()}>
                              View Certificate <i className="fas fa-external-link-alt" style={{fontSize: '0.7rem'}}></i>
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title" data-aos="fade-up">Skills & Expertise</h2>
            </div>
          </div>
          <div className="row mt-5">
            {/* Get unique categories from skills and display them dynamically */}
            {Array.from(new Set(skillsData?.skills?.map(s => s.category) || [])).map((category, catIndex) => {
              // Find a skill from this category to get the icon, or use default
              const categorySkills = skillsData?.skills?.filter(s => s.category === category) || []
              const categoryIcon = categorySkills.length > 0 && categorySkills[0].icon ? categorySkills[0].icon.split(' ')[0] + ' ' + categorySkills[0].icon.split(' ')[1] : 'fas fa-code'
              
              return (
                <div key={catIndex} className="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
                  <div className="skill-category-card">
                    <div className="skill-category-header">
                      <div className="skill-category-icon">
                        <i className={categoryIcon}></i>
                      </div>
                      <h3>{category}</h3>
                    </div>
                    <div className="skills-list">
                      {categorySkills.map((skill) => (
                        <div key={skill._id} className="skill-circle-item">
                          <div className="skill-circle" data-percentage={skill.percentage}>
                            <div className="skill-circle-inner">
                              <i className={skill.icon}></i>
                              <span className="skill-percentage">{skill.percentage}%</span>
                            </div>
                          </div>
                          <span className="skill-label">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title" data-aos="fade-up">Featured Projects</h2>
            </div>
          </div>
          
          <div className="filter-container text-center mb-5">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
              onClick={() => setFilter('all')}
            >
              All Projects
            </button>
            {availableCategories.includes('Web Development') && (
              <button 
                className={`filter-btn ${filter === 'Web Development' ? 'active' : ''}`} 
                onClick={() => setFilter('Web Development')}
              >
                Web Development
              </button>
            )}
            {availableCategories.includes('UI/UX Design') && (
              <button 
                className={`filter-btn ${filter === 'UI/UX Design' ? 'active' : ''}`} 
                onClick={() => setFilter('UI/UX Design')}
              >
                UI/UX Design
              </button>
            )}
            {availableCategories.includes('Mobile App') && (
              <button 
                className={`filter-btn ${filter === 'Mobile App' ? 'active' : ''}`} 
                onClick={() => setFilter('Mobile App')}
              >
                Mobile App
              </button>
            )}
          </div>

          <div className="row">
            {filteredProjects.map((project, index) => (
              <div key={project._id} className="col-lg-4 col-md-6 mb-4" data-aos="flip-left" data-aos-delay={index * 100}>
                <a 
                  href={project.projectLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="project-card"
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
                >
                  <div className="project-image">
                    <img src={project.image} alt={project.name} />
                    <div className="project-overlay">
                      <div className="project-link">
                        <i className="fas fa-external-link-alt"></i>
                      </div>
                    </div>
                  </div>
                  <div className="project-content">
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                    <div className="project-tech">
                      {project.technologies?.map((tech, i) => (
                        <span key={i}>{tech}</span>
                      ))}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="section-title" data-aos="fade-up">Get In Touch</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="contact-card" data-aos="fade-up">
                <h3 className="contact-card-title">Let's Connect</h3>
                
                <div className="contact-item">
                  <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                  <div className="contact-details">
                    <h5>Email</h5>
                    <a href={`mailto:${contact?.email}`} className="contact-link">{contact?.email}</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon"><i className="fas fa-phone"></i></div>
                  <div className="contact-details">
                    <h5>Phone</h5>
                    <a href={`tel:${contact?.phone}`} className="contact-link">{contact?.phone}</a>
                  </div>
                </div>

                {contact?.location && (
                  <div className="contact-item">
                    <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                    <div className="contact-details">
                      <h5>Location</h5>
                      <p className="contact-link">{contact.location}</p>
                    </div>
                  </div>
                )}

                <div className="contact-social">
                  {contact?.socialLinks?.map((social, index) => (
                    <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" 
                       className={`social-btn ${social.platform.toLowerCase()}`}>
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="text-center">
            <p>&copy; 2025 {personal?.name}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioApp />
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}

export default App
