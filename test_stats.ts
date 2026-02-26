import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        const totalUsers = await prisma.user.count();
        const pendingUsers = await prisma.user.count({ where: { status: 'PENDING' } });
        const pendingBusiness = await prisma.businessListing.count({ where: { status: 'PENDING' } });
        const pendingCareer = await prisma.careerListing.count({ where: { status: 'PENDING' } });
        const pendingEvents = await prisma.event.count({ where: { status: 'PENDING' } });
        const pendingServices = await prisma.helpRequest.count({ where: { status: 'OPEN' as any } });
        console.log({ totalUsers, pendingUsers, pendingBusiness, pendingCareer, pendingEvents, pendingServices });
    } catch (e) {
        console.error("ERROR", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
