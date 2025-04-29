import axios from 'axios';

export class NotificationService {
  static async sendNotificationToHealthProf(userId, event) {
    try {
      const response = await axios.post('/api/notifications/health-prof', {
        userId,
        event,
      });
      console.log('Health Professional notified:', response.data);
    } catch (error) {
      console.error('Error sending notification to health professional:', error);
    }
  }

  static async sendNotificationToMom(userId, event) {
    try {
      const response = await axios.post('/api/notifications/mom', {
        userId,
        event,
      });
      console.log('Mom notified:', response.data);
    } catch (error) {
      console.error('Error sending notification to mom:', error);
    }
  }
}
