import cron from 'node-cron';
import { notifyDeadlineApproaching } from '../controllers/notification.controller.js';

// Setup cron jobs for notifications
export const setupNotificationJobs = () => {
    // Run deadline check every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('Running deadline notifications check...');
        try {
            await notifyDeadlineApproaching();
            console.log('Deadline notifications check completed');
        } catch (error) {
            console.error('Error checking deadlines:', error);
        }
    });
    
    console.log('Notification jobs scheduled');
};
