import 'dotenv/config';
import { PrismaClient, ListingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🏆 Adding achievements...');

    // Get some users to assign achievements to
    const users = await prisma.user.findMany({ take: 3 });

    if (users.length === 0) {
        console.log('No users found. Please run the main seed first.');
        return;
    }

    const achievementsData = [
        {
            title: 'Young Innovator Award',
            description: 'Awarded for developing a sustainable waste management solution for the local community.',
            date: new Date('2024-03-10'),
            userId: users[0].id
        },
        {
            title: 'Excellence in Arts',
            description: 'First prize in the State Level Classical Dance Competition held in Chennai.',
            date: new Date('2024-02-15'),
            userId: users[1] ? users[1].id : users[0].id
        },
        {
            title: 'Academic Topper 2023',
            description: 'Achieved highest marks in the district for Class 12 board examinations.',
            date: new Date('2023-06-01'),
            userId: users[2] ? users[2].id : users[0].id
        },
        {
            title: 'Best Startup Pitch',
            description: 'Winner of the Annual Entrepreneurship Summit for the "Eco-Textile" project.',
            date: new Date('2024-01-20'),
            userId: users[0].id
        },
        {
            title: 'Community Hero',
            description: 'Honored for volunteering over 500 hours at the local animal shelter.',
            date: new Date('2023-11-12'),
            userId: users[1] ? users[1].id : users[0].id
        },
        {
            title: 'National Sports Champion',
            description: 'Gold Medalist in 100m sprint at the National Youth Games.',
            date: new Date('2024-04-05'),
            userId: users[2] ? users[2].id : users[0].id
        }
    ];

    for (const achievement of achievementsData) {
        await prisma.achievement.create({
            data: {
                ...achievement,
                status: ListingStatus.APPROVED
            }
        });
    }

    console.log(`✅ Successfully added ${achievementsData.length} achievements.`);
}

main()
    .catch((e) => {
        console.error('❌ Error adding achievements:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
