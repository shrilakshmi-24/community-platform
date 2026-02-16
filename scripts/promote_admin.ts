
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const mobileNumbers = ['9876543210', '9999999999', '+919876543210', '8888888888', '9000000000'];
    console.log(`Promoting users with mobile numbers: ${mobileNumbers.join(', ')} to ADMIN...`);

    const result = await prisma.user.updateMany({
        where: {
            mobileNumber: {
                in: mobileNumbers
            }
        },
        data: {
            role: 'ADMIN'
        }
    });

    console.log(`Updated ${result.count} users to ADMIN.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
