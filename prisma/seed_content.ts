import { PrismaClient, ListingStatus, CareerType, Visibility } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting content seed...');

    // 1. Find a user to assign content to (preferably Admin, or just the first user)
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error('❌ No user found. Please register at least one user first.');
        return;
    }
    const userId = user.id;

    // --- Cleanup "Ghost" Data (missing publishDate) ---
    console.log('🧹 Cleaning up invalid seed data...');
    try {
        await prisma.businessListing.deleteMany({ where: { publishDate: null } });
        await prisma.careerListing.deleteMany({ where: { publishDate: null } });
        // Scholarships with isActive=true might be visible, but let's clean up null publishDates to be clean
        await prisma.scholarship.deleteMany({ where: { publishDate: null, isActive: false } });
    } catch (e) {
        console.warn('Cleanup failed or no data to clean:', e);
    }

    // --- Business Listings ---
    console.log('Creating Business Listings...');
    const businesses = [
        {
            businessName: "Green Earth Organics",
            category: "Retail",
            description: "Providing fresh, organic produce directly from farmers to your doorstep.",
            address: "123 Green Ave, Bangalore",
            contactPhone: "9876543210",
            website: "https://greenearth.example.com",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        },
        {
            businessName: "TechNova Solutions",
            category: "IT Services",
            description: "Custom software development and cloud consulting services.",
            address: "456 Tech Park, Hyderabad",
            contactPhone: "9876543211",
            website: "https://technova.example.com",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        },
        {
            businessName: "Spice Route Catering",
            category: "Food & Beverage",
            description: "Authentic traditional catering for weddings and events.",
            address: "789 Spice Lane, Chennai",
            contactPhone: "9876543212",
            website: "https://spiceroute.example.com",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        },
        {
            businessName: "Urban Decor",
            category: "Interior Design",
            description: "Modern interior design solutions for homes and offices.",
            address: "101 Design Blvd, Mumbai",
            contactPhone: "9876543213",
            website: "https://urbandecor.example.com",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        },
        {
            businessName: "Elite Fitness Studio",
            category: "Health & Fitness",
            description: "Premium fitness center with personal training and group classes.",
            address: "202 Fit Street, Pune",
            contactPhone: "9876543214",
            website: "https://elitefitness.example.com",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        }
    ];

    for (const b of businesses) {
        await prisma.businessListing.create({
            data: { ...b, userId }
        });
    }

    // --- Career Listings ---
    console.log('Creating Career Listings...');
    const careers = [
        {
            title: "Senior Full Stack Dev",
            type: CareerType.HIRING,
            description: "Looking for an experienced developer with Node.js and React skills.",
            company: "TechNova Solutions",
            location: "Hyderabad (Remote)",
            salaryRange: "20-30 LPA",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        },
        {
            title: "Digital Marketing Manager",
            type: CareerType.HIRING,
            description: "Lead our marketing campaigns and social media strategy.",
            company: "Green Earth Organics",
            location: "Bangalore",
            salaryRange: "10-15 LPA",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        },
        {
            title: "Interior Designer Intern",
            type: CareerType.HIRING,
            description: "Opportunity for fresh graduates to learn from industry experts.",
            company: "Urban Decor",
            location: "Mumbai",
            salaryRange: "10-15k / month",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        },
        {
            title: "Sales Executive",
            type: CareerType.SEEKING,
            description: "Experienced sales professional looking for opportunities in Retail or FMCG.",
            company: "N/A",
            location: "Chennai",
            salaryRange: "Negotiable",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        },
        {
            title: "Seeking Accounting Role",
            type: CareerType.SEEKING,
            description: "CA Inter with 2 years experience in auditing.",
            company: "N/A",
            location: "Pune",
            salaryRange: "Negotiable",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            publishDate: new Date()
        }
    ];

    for (const c of careers) {
        await prisma.careerListing.create({
            data: { ...c, userId }
        });
    }

    // --- Scholarships ---
    console.log('Creating Scholarships...');
    const scholarships = [
        {
            title: "Merit Excellence Scholarship 2026",
            description: "Awarded to students with outstanding academic records in 12th standard.",
            amount: 50000,
            deadline: new Date('2026-06-30'),
            educationLevel: "Undergraduate",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            providerName: "Community Trust",
            publishDate: new Date()
        },
        {
            title: "Women in Tech Grant",
            description: "Supporting women pursuing degrees in Computer Science and Engineering.",
            amount: 75000,
            deadline: new Date('2026-08-15'),
            educationLevel: "Postgraduate",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            providerName: "Tech Innovators Foundation",
            publishDate: new Date()
        },
        {
            title: "Arts & Culture Fellowship",
            description: "For students pursuing Fine Arts, Music, or Dance.",
            amount: 25000,
            deadline: new Date('2026-05-20'),
            educationLevel: "Diploma/Degree",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            providerName: "Art Council",
            publishDate: new Date()
        },
        {
            title: "Global Education Support",
            description: "Financial aid for students admitted to foreign universities.",
            amount: 100000,
            deadline: new Date('2026-09-01'),
            educationLevel: "Masters",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            providerName: "Overseas Alumni",
            publishDate: new Date()
        },
        {
            title: "Need-Based School Aid",
            description: "Supporting school fees for underprivileged students.",
            amount: 15000,
            deadline: new Date('2026-04-10'),
            educationLevel: "School",
            status: ListingStatus.APPROVED,
            visibility: Visibility.ALL_MEMBERS,
            providerName: "Community Welfare",
            publishDate: new Date()
        }
    ];

    for (const s of scholarships) {
        await prisma.scholarship.create({
            data: s
        });
    }

    // --- Achievements (for Carousel) ---
    console.log('Creating Achievements...');
    const achievements = [
        {
            title: "National Startup Award",
            description: "Recognized as the best emerging startup in the sustainable agriculture sector.",
            date: new Date(),
            proofUrl: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=1000",
            status: ListingStatus.APPROVED
        },
        {
            title: "Gold Medalist - University",
            description: "Secured 1st rank in Computer Science Engineering at State University.",
            date: new Date(),
            proofUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&q=80&w=1000",
            status: ListingStatus.APPROVED
        },
        {
            title: "Community Service Hero",
            description: "Awarded for 500+ hours of community service and volunteering.",
            date: new Date(),
            proofUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1000",
            status: ListingStatus.APPROVED
        },
        {
            title: "Published Author",
            description: "Published a best-selling novel on cultural heritage.",
            date: new Date(),
            proofUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1000",
            status: ListingStatus.APPROVED
        },
        {
            title: "State Level Chess Champion",
            description: "Won the state level chess championship 2025.",
            date: new Date(),
            proofUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=1000",
            status: ListingStatus.APPROVED
        },
        {
            title: "Local Art Exhibition Winner",
            description: "First prize in the annual city art exhibition.",
            date: new Date(),
            status: ListingStatus.APPROVED
            // No image for this one to test Grid
        }
    ];

    for (const a of achievements) {
        await prisma.achievement.create({
            data: { ...a, userId }
        });
    }

    console.log('✅ Content seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
