
import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');

        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err: Error) => {
            console.error('UNHANDLED REJECTION! 💥 Shutting down...');
            console.error(err.name, err.message);
            // Ideally we should close the server, but for dev we might want to keep it running or restart
            // server.close(() => { process.exit(1); });
            // For now, just log it to prevent silent failure if it's minor
        });

        process.on('uncaughtException', (err: Error) => {
            console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
            console.error(err.name, err.message);
            // server.close(() => { process.exit(1); });
        });

    } catch (error) {
        console.error('Failed to connect to database', error);
        // Retry logic or graceful exit
        setTimeout(startServer, 5000); // Retry after 5 seconds instead of crashing
    }
};

startServer();
