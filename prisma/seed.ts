import 'dotenv/config';
import { PrismaClient, Role, UserStatus, ListingStatus, CareerType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');
    console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.notification.deleteMany();
    await prisma.event.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.group.deleteMany();
    await prisma.helpRequest.deleteMany();
    await prisma.careerListing.deleteMany();
    await prisma.businessListing.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();

    // Create Users with Profiles
    console.log('👥 Creating users...');
    const users = await Promise.all([
        prisma.user.create({
            data: {
                mobileNumber: '+919876543210',
                role: Role.ADMIN,
                status: UserStatus.ACTIVE,
                profile: {
                    create: {
                        fullName: 'Admin User',
                        email: 'admin@aryavysha.com',
                        address: 'Mumbai, Maharashtra',
                        city: 'Mumbai',
                        state: 'Maharashtra',
                        bio: 'Platform Administrator',
                        isVerified: true
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                mobileNumber: '+919876543211',
                role: Role.MEMBER,
                status: UserStatus.ACTIVE,
                profile: {
                    create: {
                        fullName: 'Rajesh Kumar',
                        email: 'rajesh.kumar@example.com',
                        address: 'Bangalore, Karnataka',
                        city: 'Bangalore',
                        state: 'Karnataka',
                        bio: 'Software Engineer and Entrepreneur',
                        isVerified: true
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                mobileNumber: '+919876543212',
                role: Role.MEMBER,
                status: UserStatus.ACTIVE,
                profile: {
                    create: {
                        fullName: 'Priya Sharma',
                        email: 'priya.sharma@example.com',
                        address: 'Delhi',
                        city: 'Delhi',
                        state: 'Delhi',
                        bio: 'Business Owner - Textiles',
                        isVerified: true
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                mobileNumber: '+919876543213',
                role: Role.MEMBER,
                status: UserStatus.ACTIVE,
                profile: {
                    create: {
                        fullName: 'Sneha Reddy',
                        email: 'sneha.reddy@example.com',
                        address: 'Hyderabad, Telangana',
                        city: 'Hyderabad',
                        state: 'Telangana',
                        bio: 'HR Professional',
                        isVerified: true
                    }
                }
            }
        }),
        prisma.user.create({
            data: {
                mobileNumber: '+919876543214',
                role: Role.MEMBER,
                status: UserStatus.ACTIVE,
                profile: {
                    create: {
                        fullName: 'Amit Patel',
                        email: 'amit.patel@example.com',
                        address: 'Ahmedabad, Gujarat',
                        city: 'Ahmedabad',
                        state: 'Gujarat',
                        bio: 'Restaurant Owner',
                        isVerified: false
                    }
                }
            }
        })
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create Business Listings
    console.log('🏢 Creating business listings...');
    const businesses = await Promise.all([
        prisma.businessListing.create({
            data: {
                userId: users[2].id,
                businessName: 'Sharma Textiles',
                category: 'Retail',
                description: 'Premium quality traditional and modern fabrics. Family-owned business since 1975.',
                address: 'Chandni Chowk, Delhi',
                contactPhone: '+919876543212',
                website: 'https://sharmatextiles.com',
                status: ListingStatus.APPROVED
            }
        }),
        prisma.businessListing.create({
            data: {
                userId: users[4].id,
                businessName: 'Patel Sweets & Restaurant',
                category: 'Food & Beverage',
                description: 'Authentic Gujarati cuisine and traditional sweets.',
                address: 'Maninagar, Ahmedabad',
                contactPhone: '+919876543214',
                status: ListingStatus.APPROVED
            }
        }),
        prisma.businessListing.create({
            data: {
                userId: users[1].id,
                businessName: 'Kumar Tech Solutions',
                category: 'IT Services',
                description: 'Web development, mobile apps, and IT consulting services.',
                address: 'Koramangala, Bangalore',
                contactPhone: '+919876543211',
                website: 'https://kumartechsolutions.com',
                status: ListingStatus.APPROVED
            }
        })
    ]);

    console.log(`✅ Created ${businesses.length} business listings`);

    // Create Career Listings
    console.log('💼 Creating career listings...');
    const careers = await Promise.all([
        prisma.careerListing.create({
            data: {
                userId: users[1].id,
                title: 'Senior Full Stack Developer',
                type: CareerType.HIRING,
                description: 'Looking for an experienced full stack developer with expertise in React, Node.js, and PostgreSQL. 5+ years experience required.',
                company: 'Kumar Tech Solutions',
                location: 'Bangalore, Karnataka',
                salaryRange: '₹15-25 LPA',
                status: ListingStatus.APPROVED
            }
        }),
        prisma.careerListing.create({
            data: {
                userId: users[3].id,
                title: 'HR Manager Position',
                type: CareerType.SEEKING,
                description: 'Experienced HR professional seeking new opportunities. 8 years experience in recruitment and employee relations.',
                company: 'Available for hire',
                location: 'Hyderabad, Telangana',
                salaryRange: '₹12-18 LPA',
                status: ListingStatus.APPROVED
            }
        }),
        prisma.careerListing.create({
            data: {
                userId: users[2].id,
                title: 'Sales Executive',
                type: CareerType.HIRING,
                description: 'Looking for energetic sales professionals for our textile business.',
                company: 'Sharma Textiles',
                location: 'Delhi',
                salaryRange: '₹3-6 LPA',
                status: ListingStatus.APPROVED
            }
        })
    ]);

    console.log(`✅ Created ${careers.length} career listings`);

    // Create Groups
    console.log('👥 Creating community groups...');
    const groups = await Promise.all([
        prisma.group.create({
            data: {
                name: 'Entrepreneurs Network',
                description: 'A group for business owners and entrepreneurs to share experiences and opportunities.',
                ownerId: users[1].id
            }
        }),
        prisma.group.create({
            data: {
                name: 'Tech Professionals',
                description: 'Connect with fellow IT professionals, share knowledge, and discuss latest technologies.',
                ownerId: users[1].id
            }
        }),
        prisma.group.create({
            data: {
                name: 'Cultural Events Committee',
                description: 'Planning and organizing community cultural events and celebrations.',
                ownerId: users[0].id
            }
        })
    ]);

    console.log(`✅ Created ${groups.length} groups`);

    // Create Events
    console.log('📅 Creating events...');
    const events = await Promise.all([
        prisma.event.create({
            data: {
                title: 'Diwali Celebration',
                description: 'Join us for a grand Diwali celebration with cultural programs, food, and festivities.',
                date: new Date(new Date().setMonth(new Date().getMonth() + 1)), // 1 month from now
                location: 'Community Hall, Mumbai',
                organizerId: users[0].id,
                status: ListingStatus.APPROVED
            }
        }),
        prisma.event.create({
            data: {
                title: 'Business Networking Meetup',
                description: 'Monthly networking event for entrepreneurs and business owners.',
                date: new Date(new Date().setDate(new Date().getDate() + 14)), // 2 weeks from now
                location: 'Bangalore Convention Center',
                organizerId: users[1].id,
                status: ListingStatus.APPROVED
            }
        }),
        prisma.event.create({
            data: {
                title: 'Tech Talk: AI and Future',
                description: 'Discussion on AI trends and their impact on businesses.',
                date: new Date(new Date().setDate(new Date().getDate() + 7)), // 1 week from now
                location: 'Online (Zoom)',
                organizerId: users[1].id,
                status: ListingStatus.APPROVED
            }
        })
    ]);

    console.log(`✅ Created ${events.length} events`);

    // Create Achievements
    console.log('🏆 Creating achievements...');
    const achievements = await Promise.all([
        prisma.achievement.create({
            data: {
                userId: users[1].id,
                title: 'Best Entrepreneur 2023',
                description: 'Awarded for outstanding contribution to the local business community.',
                date: new Date('2023-12-15'),
                status: ListingStatus.APPROVED
            }
        }),
        prisma.achievement.create({
            data: {
                userId: users[2].id,
                title: 'Community Service Award',
                description: 'Recognized for organizing food donation drives during the festive season.',
                date: new Date('2024-01-26'),
                status: ListingStatus.APPROVED
            }
        })
    ]);

    console.log(`✅ Created ${achievements.length} achievements`);

    // Create Notifications
    console.log('🔔 Creating notifications...');
    const notifications = await Promise.all([
        prisma.notification.create({
            data: {
                userId: users[1].id,
                title: 'Welcome to Arya Vyshya Community!',
                message: 'Complete your profile to unlock all features.',
                type: 'INFO'
            }
        }),
        prisma.notification.create({
            data: {
                userId: users[2].id,
                title: 'Business Listing Approved',
                message: 'Your business "Sharma Textiles" has been approved and is now live!',
                type: 'SUCCESS'
            }
        }),
        prisma.notification.create({
            data: {
                userId: users[3].id,
                title: 'New Event: Diwali Celebration',
                message: 'Don\'t miss our grand Diwali celebration on November 1st!',
                type: 'INFO'
            }
        })
    ]);

    console.log(`✅ Created ${notifications.length} notifications`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${users.length} users`);
    console.log(`   - ${businesses.length} business listings`);
    console.log(`   - ${careers.length} career listings`);
    console.log(`   - ${groups.length} groups`);
    console.log(`   - ${events.length} events`);
    console.log(`   - ${achievements.length} achievements`);
    console.log(`   - ${notifications.length} notifications`);
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
