const { MongoClient } = require('mongodb');
const prisma = require('../config/prisma');

const MONGO_URI = 'mongodb+srv://zainmaco24_db_user:PortfolioMongo2026!@cluster0.p5methn.mongodb.net/?appName=Cluster0';

exports.runMigration = async (req, res) => {
   console.log('API Request: Starting Migration from MongoDB to Neon PostgreSQL...');

   const client = new MongoClient(MONGO_URI);

   try {
      await client.connect();
      console.log('Connected to MongoDB Atlas!');

      // Find the right database name dynamically based on which contains the collections
      const dbAdmin = client.db().admin();
      const dbsList = await dbAdmin.listDatabases();

      let targetDbName = null;
      let maxCollections = -1;

      for (const dbInfo of dbsList.databases) {
         const db = client.db(dbInfo.name);
         const collections = await db.listCollections().toArray();
         if (collections.length > maxCollections && dbInfo.name !== 'admin' && dbInfo.name !== 'local') {
            maxCollections = collections.length;
            targetDbName = dbInfo.name;
         }
      }

      console.log(`Auto-selected MongoDB database: "${targetDbName}" (${maxCollections} collections found)`);
      const db = client.db(targetDbName);

      // Wipe Neon Database cleanly
      console.log('Clearing existing Neon PostgreSQL dummy data...');
      await prisma.visitor.deleteMany();
      await prisma.message.deleteMany();
      await prisma.settings.deleteMany();
      await prisma.socialLink.deleteMany();
      await prisma.contact.deleteMany();
      await prisma.project.deleteMany();
      await prisma.additionalTech.deleteMany();
      await prisma.skill.deleteMany();
      await prisma.skillCategory.deleteMany();
      await prisma.certification.deleteMany();
      await prisma.education.deleteMany();
      await prisma.workExperience.deleteMany();
      await prisma.about.deleteMany();
      await prisma.personal.deleteMany();
      await prisma.user.deleteMany();

      console.log('Neon database cleared. Commencing Transfer...');

      // 1. Migrate Users
      const users = await db.collection('users').find().toArray();
      for (const user of users) {
         await prisma.user.create({
            data: {
               username: user.username || 'admin',
               email: user.email,
               password: user.password,
               role: user.role || 'admin',
               isActive: user.isActive !== undefined ? user.isActive : true,
               createdAt: user.createdAt || new Date(),
               updatedAt: user.updatedAt || new Date()
            }
         });
      }

      // 2. Migrate Personal
      const personals = await db.collection('personals').find().toArray();
      for (const p of personals) {
         await prisma.personal.create({
            data: {
               name: p.name || 'Zain L. Alhamoud',
               title: p.title || '',
               bio: p.bio || '',
               description: p.description || null,
               profileImage: p.profileImage || '/assets/zain.svg',
               resumeFile: p.resumeFile || '',
               typewriterTexts: p.typewriterTexts || [],
               statProjects: p.heroStats?.projects || '15+',
               statExperience: p.heroStats?.experience || '3+',
               statSatisfaction: p.heroStats?.satisfaction || '100%',
               createdAt: p.createdAt || new Date(),
               updatedAt: p.updatedAt || new Date()
            }
         });
      }

      // 3. Migrate About (nested arrays)
      const abouts = await db.collection('abouts').find().toArray();
      for (const a of abouts) {
         const createdAbout = await prisma.about.create({
            data: {
               description: a.description || '',
               createdAt: a.createdAt || new Date(),
               updatedAt: a.updatedAt || new Date()
            }
         });

         if (a.workExperience) {
            for (const we of a.workExperience) {
               await prisma.workExperience.create({
                  data: {
                     title: we.title || '',
                     company: we.company || '',
                     duration: we.duration || '',
                     location: we.location || '',
                     responsibilities: we.responsibilities || [],
                     order: we.order || 0,
                     aboutId: createdAbout.id
                  }
               });
            }
         }

         if (a.education) {
            for (const ed of a.education) {
               await prisma.education.create({
                  data: {
                     degree: ed.degree || '',
                     institution: ed.institution || '',
                     duration: ed.duration || '',
                     description: ed.description || null,
                     order: ed.order || 0,
                     aboutId: createdAbout.id
                  }
               });
            }
         }

         if (a.certifications) {
            for (const cert of a.certifications) {
               await prisma.certification.create({
                  data: {
                     name: cert.name || '',
                     issuer: cert.issuer || '',
                     link: cert.link || null,
                     image: cert.image || null,
                     aboutId: createdAbout.id
                  }
               });
            }
         }
      }

      // 4. Migrate Skills
      const skills = await db.collection('skills').find().toArray();
      for (const s of skills) {
         await prisma.skill.create({
            data: {
               name: s.name,
               percentage: s.percentage || 0,
               icon: s.icon || 'fas fa-code',
               category: s.category || 'tools',
               order: s.order || 0,
               createdAt: s.createdAt || new Date(),
               updatedAt: s.updatedAt || new Date()
            }
         });
      }

      // 5. Migrate Skill Categories
      const skillCats = await db.collection('skillcategories').find().toArray();
      for (const c of skillCats) {
         await prisma.skillCategory.create({
            data: {
               name: c.name,
               icon: c.icon || 'fas fa-code',
               order: c.order || 0,
               createdAt: c.createdAt || new Date(),
               updatedAt: c.updatedAt || new Date()
            }
         });
      }

      // 6. Migrate Projects
      const projects = await db.collection('projects').find().toArray();
      for (const p of projects) {
         await prisma.project.create({
            data: {
               name: p.name,
               description: p.description,
               category: p.category || 'all',
               image: p.image || '',
               projectLink: p.projectLink || '',
               githubLink: p.githubLink || '',
               technologies: p.technologies || [],
               featured: Boolean(p.featured),
               order: p.order || 0,
               createdAt: p.createdAt || new Date(),
               updatedAt: p.updatedAt || new Date()
            }
         });
      }

      // 7. Migrate Additional Tech
      const adTechs = await db.collection('additionalteches').find().toArray();
      for (const a of adTechs) {
         await prisma.additionalTech.create({
            data: {
               technologies: a.technologies || [],
               createdAt: a.createdAt || new Date(),
               updatedAt: a.updatedAt || new Date()
            }
         });
      }

      // 8. Migrate Contact & Settings
      const contacts = await db.collection('contacts').find().toArray();
      for (const c of contacts) {
         const createdContact = await prisma.contact.create({
            data: {
               email: c.email || '',
               phone: c.phone || '',
               location: c.location || '',
               whatsapp: c.whatsapp || '',
               createdAt: c.createdAt || new Date(),
               updatedAt: c.updatedAt || new Date()
            }
         });

         if (c.socialLinks) {
            for (const s of c.socialLinks) {
               await prisma.socialLink.create({
                  data: {
                     platform: s.platform || '',
                     url: s.url || '',
                     icon: s.icon || '',
                     contactId: createdContact.id
                  }
               });
            }
         }
      }

      const settings = await db.collection('settings').find().toArray();
      for (const s of settings) {
         await prisma.settings.create({
            data: {
               themePrimaryColor: s.theme?.primaryColor || "#0066FF",
               themeSecondaryColor: s.theme?.secondaryColor || "#8B5CF6",
               themeAccentColor: s.theme?.accentColor || "#06D6A0",
               seoTitle: s.seo?.title || "Zain L. Alhamoud - UI/UX Designer & Web Developer",
               seoDescription: s.seo?.description || "",
               seoKeywords: s.seo?.keywords || "",
               seoOgImage: s.seo?.ogImage || "",
               googleAnalyticsId: s.analytics?.googleAnalyticsId || "",
               maintenanceMode: Boolean(s.maintenanceMode),
               customCSS: s.customCSS || "",
               customJS: s.customJS || "",
               footerText: s.footerText || "© 2026 Zain L. Alhamoud. All rights reserved.",
               createdAt: s.createdAt || new Date(),
               updatedAt: s.updatedAt || new Date()
            }
         });
      }

      res.status(200).json({ success: true, message: "Migration completed perfectly. All missing old data has been restored to PostgreSQL!" });

   } catch (err) {
      console.error('Migration failed:', err);
      res.status(500).json({ success: false, message: "Migration failed", error: err.message });
   } finally {
      await client.close();
   }
};
