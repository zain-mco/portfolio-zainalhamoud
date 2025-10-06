const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Personal = require('../models/Personal');
const About = require('../models/About');
const { Skill, AdditionalTech } = require('../models/Skill');
const Project = require('../models/Project');
const { Contact } = require('../models/Contact');
const Settings = require('../models/Settings');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany();
    await Personal.deleteMany();
    await About.deleteMany();
    await Skill.deleteMany();
    await AdditionalTech.deleteMany();
    await Project.deleteMany();
    await Contact.deleteMany();
    await Settings.deleteMany();

    console.log('✅ Cleared existing data');

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin'
    });

    console.log('✅ Created admin user');

    // Create personal info
    await Personal.create({
      name: 'Zain L. Alhamoud',
      title: 'UI/UX Designer & Web Developer',
      bio: 'A passionate 27-year-old designer and developer from Syria',
      description: 'specializing in creating beautiful, functional digital experiences that solve real-world problems and delight users.',
      profileImage: '/assets/zain.svg',
      typewriterTexts: ['UI/UX Designer', 'Web Developer', 'Creative Thinker', 'Problem Solver'],
      heroStats: {
        projects: '15+',
        experience: '3+',
        satisfaction: '100%'
      }
    });

    console.log('✅ Created personal info');

    // Create about section
    await About.create({
      description: "Web Designer & Developer with a Bachelor’s in Electronics and Communication Engineering (ECE). Skilled in full-stack web development, UI/UX design, and cross-platform solutions. Experienced in building dynamic websites, CMS platforms, and mobile app components. Strong background in front-end and back-end technologies including HTML, CSS, JavaScript, React.js, PHP, MySQL, WordPress, and Flutter. Passionate about delivering responsive, optimized, and user-focused digital solutions",
      workExperience: [
        {
          title: 'Web Designer and Developer',
          company: 'Medetarian Conference Organizing',
          duration: '03/2023 - Present',
          location: 'Abu Dhabi, UAE',
          responsibilities: [
            ' Designed, developed, and deployed dynamic and event-based websites using a full stack of front-end (HTML, CSS, JavaScript, React.js) and back-end (PHP, MySQL) technologies.',
            'Created interactive user interfaces using HTML, CSS, JavaScript, and WordPress',
            'Developed custom content management systems for event information',
            'Implemented performance improvements for better user experience'
          ],
          order: 1
        },
        {
          title: 'Web Designer and Developer',
          company: 'Freelance',
          duration: '06/2021 - 02/2023',
          location: 'Homs, Syria',
          responsibilities: [
            'Created responsive web and mobile app development using Figma, XD, Flutter, HTML, CSS, JavaScript & WordPress',
            'Resolved issues promptly for enhanced application functionality'
          ],
          order: 2
        }
      ],
      education: [
        {
          degree: 'Bachelor of Electronics & Communication Engineering (ECE)',
          institution: 'Albath University',
          duration: '01/2016 - 01/2022',
          order: 1
        }
      ],
      certifications: [
        {
          name: 'Meta Front-End Developer',
          issuer: 'Coursera',
          link: 'https://www.coursera.org/account/accomplishments/professional-cert/PJ8T7J6FGL68'
        },
        {
          name: 'Business English: Networking',
          issuer: 'University of Washington',
          link: 'https://www.coursera.org/account/accomplishments/verify/3LCR4R56JWFN'
        }
      ]
    });

    console.log('✅ Created about section');

    // Create skills - Organized by 4 categories
    const skills = [
      // Frontend Development
      { name: 'HTML5', percentage: 90, icon: 'fab fa-html5', category: 'Frontend Development', order: 1 },
      { name: 'CSS3', percentage: 90, icon: 'fab fa-css3-alt', category: 'Frontend Development', order: 2 },
      { name: 'JavaScript', percentage: 85, icon: 'fab fa-js-square', category: 'Frontend Development', order: 3 },
      { name: 'React', percentage: 75, icon: 'fab fa-react', category: 'Frontend Development', order: 4 },
      
      // Backend Development
      
      { name: 'PHP', percentage: 75, icon: 'fab fa-php', category: 'Backend Development', order: 6 },
      { name: 'MySQL', percentage: 75, icon: 'fas fa-database', category: 'Backend Development', order: 7 },
    
      
      // Design & UI/UX
      { name: 'UI/UX Design', percentage: 90, icon: 'fas fa-paint-brush', category: 'Design & UI/UX', order: 9 },
      { name: 'Figma', percentage: 85, icon: 'fab fa-figma', category: 'Design & UI/UX', order: 10 },
      { name: 'Adobe XD', percentage: 85, icon: 'fab fa-adobe', category: 'Design & UI/UX', order: 11 },
      { name: 'Photoshop', percentage: 80, icon: 'fas fa-image', category: 'Design & UI/UX', order: 12 },
      
      // Tools & Technologies
      { name: 'WordPress', percentage: 85, icon: 'fab fa-wordpress', category: 'Tools & Technologies', order: 13 },
      { name: 'GitHub', percentage: 80, icon: 'fab fa-github', category: 'Tools & Technologies', order: 14 },
      { name: 'SEO', percentage: 75, icon: 'fas fa-search', category: 'Tools & Technologies', order: 15 },
      { name: 'SASS', percentage: 70, icon: 'fab fa-sass', category: 'Tools & Technologies', order: 16 }
    ];

    await Skill.insertMany(skills);

    console.log('✅ Created skills');

    // Create additional technologies
    await AdditionalTech.create({
      technologies: ['Bootstrap', 'Flutter', 'Responsive Design', 'Cross-browser Compatibility', 'Performance Optimization', 'Mobile-First Design', 'API Integration', 'REST APIs']
    });

    console.log('✅ Created additional technologies');

    // Create contact info
    await Contact.create({
      email: 'zenlalhamoud@gmail.com',
      phone: '+971 (504) 235-113',
      location: 'Abu Dhabi, UAE',
      whatsapp: '971504235113',
      socialLinks: [
        { platform: 'WhatsApp', url: 'https://wa.me/971504235113', icon: 'fab fa-whatsapp' },
        { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/zain-l-alhamoud-5bb414282/', icon: 'fab fa-linkedin' }
      ]
    });

    console.log('✅ Created contact info');

    // Create settings
    await Settings.create({
      theme: {
        primaryColor: '#0066FF',
        secondaryColor: '#8B5CF6',
        accentColor: '#06D6A0'
      },
      seo: {
        title: 'Zain L. Alhamoud - UI/UX Designer & Web Developer',
        description: 'Professional portfolio showcasing modern web development and design projects',
        keywords: 'UI/UX Designer, Web Developer, React, JavaScript, Portfolio, Syria, Frontend Developer'
      }
    });

    console.log('✅ Created settings');

    console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   ✅ Database seeded successfully!         ║
║                                            ║
║   👤 Admin Credentials:                    ║
║   📧 Email: ${admin.email}                 
║   🔑 Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}
║                                            ║
║   🎯 You can now start the server!         ║
║                                            ║
╚════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
