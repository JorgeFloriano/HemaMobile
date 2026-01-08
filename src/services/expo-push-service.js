// services/expo-push-service.js
import * as Notifications from 'expo-notifications';

export class ExpoPushService {
  static async getPushToken() {
    const { status } = await Notifications.getPermissionsAsync();
    
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        throw new Error('Permissão negada para notificações');
      }
    }
    
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: 'seu-project-id', // Encontre no app.json ou eas.json
    })).data;
    
    return token;
  }
}