import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');

        if (process.env.NODE_ENV !== 'production') {
            const PORT = process.env.PORT || 5000;
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }

        process.on('unhandledRejection', (err: Error) => {
            console.error('UNHANDLED REJECTION! 💥 Shutting down...');
            console.error(err.name, err.message);
        });

        process.on('uncaughtException', (err: Error) => {
            console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
            console.error(err.name, err.message);
        });

    } catch (error) {
        console.error('Failed to connect to database', error);
        setTimeout(startServer, 5000);
    }
};

startServer();

export default app;
