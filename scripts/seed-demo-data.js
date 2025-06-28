// Script to seed demo data for testing
// Run with: node scripts/seed-demo-data.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDemoData() {
  try {
    console.log('Seeding demo data...');

    // Create demo users
    const hashedPassword = await bcrypt.hash('password123', 12);

    const demoUser1 = await prisma.user.upsert({
      where: { email: 'john.doe@miningcorp.ca' },
      update: {},
      create: {
        email: 'john.doe@miningcorp.ca',
        password: hashedPassword,
        name: 'John Doe',
        title: 'Senior Legal Analyst',
        role: 'USER',
        jurisdictionPreferences: {
          create: [
            { jurisdiction: 'federal', enabled: true, priority: 1 },
            { jurisdiction: 'ontario', enabled: true, priority: 2 },
            { jurisdiction: 'bc', enabled: false, priority: 3 },
          ]
        },
        notificationSettings: {
          create: {}
        }
      }
    });

    const demoUser2 = await prisma.user.upsert({
      where: { email: 'sarah.smith@goldvalley.ca' },
      update: {},
      create: {
        email: 'sarah.smith@goldvalley.ca',
        password: hashedPassword,
        name: 'Sarah Smith',
        title: 'Compliance Manager',
        role: 'USER',
        jurisdictionPreferences: {
          create: [
            { jurisdiction: 'federal', enabled: true, priority: 1 },
            { jurisdiction: 'alberta', enabled: true, priority: 2 },
          ]
        },
        notificationSettings: {
          create: {}
        }
      }
    });

    console.log('Demo users created:', {
      user1: demoUser1.email,
      user2: demoUser2.email
    });

    // Create demo organization
    const demoOrg = await prisma.organization.upsert({
      where: { slug: 'northern-mining-corp' },
      update: {},
      create: {
        name: 'Northern Mining Corp',
        slug: 'northern-mining-corp',
        description: 'Leading mining company in Northern Canada',
        industry: 'Mining',
        size: '201-1000',
        website: 'https://northernmining.ca',
        memberships: {
          create: [
            {
              userId: demoUser1.id,
              role: 'OWNER'
            },
            {
              userId: demoUser2.id,
              role: 'ADMIN'
            }
          ]
        },
        settings: {
          create: {
            defaultJurisdictions: JSON.stringify(['federal', 'ontario'])
          }
        }
      }
    });

    console.log('Demo organization created:', demoOrg.name);

    // Create demo teams
    const legalTeam = await prisma.team.create({
      data: {
        name: 'Legal & Compliance Team',
        description: 'Handles all legal and regulatory compliance matters',
        organizationId: demoOrg.id,
        memberships: {
          create: [
            {
              userId: demoUser1.id,
              role: 'ADMIN'
            },
            {
              userId: demoUser2.id,
              role: 'MEMBER'
            }
          ]
        }
      }
    });

    const operationsTeam = await prisma.team.create({
      data: {
        name: 'Operations Team',
        description: 'Mining operations and safety compliance',
        organizationId: demoOrg.id,
        memberships: {
          create: [
            {
              userId: demoUser2.id,
              role: 'LEAD'
            }
          ]
        }
      }
    });

    console.log('Demo teams created:', {
      legal: legalTeam.name,
      operations: operationsTeam.name
    });

    // Create demo subscription
    const demoSubscription = await prisma.subscription.create({
      data: {
        type: 'ORGANIZATION',
        plan: 'PROFESSIONAL',
        status: 'ACTIVE',
        organizationId: demoOrg.id,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });

    console.log('Demo subscription created:', demoSubscription.plan);

    console.log('\n=== DEMO DATA SEEDED SUCCESSFULLY ===');
    console.log('You can now log in with:');
    console.log('Email: john.doe@miningcorp.ca');
    console.log('Password: password123');
    console.log('');
    console.log('Or:');
    console.log('Email: sarah.smith@goldvalley.ca');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error seeding demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seedDemoData();
}

module.exports = { seedDemoData };
