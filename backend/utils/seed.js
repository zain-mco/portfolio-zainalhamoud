const { PrismaClient } = require('../generated/prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });

// Create connection pool and adapter for Prisma 7
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data (order matters due to foreign keys)
    await prisma.workExperience.deleteMany();
    await prisma.education.deleteMany();
    await prisma.certification.deleteMany();
    await prisma.socialLink.deleteMany();
    await prisma.message.deleteMany();
    await prisma.visitor.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.skillCategory.deleteMany();
    await prisma.additionalTech.deleteMany();
    await prisma.project.deleteMany();
    await prisma.about.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.personal.deleteMany();
    await prisma.settings.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Cleared existing data');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'Admin@123456',
      salt
    );

    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: (process.env.ADMIN_EMAIL || 'admin@portfolio.com').toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('✅ Created admin user');

    // Create personal info
    await prisma.personal.create({
      data: {
        name: 'Zain L. Alhamoud',
        title: 'UI/UX Designer & Web Developer',
        bio: 'A passionate 27-year-old designer and developer from Syria',
        description: 'specializing in creating beautiful, functional digital experiences that solve real-world problems and delight users.',
        profileImage: '/assets/zain.svg',
        typewriterTexts: ['UI/UX Designer', 'Web Developer', 'Creative Thinker', 'Problem Solver'],
        statProjects: '15+',
        statExperience: '3+',
        statSatisfaction: '100%'
      }
    });

    console.log('✅ Created personal info');

    // Create about section with related data
    await prisma.about.create({
      data: {
        description: "Web Designer & Developer with a Bachelor's in Electronics and Communication Engineering (ECE). Skilled in full-stack web development, UI/UX design, and cross-platform solutions. Experienced in building dynamic websites, CMS platforms, and mobile app components. Strong background in front-end and back-end technologies including HTML, CSS, JavaScript, React.js, PHP, MySQL, WordPress, and Flutter. Passionate about delivering responsive, optimized, and user-focused digital solutions",
        workExperience: {
          create: [
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
          ]
        },
        education: {
          create: [
            {
              degree: 'Bachelor of Electronics & Communication Engineering (ECE)',
              institution: 'Albath University',
              duration: '01/2016 - 01/2022',
              order: 1
            }
          ]
        },
        certifications: {
          create: [
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
        }
      }
    });

    console.log('✅ Created about section');

    // Create skills
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

    await prisma.skill.createMany({ data: skills });

    console.log('✅ Created skills');

    // Create additional technologies
    await prisma.additionalTech.create({
      data: {
        technologies: ['Bootstrap', 'Flutter', 'Responsive Design', 'Cross-browser Compatibility', 'Performance Optimization', 'Mobile-First Design', 'API Integration', 'REST APIs']
      }
    });

    console.log('✅ Created additional technologies');

    // Create contact info with social links
    await prisma.contact.create({
      data: {
        email: 'zenlalhamoud@gmail.com',
        phone: '+971 (504) 235-113',
        location: 'Abu Dhabi, UAE',
        whatsapp: '971504235113',
        socialLinks: {
          create: [
            { platform: 'WhatsApp', url: 'https://wa.me/971504235113', icon: 'fab fa-whatsapp' },
            { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/zain-l-alhamoud-5bb414282/', icon: 'fab fa-linkedin' }
          ]
        }
      }
    });

    console.log('✅ Created contact info');

    // Create settings
    await prisma.settings.create({
      data: {
        themePrimaryColor: '#0066FF',
        themeSecondaryColor: '#8B5CF6',
        themeAccentColor: '#06D6A0',
        seoTitle: 'Zain L. Alhamoud - UI/UX Designer & Web Developer',
        seoDescription: 'Professional portfolio showcasing modern web development and design projects',
        seoKeywords: 'UI/UX Designer, Web Developer, React, JavaScript, Portfolio, Syria, Frontend Developer'
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

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedDatabase();
