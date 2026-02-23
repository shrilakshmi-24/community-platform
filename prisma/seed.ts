import 'dotenv/config';
import { PrismaClient, Role, UserStatus, ListingStatus, CareerType, SupportType, CollaborationType, HelpStatus, Priority } from '@prisma/client';

const prisma = new PrismaClient();

// Helpers for random data
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const LOCATIONS = ['Mumbai, Maharashtra', 'Bangalore, Karnataka', 'Delhi', 'Hyderabad, Telangana', 'Chennai, Tamil Nadu', 'Pune, Maharashtra', 'Ahmedabad, Gujarat', 'Kolkata, West Bengal', 'Jaipur, Rajasthan', 'Surat, Gujarat'];
const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Anika', 'Navya', 'Angel', 'Myra', 'Sara'];
const LAST_NAMES = ['Gupta', 'Sharma', 'Patel', 'Reddy', 'Kumar', 'Singh', 'Das', 'Roy', 'Mehta', 'Shah', 'Shenoy', 'Rao', 'Iyer', 'Nair'];
const BUSINESS_CATEGORIES = ['Retail', 'IT Services', 'Food & Beverage', 'Interior Design', 'Health & Fitness', 'Education', 'Construction', 'Logistics', 'Consulting'];
const TITLES = ['Senior Developer', 'Marketing Manager', 'Accountant', 'Sales Executive', 'HR Specialist', 'Operations Head', 'Graphic Designer', 'Content Writer'];

async function main() {
    console.log('🌱 Starting bulk database seeding...');

    // 1. Clear Data
    console.log('🗑️  Clearing existing data...');
    // Delete in order to avoid foreign key constraints
    await prisma.notification.deleteMany();
    await prisma.eventRegistration.deleteMany();
    await prisma.groupMember.deleteMany();
    await prisma.scholarshipApplication.deleteMany();
    await prisma.donationTransaction.deleteMany();

    await prisma.event.deleteMany();
    await prisma.group.deleteMany();
    await prisma.helpRequest.deleteMany();
    await prisma.careerListing.deleteMany();
    await prisma.businessListing.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.supportRequest.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.scholarship.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.newsletter.deleteMany();

    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();


    // 2. Create Users
    console.log('👥 Creating users...');
    const users = [];

    // Fixed Admin
    users.push(await prisma.user.create({
        data: {
            mobileNumber: '+919999999999',
            role: Role.ADMIN,
            status: UserStatus.ACTIVE,
            profile: {
                create: {
                    fullName: 'Super Admin',
                    email: 'admin@aryavysha.com',
                    address: 'Mumbai',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    bio: 'Platform Administrator',
                    isVerified: true
                }
            }
        }
    }));

    // Specific Demo Users
    users.push(await prisma.user.create({
        data: {
            mobileNumber: '+919876543210',
            role: Role.MEMBER,
            status: UserStatus.ACTIVE,
            profile: {
                create: { fullName: 'Rajesh Kumar', email: 'rajesh@example.com', city: 'Bangalore', state: 'Karnataka', isVerified: true }
            }
        }
    }));

    // Random Users
    for (let i = 0; i < 18; i++) {
        const fname = randomElement(FIRST_NAMES);
        const lname = randomElement(LAST_NAMES);
        const location = randomElement(LOCATIONS);
        const [city, state] = location.split(', ');

        users.push(await prisma.user.create({
            data: {
                mobileNumber: `+91${randomInt(6000000000, 9999999999)}`,
                role: Role.MEMBER,
                status: Math.random() > 0.1 ? UserStatus.ACTIVE : UserStatus.PENDING,
                profile: {
                    create: {
                        fullName: `${fname} ${lname}`,
                        email: `${fname.toLowerCase()}.${lname.toLowerCase()}${i}@example.com`,
                        address: location,
                        city: city,
                        state: state || city,
                        bio: 'Community member',
                        isVerified: Math.random() > 0.3
                    }
                }
            }
        }));
    }
    console.log(`✅ Created ${users.length} users`);

    // 3. Create Business Listings
    console.log('🏢 Creating business listings...');
    const businesses = [];
    for (let i = 0; i < 15; i++) {
        const owner = randomElement(users);
        businesses.push(await prisma.businessListing.create({
            data: {
                userId: owner.id,
                businessName: `${randomElement(LAST_NAMES)} ${randomElement(['Enterprises', 'Solutions', 'Traders', 'Fabrics', 'Tech', 'Foods'])}`,
                category: randomElement(BUSINESS_CATEGORIES),
                description: 'Providing high quality services and products to our community. Contact us for the best deals.',
                address: randomElement(LOCATIONS),
                contactPhone: `+91${randomInt(7000000000, 9999999999)}`,
                status: ListingStatus.APPROVED,
                publishDate: new Date(), // Important for visibility
                ownerName: owner.mobileNumber // Just using a placeholder or accessing profile name if we fetched it, but keeping it simple
            }
        }));
    }
    console.log(`✅ Created ${businesses.length} businesses`);

    // 4. Create Career Listings
    console.log('💼 Creating career listings...');
    for (let i = 0; i < 15; i++) {
        const owner = randomElement(users);
        const type = Math.random() > 0.5 ? CareerType.HIRING : CareerType.SEEKING;
        await prisma.careerListing.create({
            data: {
                userId: owner.id,
                title: randomElement(TITLES),
                type: type,
                description: type === CareerType.HIRING
                    ? 'We are looking for a skilled professional to join our team. Competitive salary and good growth opportunities.'
                    : 'Experienced professional seeking new challenges. Hardworking and dedicated.',
                company: type === CareerType.HIRING ? `${randomElement(LAST_NAMES)} Corp` : undefined,
                location: randomElement(LOCATIONS),
                salaryRange: `₹${randomInt(3, 10)} - ${randomInt(12, 25)} LPA`,
                status: ListingStatus.APPROVED,
                publishDate: new Date(), // Important for visibility
                skills: ['Communication', 'Management', 'Technical']
            }
        });
    }
    console.log('✅ Created career listings');

    // 5. Create Events
    console.log('📅 Creating events...');
    const eventTitles = ['Community Meetup', 'Youth Workshop', 'Diwali Gala', 'Business Networking', 'Health Camp', 'Educational Seminar', 'Cultural Night', 'Sports Day'];
    for (let i = 0; i < 12; i++) {
        const organizer = randomElement(users);
        const date = new Date();
        date.setDate(date.getDate() + randomInt(-10, 60)); // Some past, some future

        await prisma.event.create({
            data: {
                title: randomElement(eventTitles),
                description: 'Join us for an amazing event with the community. Food, fun, and networking guaranteed.',
                date: date,
                location: randomElement(LOCATIONS),
                organizerId: organizer.id,
                status: ListingStatus.APPROVED,
                publishDate: new Date(), // Important for visibility
                contactPhone: organizer.mobileNumber,

                // Registration & Volunteers
                registrationRequired: Math.random() > 0.3,
                maxParticipants: randomInt(50, 500),
                volunteersNeeded: Math.random() > 0.5,
                volunteerRoles: ['Usher', 'Catering', 'Logistics', 'Registration Desk']
            }
        });
    }
    console.log('✅ Created events');

    // 6. Create Help Requests
    console.log('🆘 Creating help requests...');
    const helpCats = ['Medical', 'Blood', 'Financial', 'Emotional', 'Career'];
    for (let i = 0; i < 12; i++) {
        const user = randomElement(users);
        const priority = randomElement(Object.values(Priority));
        const cat = randomElement(helpCats);

        await prisma.helpRequest.create({
            data: {
                userId: user.id,
                title: `${cat} Help Needed in ${randomElement(LOCATIONS).split(',')[0]}`,
                description: 'Urgently looking for support. Please connect if you can help. My family is in distress.',
                category: cat,
                priority: priority,
                location: randomElement(LOCATIONS),
                bloodGroup: cat === 'Blood' ? randomElement(['A+', 'B+', 'O+', 'AB-']) : null,
                contactPhone: user.mobileNumber,
                status: HelpStatus.OPEN
            }
        });
    }
    console.log('✅ Created help requests');

    // 7. Create Donations
    console.log('💰 Creating donations...');
    const donationCauses = ['Temple Construction', 'Medical Relief Fund', 'Education Scholarship', 'Disaster Relief', 'Community Hall Repair', 'Annadanam Fund', 'Old Age Home Support', 'Cow Shelter Support', 'Vedic School Fund', 'Festival Fund'];
    for (let i = 0; i < 12; i++) {
        const target = randomInt(50000, 1000000);
        await prisma.donation.create({
            data: {
                title: randomElement(donationCauses),
                description: 'Your contribution makes a difference. Please donate generously.',
                targetAmount: target,
                collectedAmount: randomInt(0, target),
                bankDetails: `Bank: SBI, Acct: ${randomInt(1000000000, 9999999999)}, IFSC: SBIN000${randomInt(1000, 9999)}`,
                upiId: 'donate@upi',
                isActive: true
            }
        });
    }
    console.log('✅ Created donation campaigns');

    // 8. Create Scholarships
    console.log('🎓 Creating scholarships...');
    for (let i = 0; i < 12; i++) {
        await prisma.scholarship.create({
            data: {
                title: `${randomElement(['Merit', 'Need-based', 'Sports', 'Arts', 'Women Empowerment', 'STEM', 'Research'])} Scholarship 2026`,
                description: 'Financial aid for deserving students.',
                amount: randomElement([10000, 25000, 50000, 100000]),
                deadline: new Date(new Date().setMonth(new Date().getMonth() + randomInt(1, 6))),
                educationLevel: randomElement(['Class 10', 'Class 12', 'Undergraduate', 'Postgraduate']),
                providerName: 'Arya Vyshya Trust',
                status: ListingStatus.APPROVED
            }
        });
    }
    console.log('✅ Created scholarships');

    // 9. Create Announcements
    console.log('📢 Creating announcements...');
    const announcementTitles = [
        'New Website Launch', 'AGM Meeting Scheduled', 'Community Picnic Photos', 'Award Ceremony Results', 'Volunteer Opportunity',
        'Holiday Notice', 'New Member Guidelines', 'Donation Drive Success', 'Upcoming Election', 'Membership Renewal'
    ];
    for (const title of announcementTitles) {
        await prisma.announcement.create({
            data: {
                userId: users[0].id,
                title: title,
                description: 'We are happy to announce this update to all members. Please check the details carefully.',
                isActive: true
            }
        });
    }
    // Add a few more random ones to be sure
    for (let i = 0; i < 5; i++) {
        await prisma.announcement.create({
            data: {
                userId: users[0].id,
                title: `Community Update #${i + 1}`,
                description: 'Latest news and updates from the community administration.',
                isActive: true
            }
        });
    }
    console.log('✅ Created announcements');

    // 10. Achievements
    console.log('🏆 Creating achievements...');
    for (let i = 0; i < 15; i++) {
        const user = randomElement(users);
        await prisma.achievement.create({
            data: {
                userId: user.id,
                title: `Award for ${randomElement(['Excellence', 'Community Service', 'Innovation', 'Leadership', 'Sports', 'Arts'])}`,
                description: 'Recognized for outstanding contribution and dedication.',
                date: new Date(),
                status: ListingStatus.APPROVED
            }
        })
    }
    console.log('✅ Created achievements');

    // 11. Support Requests
    console.log('💁 Creating support requests...');
    const supportTypes = [SupportType.FINANCIAL, SupportType.GUIDANCE, SupportType.OVERSEAS];
    for (let i = 0; i < 12; i++) {
        const user = randomElement(users);
        await prisma.supportRequest.create({
            data: {
                userId: user.id,
                type: randomElement(supportTypes),
                subject: 'Need assistance regarding community guidelines',
                details: 'I have a query about the new membership process. Please guide me.',
                status: ListingStatus.PENDING
            }
        });
    }
    console.log('✅ Created support requests');

    // 12. Create Updates/Newsletters
    console.log('📰 Creating newsletters...');
    for (let i = 0; i < 8; i++) {
        await prisma.newsletter.create({
            data: {
                title: `Monthly Newsletter - ${new Date().toLocaleString('default', { month: 'long' })} Edition ${i + 1}`,
                content: 'This month has been filled with exciting updates and community achievements. Read on to know more about our upcoming initiatives and success stories.',
                status: ListingStatus.APPROVED,
                publishedAt: new Date(new Date().setDate(new Date().getDate() - i * 7)), // Published in past weeks
                emailSubject: 'Community Updates & Highlights',
                emailSummary: 'Check out the latest news from your community platform.'
            }
        });
    }
    console.log('✅ Created newsletters');

    console.log('\n✨ Database bulk seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
